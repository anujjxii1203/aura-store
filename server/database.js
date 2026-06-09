const { Pool } = require('pg');
const path = require('path');

let dbType = 'sqlite';
let pool = null;
let sqliteDb = null;

const pgUrl = process.env.POSTGRES_URL;

if (pgUrl && pgUrl.trim() && !pgUrl.includes('placeholder')) {
  try {
    const connectionString = pgUrl.split('?')[0];
    pool = new Pool({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    dbType = 'postgres';
    console.log("Database driver initialized for PostgreSQL.");
  } catch (err) {
    console.warn("PostgreSQL Pool initialization failed. Falling back to SQLite:", err.message);
    dbType = 'sqlite';
  }
} else {
  console.log("No valid POSTGRES_URL environment variable found. Falling back to local SQLite.");
}

function getSqliteDb() {
  if (!sqliteDb) {
    const { DatabaseSync } = require('node:sqlite');
    sqliteDb = new DatabaseSync(path.join(__dirname, 'ecommerce.db'));
    console.log("Local SQLite database initialized at:", path.join(__dirname, 'ecommerce.db'));
  }
  return sqliteDb;
}

if (dbType === 'sqlite') {
  getSqliteDb();
}

const PRODUCT_SEED = [
  {
    id: 1,
    name: 'Yaperz Oversized Tee',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
    description: 'Heavyweight cotton oversized tee with a clean streetwear fit.',
    category: 'T-Shirts',
    gender: 'Men',
  },
  {
    id: 2,
    name: 'Urban Baggy Hoodie',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
    description: 'Premium fleece hoodie with a relaxed shape and soft interior.',
    category: 'Hoodies',
    gender: 'Men',
  },
  {
    id: 3,
    name: 'Signature Cargo Pants',
    price: 3199,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
    description: 'Tactical cargo pants with roomy utility pockets and durable cotton twill.',
    category: 'Bottomwear',
    gender: 'Men',
  },
  {
    id: 4,
    name: 'Desert Windbreaker',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight windbreaker built for layering through changing weather.',
    category: 'Outerwear',
    gender: 'Men',
  },
  {
    id: 5,
    name: 'Canvas High-Tops',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    description: 'Classic canvas high-top sneakers with a cushioned everyday sole.',
    category: 'Footwear',
    gender: 'Men',
  },
  {
    id: 6,
    name: 'Skeleton Peace Tee',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    description: 'Graphic cotton tee with a relaxed silhouette and bold front artwork.',
    category: 'T-Shirts',
    gender: 'Women',
  },
  {
    id: 7,
    name: 'Street Style Hoodie',
    price: 2399,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    description: 'Soft baggy hoodie designed for an easy layered streetwear look.',
    category: 'Hoodies',
    gender: 'Women',
  },
  {
    id: 8,
    name: 'High Waist Distressed Jeans',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
    description: 'High waist denim with a vintage wash and clean distress details.',
    category: 'Bottomwear',
    gender: 'Women',
  },
  {
    id: 9,
    name: 'Chunky White Sneakers',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=80',
    description: 'Platform sneakers with a cushioned sole and crisp white finish.',
    category: 'Footwear',
    gender: 'Women',
  },
  {
    id: 10,
    name: 'Urban Cargo Skirt',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80',
    description: 'Utility cargo skirt with structured pockets and a modern mini length.',
    category: 'Bottomwear',
    gender: 'Women',
  },
  {
    id: 11,
    name: 'Silk Street Top',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80',
    description: 'Smooth satin-finish top with a refined drape and oversized fit.',
    category: 'Tops',
    gender: 'Women',
  },
];

// Helper to convert SQLite ? to Postgres $1, $2, etc.
function convertQuery(query) {
  let count = 1;
  return query.replace(/\?/g, () => `$${count++}`);
}

async function run(sql, params = []) {
  if (dbType === 'postgres') {
    const pgSql = convertQuery(sql);
    const result = await pool.query(pgSql, params);
    const lastID = result.rows && result.rows.length > 0 ? result.rows[0].id : null;
    return { lastID, changes: result.rowCount };
  } else {
    const db = getSqliteDb();
    const stmt = db.prepare(sql);
    if (sql.toUpperCase().includes('RETURNING')) {
      const row = stmt.get(...params);
      const lastID = row ? (row.id || row.lastID || row.lastid) : null;
      return { lastID, changes: 1 };
    } else {
      const result = stmt.run(...params);
      return { lastID: result.lastInsertRowid, changes: result.changes };
    }
  }
}

async function get(sql, params = []) {
  if (dbType === 'postgres') {
    const pgSql = convertQuery(sql);
    const result = await pool.query(pgSql, params);
    return result.rows[0] || null;
  } else {
    const db = getSqliteDb();
    const stmt = db.prepare(sql);
    return stmt.get(...params) || null;
  }
}

async function all(sql, params = []) {
  if (dbType === 'postgres') {
    const pgSql = convertQuery(sql);
    const result = await pool.query(pgSql, params);
    return result.rows;
  } else {
    const db = getSqliteDb();
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  }
}

async function exec(sql) {
  if (dbType === 'postgres') {
    await pool.query(sql);
  } else {
    const db = getSqliteDb();
    db.exec(sql);
  }
}

async function close() {
  if (dbType === 'postgres') {
    if (pool) {
      await pool.end();
    }
  } else {
    if (sqliteDb) {
      sqliteDb.close();
      sqliteDb = null;
    }
  }
}

async function createUsersTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      google_id TEXT UNIQUE,
      role TEXT DEFAULT 'user',
      points INTEGER DEFAULT 500,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  try {
    if (dbType === 'postgres') {
      await run("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'");
      await run("ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 500");
      await run("ALTER TABLE users ADD COLUMN IF NOT EXISTS plain_password TEXT");
    } else {
      await run("ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 500");
    }
  } catch (err) {}

  try {
    if (dbType !== 'postgres') {
      await run("ALTER TABLE users ADD COLUMN plain_password TEXT");
    }
  } catch (err) {}

  await run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
}

async function createProductsTable() {
  // Use INTEGER PRIMARY KEY for SQLite auto-increment compatibility
  const idCol = dbType === 'postgres' ? 'id SERIAL PRIMARY KEY' : 'id INTEGER PRIMARY KEY AUTOINCREMENT';

  await run(`
    CREATE TABLE IF NOT EXISTS products (
      ${idCol},
      name TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0),
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women')),
      size TEXT,
      color TEXT,
      stock INTEGER DEFAULT 10,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed only if the table is empty (preserves admin-added products on restart)
  const existing = await get('SELECT COUNT(*) as cnt FROM products');
  if (!existing || existing.cnt === 0) {
    for (const product of PRODUCT_SEED) {
      await run(
        `INSERT INTO products (id, name, price, image, description, category, gender)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.name,
          product.price,
          product.image,
          product.description,
          product.category,
          product.gender,
        ],
      );
    }
    console.log('Products table seeded with default data.');
  }
}

