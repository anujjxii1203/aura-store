import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const TrackOrder = () => {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
      <PageTitle title="Track Order" />
      <BackButton />
      <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>TRACK YOUR ORDER</h1>
      <p style={{ color: '#555', marginBottom: '30px' }}>Enter your order ID and email to get real-time tracking updates.</p>
      
      <div style={{ maxWidth: '500px', marginBottom: '60px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '8px' }}>ORDER ID</label>
          <input type="text" placeholder="e.g. ORD-123456" style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '8px' }}>EMAIL ADDRESS</label>
          <input type="email" placeholder="Email used for checkout" style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }} />
        </div>
        <button className="btn-red" style={{ padding: '12px 30px', borderRadius: '6px', fontSize: '14px', width: '100%' }}>TRACK ORDER</button>
      </div>

      <div style={{ maxWidth: '800px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '30px' }}>SAMPLE TRACKING STAGES</h3>
        <div className="tracking-timeline">
          <div className="timeline-step">
            <div className="step-dot active"><Clock size={16} /></div>
            <div className="step-label active">ORDER PLACED</div>
          </div>
          <div className="timeline-step">
            <div className="step-dot active"><Package size={16} /></div>
            <div className="step-label active">PACKED</div>
          </div>
          <div className="timeline-step">
            <div className="step-dot"><Truck size={16} /></div>
            <div className="step-label">SHIPPED</div>
          </div>
          <div className="timeline-step">
            <div className="step-dot"><CheckCircle size={16} /></div>
            <div className="step-label">DELIVERED</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
