import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const Shipping = () => {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <PageTitle title="Shipping Info" />
      <BackButton />
      <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>SHIPPING INFORMATION</h1>
      <p style={{ color: '#555', marginBottom: '30px', maxWidth: '700px', lineHeight: '1.6' }}>
        We deliver globally. Check out our shipping times and costs below.
      </p>
      
      <div style={{ display: 'grid', gap: '20px', maxWidth: '700px' }}>
        <div style={{ padding: '20px', border: '1.5px solid #eee', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: '800', marginBottom: '10px' }}>STANDARD SHIPPING</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Free on all orders. Delivery in 5-7 business days.</p>
        </div>
        <div style={{ padding: '20px', border: '1.5px solid #eee', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: '800', marginBottom: '10px' }}>EXPRESS SHIPPING</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>₹499 flat rate. Delivery in 2-3 business days.</p>
        </div>
        <div style={{ padding: '20px', border: '1.5px solid #eee', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: '800', marginBottom: '10px' }}>INTERNATIONAL SHIPPING</h3>
          <p style={{ color: '#888', fontSize: '14px' }}>Rates calculated at checkout. Delivery in 10-15 business days.</p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