async function createPaymentsTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL CHECK (amount > 0),
      method TEXT NOT NULL CHECK (method IN ('card', 'upi', 'cod')),
      status TEXT NOT NULL CHECK (status IN ('paid', 'pending')),
      provider TEXT NOT NULL DEFAULT 'demo',
      reference TEXT NOT NULL UNIQUE,
      metadata TEXT,
      status_track TEXT DEFAULT 'processing',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Ensure status_track exists if table already existed
  try {
    if (dbType === 'postgres') {
      await run('ALTER TABLE payments ADD COLUMN IF NOT EXISTS status_track TEXT DEFAULT \'processing\'');
    } else {
      await run('ALTER TABLE payments ADD COLUMN status_track TEXT DEFAULT \'processing\'');
    }
  } catch (err) {
    // Ignore if column already exists
  }

  await run('CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)');
}

async function createCouponsTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS coupons (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL,
      discount_value INTEGER NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default coupons — upsert to add any missing ones without duplicating
  const defaultCoupons = [
    { code: 'AURA10',    discount_type: 'percentage', discount_value: 10 },
    { code: 'AURA20',    discount_type: 'percentage', discount_value: 20 },
    { code: 'AURA30',    discount_type: 'percentage', discount_value: 30 },
    { code: 'WELCOME50', discount_type: 'percentage', discount_value: 50 },
    { code: 'FIRST25',   discount_type: 'percentage', discount_value: 25 },
    { code: 'SAVE15',    discount_type: 'percentage', discount_value: 15 },
    { code: 'VIP40',     discount_type: 'percentage', discount_value: 40 },
    { code: 'SUMMER5',   discount_type: 'percentage', discount_value: 5 },
    { code: 'LUCKY77',   discount_type: 'percentage', discount_value: 77 },
    { code: 'FREE100',   discount_type: 'percentage', discount_value: 100 },
  ];

  for (const c of defaultCoupons) {
    if (dbType === 'postgres') {
      await run(
        'INSERT INTO coupons (code, discount_type, discount_value) VALUES (?, ?, ?) ON CONFLICT (code) DO NOTHING',
        [c.code, c.discount_type, c.discount_value],
      );
    } else {
      await run(
        'INSERT OR IGNORE INTO coupons (code, discount_type, discount_value) VALUES (?, ?, ?)',
        [c.code, c.discount_type, c.discount_value],
      );
    }
  }
  console.log('Default coupons synced.');
}

async function createReviewsTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      image TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    if (dbType === 'postgres') {
      await run('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS image TEXT');
    } else {
      await run('ALTER TABLE reviews ADD COLUMN image TEXT');
    }
  } catch (err) {}

  await run('CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id)');
}

async function createWishlistTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    )
  `);
  await run('CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id)');
}

let initPromise;

async function initializeDatabase() {
  if (dbType === 'postgres') {
    try {
      console.log("Attempting to connect to PostgreSQL...");
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await createUsersTable();
        await createProductsTable();
        await createPaymentsTable();
        await createCouponsTable();
        await createReviewsTable();
        await createWishlistTable();
        await client.query('COMMIT');
        console.log("PostgreSQL database initialized successfully.");
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error("PostgreSQL connection or initialization failed:", err.message);
      console.warn("SWITCHING TO LOCAL SQLITE FALLBACK...");
      dbType = 'sqlite';
      getSqliteDb();
      await initializeDatabase(); // Re-run with SQLite
    }
  } else {
    console.log("Initializing local SQLite database...");
    const db = getSqliteDb();
    db.exec('BEGIN TRANSACTION');
    try {
      await createUsersTable();
      await createProductsTable();
      await createPaymentsTable();
      await createCouponsTable();
      await createReviewsTable();
      await createWishlistTable();
      db.exec('COMMIT');
      console.log("Local SQLite database initialized successfully.");
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }
}

function initDatabase() {
  if (!initPromise) {
    initPromise = initializeDatabase();
  }
  return initPromise;
}

module.exports = {
  all,
  close,
  pool,
  get,
  initDatabase,
  run,
};
