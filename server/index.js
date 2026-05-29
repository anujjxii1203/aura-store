console.log("Starting server boot sequence...");
process.on('uncaughtException', (err) => {
  console.error("FATAL UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error("FATAL UNHANDLED REJECTION:", err);
  process.exit(1);
});

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log("Environment variables loaded.");

const express = require('express'); 
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID, createHmac } = require('crypto');
const Razorpay = require('razorpay');
const { Resend } = require('resend');
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const sendOrderEmail = async (email, orderRef, amount) => {
  if (!resend) {
    console.log('Resend API key missing. Email not sent.');
    return;
  }
  try {
    await resend.emails.send({
      from: 'Aura Store <onboarding@resend.dev>',
      to: email,
      subject: `Order Confirmed! #${orderRef}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #e11b23;">AURA STORE</h1>
          <h2>Thank you for your order!</h2>
          <p>We've received your payment of <strong>INR ${amount}</strong>.</p>
          <p>Order Reference: <strong>${orderRef}</strong></p>
          <p>Your premium streetwear will be shipped shortly.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">This is an automated confirmation email.</p>
        </div>
      `
    });
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
console.log("All modules required successfully.");

const { all, get, initDatabase, run } = require('./database');
console.log("Database module loaded.");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

const app = express();
const PORT = Number.parseInt(process.env.PORT, 10) || 5055;
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_change_me';
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

console.log('CORS allowed origins:', allowedOrigins);
console.log('Environment loaded successfully');

app.use(cors({
  origin(origin, callback) {
    // Allow all origins for easier deployment
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function parseGender(value) {
  const normalized = String(value || '').trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (normalized === 'men' || normalized === 'male') {
    return 'Men';
  }

  if (normalized === 'women' || normalized === 'female') {
    return 'Women';
  }

  return undefined;
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN },
  );
}

function parseAmount(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return Math.round(amount);
}

function sanitizeCardNumber(value) {
  return String(value || '').replace(/\D/g, '');
}

function isValidExpiry(value) {
  const match = String(value || '').trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

  if (!match) {
    return false;
  }

  const month = Number.parseInt(match[1], 10);
  const year = 2000 + Number.parseInt(match[2], 10);
  const expiryDate = new Date(year, month);
  const now = new Date();
  return expiryDate > new Date(now.getFullYear(), now.getMonth());
}

function normalizePaymentPayload(body) {
  const method = String(body.method || '').trim().toLowerCase();
  const amount = parseAmount(body.amount);

  if (!['card', 'upi', 'cod'].includes(method)) {
    return { error: 'Choose Card, UPI, or Cash on Delivery before placing the order.' };
  }

  if (!amount || amount <= 0) {
    return { error: 'Payment amount must be greater than zero.' };
  }

  if (method === 'card') {
    const cardNumber = sanitizeCardNumber(body.cardNumber);
    const cvv = String(body.cvv || '').trim();
    const cardName = String(body.cardName || '').trim();

    if (cardNumber.length < 12 || cardNumber.length > 19) {
      return { error: 'Enter a valid card number.' };
    }

    if (!cardName) {
      return { error: 'Name on card is required.' };
    }

    if (!isValidExpiry(body.expiry)) {
      return { error: 'Enter a valid future expiry date in MM/YY format.' };
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return { error: 'Enter a valid CVV.' };
    }

    return {
      amount,
      method,
      metadata: {
        brand: cardNumber.startsWith('4') ? 'Visa' : 'Card',
        last4: cardNumber.slice(-4),
      },
    };
  }

  if (method === 'upi') {
    const upiId = String(body.upiId || '').trim().toLowerCase();

    if (!/^[a-z0-9.\-_]{2,}@[a-z]{2,}$/i.test(upiId)) {
      return { error: 'Enter a valid UPI ID, for example name@bank.' };
    }

    const [handle] = upiId.split('@');

    return {
      amount,
      method,
      metadata: {
        upi: `${handle.slice(0, 2)}***@${upiId.split('@')[1]}`,
      },
    };
  }

  return {
    amount,
    method,
    metadata: {
      note: 'Collect payment at delivery',
    },
  };
}

function requireAuth(req, res, next) {
  const authHeader = req.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    res.status(401).json({ message: 'Authentication token is missing. Please log in again.' });
    return;
  }

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Your session has expired or is invalid. Please log in again.' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

app.get('/api/products', asyncHandler(async (req, res) => {
  const gender = parseGender(req.query.gender);

  if (gender === undefined) {
    res.status(400).json({ message: 'Gender filter must be either Men or Women.' });
    return;
  }

  const search = String(req.query.search || '').trim().toLowerCase();
  const where = [];
  const params = [];

  if (gender) {
    where.push('gender = ?');
    params.push(gender);
  }

  if (search) {
    where.push('(LOWER(name) LIKE ? OR LOWER(category) LIKE ? OR LOWER(description) LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const products = await all(
    `SELECT id, name, price, image, description, category, gender
     FROM products
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY id DESC`,
    params,
  );

  res.json(products);
}));

app.post('/api/products', asyncHandler(async (req, res) => {
  const { name, price, image, description, category, gender } = req.body;
  
  if (!name || !price || !image || !description || !category || !gender) {
    res.status(400).json({ message: 'All product fields are required.' });
    return;
  }

  const result = await run(
    'INSERT INTO products (name, price, image, description, category, gender) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
    [name, Number(price), image, description, category, gender]
  );

  res.status(201).json({ message: 'Product added successfully', id: result.lastID });
}));

app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const productId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(productId) || productId <= 0) {
    res.status(400).json({ message: 'Product id must be a positive number.' });
    return;
  }

  const product = await get(
    `SELECT id, name, price, image, description, category, gender
     FROM products
     WHERE id = ?`,
    [productId],
  );

  if (!product) {
    res.status(404).json({ message: 'Product was not found.' });
    return;
  }

  const reviews = await all('SELECT id, username, rating, comment, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [productId]);
  res.json({ ...product, reviews });
}));

app.post('/api/reviews', requireAuth, asyncHandler(async (req, res) => {
  const { product_id, rating, comment } = req.body;
  const username = req.auth.username;

  if (!product_id || !rating || !comment) {
    res.status(400).json({ message: 'All fields are required.' });
    return;
  }

  await run(
    'INSERT INTO reviews (product_id, username, rating, comment) VALUES (?, ?, ?, ?)',
    [product_id, username, rating, comment]
  );

  res.status(201).json({ message: 'Review added successfully' });
}));

app.post('/api/register', asyncHandler(async (req, res) => {
  const username = String(req.body.name || req.body.username || '').trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!username) {
    res.status(400).json({ message: 'Full name is required to create an account.' });
    return;
  }

  if (!email || !email.includes('@')) {
    res.status(400).json({ message: 'Please enter a valid email address.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    return;
  }

  const existingUser = await get('SELECT id FROM users WHERE email = ?', [email]);

  if (existingUser) {
    res.status(409).json({ message: 'An account already exists with this email. Please log in.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?) RETURNING id',
    [username, email, passwordHash],
  );
  const user = { id: result.lastID, username, email };

  res.status(201).json({
    message: 'Account created successfully.',
    token: signToken(user),
    user,
  });
}));

app.post('/api/login', asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !email.includes('@')) {
    res.status(400).json({ message: 'Please enter the email address linked to your account.' });
    return;
  }

  if (!password) {
    res.status(400).json({ message: 'Please enter your password.' });
    return;
  }

  const user = await get('SELECT id, username, email, password FROM users WHERE email = ?', [email]);

  if (!user || !user.password) {
    res.status(401).json({ message: 'No password-based account was found for this email.' });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    res.status(401).json({ message: 'The email or password you entered is incorrect.' });
    return;
  }

  res.json({
    message: 'Login successful.',
    token: signToken(user),
    user: publicUser(user),
  });
}));

app.get('/api/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await get('SELECT id, username, email FROM users WHERE id = ?', [req.auth.id]);

  if (!user) {
    res.status(404).json({ message: 'The signed-in user no longer exists.' });
    return;
  }

  res.json({ user });
}));

