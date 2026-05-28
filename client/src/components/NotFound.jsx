import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import PageTitle from './PageTitle';

const NotFound = () => {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <PageTitle title="404 - Not Found" />
      <div style={{ position: 'relative', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '150px', fontWeight: '900', color: '#f0f0f0', lineHeight: '1', margin: 0 }}>404</h1>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#222', margin: 0 }}>LOST IN THE AURA?</h2>
        </div>
      </div>
      
      <p style={{ color: '#666', fontSize: '16px', maxWidth: '500px', marginBottom: '40px', lineHeight: '1.6' }}>
        The page you're looking for doesn't exist or has been moved to a different dimension.
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-red" style={{ padding: '15px 30px', borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
          <Home size={18} /> BACK TO HOME
        </Link>
        <Link to="/" className="btn-black" style={{ padding: '15px 30px', borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', background: '#222', color: 'white' }}>
          <Search size={18} /> SEARCH PRODUCTS
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
