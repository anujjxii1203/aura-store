import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const Returns = () => {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <PageTitle title="Returns & Exchanges" />
      <BackButton />
      <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px' }}>RETURNS &amp; EXCHANGES</h1>
      <p style={{ color: '#999', fontSize: '12px', fontWeight: '700', marginBottom: '40px' }}>We want you to love what you ordered</p>

      <div style={{ maxWidth: '800px' }}>
        {/* Section 1 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>1. RETURN POLICY</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>
              We accept returns within <strong>30 days</strong> of delivery. To be eligible for a return:
            </p>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Items must be unworn, unwashed, and in their original condition.</li>
              <li>All original tags and packaging must still be attached.</li>
              <li>Items must not be damaged by the customer.</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>2. NON-RETURNABLE ITEMS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Sale or discounted items (marked as "Final Sale").</li>
              <li>Innerwear, socks, and accessories for hygiene reasons.</li>
              <li>Customized or personalized products.</li>
              <li>Gift cards.</li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>3. HOW TO INITIATE A RETURN</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ol style={{ color: '#555', lineHeight: '2.2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Log in to your account and go to <strong>My Orders</strong>.</li>
              <li>Select the order and item you wish to return.</li>
              <li>Choose a reason for the return and submit the request.</li>
              <li>You will receive a prepaid return shipping label via email.</li>
              <li>Pack the item securely and drop it off at the nearest courier partner location.</li>
            </ol>
          </div>
        </div>

        {/* Section 4 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>4. EXCHANGES</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              If you'd like a different size or color, you can request an exchange instead of a return.
              Exchanges are subject to stock availability. If the requested item is unavailable, we will process a full refund instead.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>5. REFUNDS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Refunds are processed within <strong>5–7 business days</strong> after the returned item is received and inspected.</li>
              <li>The refund will be credited to your original payment method.</li>
              <li>Shipping charges (if any) are non-refundable unless the return is due to a defect or our error.</li>
            </ul>
          </div>
        </div>

        {/* Section 6 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>6. DAMAGED OR DEFECTIVE ITEMS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>
              If you receive a damaged or defective item, please contact us within <strong>48 hours</strong> of delivery with:
            </p>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Your order number</li>
              <li>Photos of the damaged/defective item</li>
              <li>A brief description of the issue</li>
            </ul>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginTop: '10px' }}>
              We will arrange a free replacement or full refund at no extra cost to you.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>7. NEED HELP?</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
              <strong>AURA STORE Support</strong><br />
              Email: support@aura-store.com<br />
              WhatsApp: +91 73030 59402<br />
              <span style={{ fontSize: '12px', color: '#999' }}>Response time: Within 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