app.delete('/api/users/me', requireAuth, asyncHandler(async (req, res) => {
  // Delete user's payments first (if any) since we don't have cascade delete
  await run('DELETE FROM payments WHERE user_id = ?', [req.auth.id]);
  
  // Delete the user
  const result = await run('DELETE FROM users WHERE id = ?', [req.auth.id]);
  
  if (result.changes === 0) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  res.json({ message: 'Account deleted successfully from database.' });
}));

app.get('/api/users', requireAuth, asyncHandler(async (req, res) => {
  const users = await all(
    'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC, id DESC',
  );

  res.json(users);
}));

app.get('/api/admin/stats', asyncHandler(async (req, res) => {
  const users = await all('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC');
  const products = await all('SELECT id, name, price, category, stock FROM products');
  const payments = await all('SELECT id, amount, status, method, reference, created_at, status_track FROM payments ORDER BY created_at DESC');
  const coupons = await all('SELECT * FROM coupons');
  
  res.json({
    users,
    products,
    payments,
    coupons,
    db_status: 'Connected to Supabase PostgreSQL'
  });
}));

// --- COUPON ROUTES ---
app.post('/api/coupons/validate', asyncHandler(async (req, res) => {
  const { code } = req.body;
  const coupon = await get('SELECT * FROM coupons WHERE code = ? AND active = TRUE', [code]);
  
  if (!coupon) {
    res.status(404).json({ message: 'Invalid or expired coupon code.' });
    return;
  }
  
  res.json(coupon);
}));

