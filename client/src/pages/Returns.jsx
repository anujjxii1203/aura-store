import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const Returns = () => {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <PageTitle title="Returns & Exchanges" />
      <BackButton />
      <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>RETURNS & EXCHANGES</h1>
      <p style={{ color: '#555', marginBottom: '30px', maxWidth: '700px', lineHeight: '1.6' }}>
        We want you to be completely satisfied with your purchase. If you are not entirely happy, you can return or exchange your items within 30 days of delivery.
      </p>
      
      <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '12px', border: '1.5px solid #eee', maxWidth: '700px' }}>
        <h3 style={{ fontWeight: '900', marginBottom: '15px' }}>RETURN POLICY</h3>
        <ul style={{ color: '#555', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Items must be unworn, unwashed, and in their original condition.</li>
          <li>All original tags must still be attached.</li>
          <li>Sale items are considered final sale and cannot be returned.</li>
          <li>Refunds will be processed back to the original payment method within 5-7 business days.</li>
        </ul>
        <button className="btn-red" style={{ padding: '10px 25px', borderRadius: '6px', fontSize: '13px', marginTop: '20px' }}>START A RETURN</button>
      </div>
    </div>
  );
};

export default Returns;
