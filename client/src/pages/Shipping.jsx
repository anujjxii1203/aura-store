import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const Shipping = () => {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <PageTitle title="Shipping Information" />
      <BackButton />
      <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px' }}>SHIPPING INFORMATION</h1>
      <p style={{ color: '#999', fontSize: '12px', fontWeight: '700', marginBottom: '40px' }}>Everything you need to know about delivery</p>

      <div style={{ maxWidth: '800px' }}>
        {/* Section 1 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>1. SHIPPING OPTIONS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li><strong>Standard Shipping (3–7 business days):</strong> Free on orders above ₹999. Flat ₹99 for orders below ₹999.</li>
              <li><strong>Express Shipping (1–3 business days):</strong> Available for ₹199 on eligible orders.</li>
              <li><strong>Next-Day Delivery:</strong> Available in select metro cities for ₹299.</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>2. ORDER PROCESSING</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              Orders are processed within 1–2 business days after payment confirmation. You will receive an email with tracking details
              once your order has been dispatched. Orders placed on weekends or holidays will be processed the next business day.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>3. TRACKING YOUR ORDER</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              Once dispatched, you'll receive a tracking number via email and SMS. Use the{' '}
              <a href="/track-order" style={{ color: 'var(--ss-red, #e63946)', textDecoration: 'underline', fontWeight: '700' }}>Track Order</a>{' '}
              page to monitor delivery progress in real time.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>4. INTERNATIONAL SHIPPING</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>We ship to 50+ countries worldwide.</li>
              <li>International shipping costs are calculated at checkout based on destination and weight.</li>
              <li>Delivery times for international orders range from 7–21 business days.</li>
              <li>Import duties and taxes may apply and are the responsibility of the buyer.</li>
            </ul>
          </div>
        </div>

        {/* Section 5 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>5. DELIVERY ISSUES</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>
              If you experience any of the following, please contact our support team within 48 hours of delivery:
            </p>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Damaged or defective items</li>
              <li>Wrong item received</li>
              <li>Missing items from your order</li>
              <li>Package marked as delivered but not received</li>
            </ul>
            <div style={{ marginTop: '15px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
              <strong>Contact Support:</strong> support@aura-store.com | WhatsApp: +91 73030 59402
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
