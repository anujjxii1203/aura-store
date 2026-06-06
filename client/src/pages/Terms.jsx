import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const Terms = () => {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <PageTitle title="Terms & Conditions" />
      <BackButton />
      <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px' }}>TERMS &amp; CONDITIONS</h1>
      <p style={{ color: '#999', fontSize: '12px', fontWeight: '700', marginBottom: '40px' }}>Last Updated: June 2026</p>

      <div style={{ maxWidth: '800px' }}>
        <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '30px', fontSize: '14px' }}>
          Welcome to <strong>AURA STORE</strong>. These Terms and Conditions ("Terms") govern your use of our website and services.
          By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.
        </p>

        {/* Section 1 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>1. USE OF THE PLATFORM</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>You must be at least 18 years of age to use this Platform.</li>
              <li>You agree to provide accurate and complete information during registration and checkout.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>Any unauthorized use of your account should be reported immediately.</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>2. ORDERS & PRICING</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>All orders are subject to product availability and confirmation.</li>
              <li>Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
              <li>We reserve the right to modify prices without prior notice.</li>
              <li>An order confirmation email does not guarantee acceptance — we may cancel orders due to pricing errors or stock issues.</li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>3. PAYMENTS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>
              We accept payments via UPI, credit/debit cards, net banking, and popular wallets.
              All transactions are processed securely through our payment gateway partners.
              We do not store your card details on our servers.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>4. SHIPPING & DELIVERY</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Estimated delivery times are indicative and may vary based on location and availability.</li>
              <li>Risk of loss transfers to you upon delivery to the carrier.</li>
              <li>We are not liable for delays caused by carrier issues, weather, or force majeure events.</li>
            </ul>
          </div>
        </div>

        {/* Section 5 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>5. RETURNS & REFUNDS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Returns are accepted within 30 days of delivery, provided items are unused and in original packaging.</li>
              <li>Sale and discounted items are final sale and cannot be returned.</li>
              <li>Refunds will be issued to the original payment method within 5–7 business days of receiving the return.</li>
              <li>Shipping charges for returns may apply unless the return is due to a defect or error on our part.</li>
            </ul>
          </div>
        </div>

        {/* Section 6 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>6. COUPON CODES & PROMOTIONS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Coupons are valid for a limited time and may have minimum purchase requirements.</li>
              <li>Only one coupon can be applied per order unless stated otherwise.</li>
              <li>We reserve the right to revoke or modify promotional offers at any time.</li>
            </ul>
          </div>
        </div>

        {/* Section 7 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>7. INTELLECTUAL PROPERTY</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              All content on this Platform — including text, images, logos, designs, and code — is the property of AURA STORE
              and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works
              without our written permission.
            </p>
          </div>
        </div>

        {/* Section 8 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>8. USER CONDUCT</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>You agree not to:</p>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Use the Platform for any unlawful purpose or in violation of these Terms.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform.</li>
              <li>Submit false or misleading information.</li>
              <li>Interfere with or disrupt the operation of the Platform.</li>
            </ul>
          </div>
        </div>

        {/* Section 9 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>9. LIMITATION OF LIABILITY</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              AURA STORE shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
              Our total liability shall not exceed the amount paid by you for the specific product or service giving rise to the claim.
            </p>
          </div>
        </div>

        {/* Section 10 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>10. GOVERNING LAW</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
            </p>
          </div>
        </div>

        {/* Section 11 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>11. CONTACT US</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              For any questions regarding these Terms, please reach out to:
            </p>
            <div style={{ marginTop: '15px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
              <strong>AURA STORE</strong><br />
              Email: support@aura-store.com<br />
              WhatsApp: +91 73030 59402
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
