const crypto = require('crypto');

// In-memory store for OTPs: email => { otp, expiresAt }
const otpStore = new Map();

/** Generate a 6‑digit numeric OTP */
function generateOtp() {
  // crypto.randomInt is inclusive of min, exclusive of max
  const otp = crypto.randomInt(100000, 1000000); // 100000 to 999999
  return String(otp);
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

/** Send OTP email using Nodemailer */
async function sendOtpEmail(toEmail, otp) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn('Gmail credentials not configured – OTP email not sent');
    console.log(`✅ OTP for ${toEmail}: ${otp}`);
    return;
  }
  console.log(`✅ OTP for ${toEmail}: ${otp}`);
  try {
    await transporter.sendMail({
      from: `"Aura Store" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: 'Your login OTP for Aura Store',
      html: `
        <div style="font-family:sans-serif; padding:20px;">
          <h2>AURA STORE – Login OTP</h2>
          <p>Your one‑time password is:</p>
          <p style="font-size:24px; font-weight:bold;">${otp}</p>
          <p>This OTP will expire in 5 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log(`OTP email sent to ${toEmail}`);
  } catch (err) {
    console.error('Failed to send OTP email:', err);
  }
}

/** Store OTP for an email with expiration (default 5 minutes) */
function storeOtp(email, otp, ttlMs = 5 * 60 * 1000) {
  const expiresAt = Date.now() + ttlMs;
  otpStore.set(email, { otp, expiresAt });
}

/** Verify OTP – returns true if valid and not expired */
function verifyOtp(email, otp) {
  const record = otpStore.get(email);
  if (!record) return false;
  const { otp: stored, expiresAt } = record;
  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return false;
  }
  const isValid = stored === String(otp).trim();
  if (isValid) otpStore.delete(email);
  return isValid;
}

module.exports = {
  generateOtp,
  sendOtpEmail,
  storeOtp,
  verifyOtp,
  // expose store for testing if needed
  _otpStore: otpStore,
};