app.post('/api/admin/coupons', asyncHandler(async (req, res) => {
  const { code, discount_type, discount_value } = req.body;
  await run('INSERT INTO coupons (code, discount_type, discount_value) VALUES (?, ?, ?)', [code, discount_type, discount_value]);
  res.status(201).json({ message: 'Coupon created successfully' });
}));

// --- ORDER TRACKING ROUTES ---
app.get('/api/orders/me', requireAuth, asyncHandler(async (req, res) => {
  const orders = await all('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC', [req.auth.id]);
  res.json(orders);
}));

app.patch('/api/admin/orders/:id', asyncHandler(async (req, res) => {
  const { status_track } = req.body;
  await run('UPDATE payments SET status_track = ? WHERE id = ?', [status_track, req.params.id]);
  res.json({ message: 'Order status updated' });
}));

app.post('/api/payments/razorpay-order', requireAuth, asyncHandler(async (req, res) => {
  const amount = parseAmount(req.body.amount);
  
  if (!amount || amount <= 0) {
    res.status(400).json({ message: 'Payment amount must be greater than zero.' });
    return;
  }

  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('YOUR_KEY_ID')) {
    // Return a mock order if no keys configured to prevent crash for testing UI
    res.json({ id: `order_mock_${Date.now()}`, amount: amount * 100, currency: 'INR' });
    return;
  }

  const options = {
    amount: amount * 100, // Razorpay works in paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: 'Failed to create Razorpay order.' });
  }
}));

