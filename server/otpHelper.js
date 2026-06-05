const crypto = require('crypto');

// In-memory store for OTPs: email => { otp, expiresAt }
const otpStore = new Map();

/** Generate a 6‑digit numeric OTP */
function generateOtp() {
  // crypto.randomInt is inclusive of min, exclusive of max
  const otp = crypto.randomInt(100000, 1000000); // 100000 to 999999
  return String(otp);
}

/** Send OTP email using Resend (if configured) */
async function sendOtpEmail(resend, toEmail, otp) {
  if (!resend) {
    console.warn('Resend not configured – OTP email not sent');
    return;
  }
  try {
    await resend.emails.send({
      from: 'Aura Store <onboarding@resend.dev>',
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
  const isValid = stored === otp;
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
