import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTitle from '../components/PageTitle';

const NotFound = () => {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
      <PageTitle title="Page Not Found" />
      <div style={{ background: '#f9f9f9', padding: '60px 30px', borderRadius: '12px', maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '72px', fontWeight: '950', color: 'var(--ss-red)', lineHeight: 1, marginBottom: '10px' }}>404</h1>
        <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '10px' }}>PAGE NOT FOUND</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn-red"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' }}
        >
          <Home size={16} /> BACK TO HOME
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