app.post('/api/payments', requireAuth, asyncHandler(async (req, res) => {
  const method = String(req.body.method || '').trim().toLowerCase();
  
  if (method === 'card' || method === 'upi') {
    // Razorpay flow
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, metadata } = req.body;
    
    if (process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_SECRET.includes('YOUR_KEY_SECRET')) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
         res.status(400).json({ message: 'Payment verification failed. Missing signature parameters.' });
         return;
      }
      const generatedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                 .update(razorpay_order_id + "|" + razorpay_payment_id)
                                 .digest('hex');
                                 
      if (generatedSignature !== razorpay_signature) {
        res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
        return;
      }
    }
    
    // Signature valid or in mock mode
    const paymentId = razorpay_payment_id || `pay_${randomUUID().replace(/-/g, '').slice(0, 18)}`;
    const reference = razorpay_order_id || `AURA-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    
    await run(
      `INSERT INTO payments (id, user_id, amount, method, status, reference, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        paymentId,
        req.auth.id,
        amount,
        method,
        'paid',
        reference,
        JSON.stringify(metadata || {}),
      ],
    );

    res.status(201).json({
      payment: {
        id: paymentId,
        amount: amount,
        method: method,
        status: 'paid',
        reference,
        metadata: metadata || {},
      },
    });

    // Send Order Email
    if (req.auth && req.auth.email) {
      sendOrderEmail(req.auth.email, reference, amount);
    }
    return;
  }
  
  // existing code for COD flow
  const normalized = normalizePaymentPayload(req.body);

  if (normalized.error) {
    res.status(400).json({ message: normalized.error });
    return;
  }

  const paymentId = `pay_${randomUUID().replace(/-/g, '').slice(0, 18)}`;
  const reference = `AURA-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const status = normalized.method === 'cod' ? 'pending' : 'paid';

  await run(
    `INSERT INTO payments (id, user_id, amount, method, status, reference, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      paymentId,
      req.auth.id,
      normalized.amount,
      normalized.method,
      status,
      reference,
      JSON.stringify(normalized.metadata),
    ],
  );

  // Send Order Email
  if (req.auth && req.auth.email) {
    sendOrderEmail(req.auth.email, reference, normalized.amount || req.body.amount);
  }

  res.status(201).json({
    payment: {
      id: paymentId,
      amount: normalized.amount,
      method: normalized.method,
      status,
      reference,
      metadata: normalized.metadata,
    },
  });
}));

app.post('/api/auth/google', asyncHandler(async (req, res) => {
  const googleId = String(req.body.googleId || '').trim();
  const username = String(req.body.name || '').trim();
  const email = normalizeEmail(req.body.email);

  if (!googleId) {
    res.status(400).json({ message: 'Google account id is required.' });
    return;
  }

  if (!username) {
    res.status(400).json({ message: 'Google profile name is required.' });
    return;
  }

  if (!email || !email.includes('@')) {
    res.status(400).json({ message: 'Google profile email must be valid.' });
    return;
  }

  let user = await get(
    'SELECT id, username, email, google_id FROM users WHERE google_id = ? OR email = ?',
    [googleId, email],
  );

  if (user) {
    if (!user.google_id) {
      await run('UPDATE users SET google_id = ? WHERE id = ?', [googleId, user.id]);
    }
  } else {
    const result = await run(
      'INSERT INTO users (username, email, google_id) VALUES (?, ?, ?) RETURNING id',
      [username, email, googleId],
    );
    user = { id: result.lastID, username, email };
  }

  res.json({
    message: 'Login successful.',
    token: signToken(user),
    user: publicUser(user),
  });
}));

// Fallback for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: `API Route ${req.method} ${req.originalUrl} was not found.` });
});

// Serve frontend in production
const frontendDist = path.join(__dirname, '../client/dist');
app.use(express.static(frontendDist));
app.use((req, res) => {
  res.status(200).send("Aura Store Backend is running successfully! Please connect your frontend API calls to /api endpoints.");
});

app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('CORS blocked')) {
    res.status(403).json({ message: err.message });
    return;
  }

  if (err.code === 'SQLITE_CONSTRAINT') {
    res.status(409).json({ message: 'This record conflicts with existing data.' });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: 'The server could not complete this request. Please try again shortly.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

async function start() {
  try {
    await initDatabase();

    const server = app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or set a different PORT in server/.env.`);
        process.exit(1);
      }

      console.error('Server failed to start:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
