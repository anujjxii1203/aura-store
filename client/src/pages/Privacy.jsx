import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const Privacy = () => {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <PageTitle title="Privacy Policy" />
      <BackButton />
      <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px' }}>PRIVACY POLICY</h1>
      <p style={{ color: '#999', fontSize: '12px', fontWeight: '700', marginBottom: '40px' }}>Last Updated: June 2026</p>

      <div style={{ maxWidth: '800px' }}>
        {/* Introduction */}
        <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '30px', fontSize: '14px' }}>
          This Privacy Policy ("Policy") describes how <strong>AURA STORE</strong> ("we", "us", or "our") collects, uses, and protects
          information when you use our website and mobile application (collectively, the "Platform"). By accessing the Platform,
          you consent to the practices described in this Policy. We encourage you to read this Policy carefully to make informed decisions.
        </p>

        {/* Section 1 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>1. DEFINITIONS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>
              <strong>"Personal Information"</strong> means any information that relates to a natural person, which directly or indirectly,
              in combination with other information, is capable of identifying such person — including name, email address, phone number,
              and shipping address.
            </p>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              <strong>"Sensitive Personal Data"</strong> includes financial information such as bank account or credit/debit card details,
              passwords, and biometric data. We do not store sensitive payment data on our servers.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>2. INFORMATION WE COLLECT</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>We may collect the following categories of information:</p>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li><strong>Account Information:</strong> Name, email address, phone number, and password when you register.</li>
              <li><strong>Order Information:</strong> Shipping address, billing details, and order history.</li>
              <li><strong>Payment Information:</strong> Processed securely by our payment gateway partners. Card details are never stored on our servers.</li>
              <li><strong>Device & Usage Data:</strong> IP address, browser type, device type, pages visited, and interaction data via cookies.</li>
              <li><strong>Communications:</strong> Any messages, reviews, or feedback you submit to us.</li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>3. HOW WE USE YOUR INFORMATION</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>To process and fulfill your orders, including delivery and payment processing.</li>
              <li>To personalize your shopping experience and recommend products.</li>
              <li>To communicate order updates, promotional offers, and service announcements.</li>
              <li>To detect fraud, prevent abuse, and maintain security of the Platform.</li>
              <li>To comply with applicable laws and regulations.</li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>4. SHARING OF INFORMATION</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>
              We do not sell or rent your personal information. We may share data with:
            </p>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li><strong>Service Providers:</strong> Payment processors, logistics partners, and analytics providers who assist in operating our Platform.</li>
              <li><strong>Legal Authorities:</strong> When required by law, regulation, or legal process.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.</li>
            </ul>
          </div>
        </div>

        {/* Section 5 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>5. COOKIES & TRACKING</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.
              You can manage cookie preferences through your browser settings. Disabling cookies may limit certain features of the Platform.
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>6. DATA SECURITY</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              We implement industry-standard security measures including encryption, secure servers, and access controls to protect your data.
              However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>
        </div>

        {/* Section 7 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>7. YOUR RIGHTS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginBottom: '10px' }}>You have the right to:</p>
            <ul style={{ color: '#555', lineHeight: '2', fontSize: '14px', paddingLeft: '18px' }}>
              <li>Access, review, and update your personal information via your account settings.</li>
              <li>Request deletion of your personal data by contacting our support team.</li>
              <li>Opt out of marketing communications at any time using the unsubscribe link.</li>
              <li>Withdraw consent for data processing (which may limit your use of the Platform).</li>
            </ul>
          </div>
        </div>

        {/* Section 8 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>8. THIRD-PARTY LINKS</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              Our Platform may contain links to third-party websites. We are not responsible for the privacy practices of these websites.
              We encourage you to review their privacy policies before providing any information.
            </p>
          </div>
        </div>

        {/* Section 9 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>9. CHANGES TO THIS POLICY</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with the updated date.
              Continued use of the Platform after changes constitutes acceptance of the revised Policy.
            </p>
          </div>
        </div>

        {/* Section 10 */}
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '12px', color: '#111' }}>10. CONTACT US</h2>
          <div style={{ borderLeft: '3px solid var(--ss-red, #e63946)', paddingLeft: '20px' }}>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
              If you have questions or concerns about this Privacy Policy, please contact us at:
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

export default Privacy;
