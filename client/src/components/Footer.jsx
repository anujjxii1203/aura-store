import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="premium-footer" style={{ background: 'var(--ss-dark)', color: 'white', padding: '80px 0 40px' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '50px', marginBottom: '80px' }}>
          
          {/* Brand Section */}
          <div className="footer-brand">
            <h2 style={{ fontSize: '32px', fontWeight: '950', marginBottom: '20px', letterSpacing: '-1.5px' }}>AURA.</h2>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
              Elevating streetwear with premium fabrics and unapologetic design. 100% Cotton. 100% Drip.
            </p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/anujjxii/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: '0.3s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/917303059402" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: '0.3s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#25D366'; e.currentTarget.style.borderColor = '#25D366'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.631 1.436h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/anuj-rai-a458b8385?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: '0.3s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#0077b5'; e.currentTarget.style.borderColor = '#0077b5'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 style={{ fontSize: '13px', fontWeight: '950', marginBottom: '25px', letterSpacing: '1px' }}>SHOP</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li><Link to="/?gender=Men" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>MEN'S COLLECTION</Link></li>
              <li><Link to="/?gender=Women" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>WOMEN'S COLLECTION</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>NEW ARRIVALS</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>BEST SELLERS</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4 style={{ fontSize: '13px', fontWeight: '950', marginBottom: '25px', letterSpacing: '1px' }}>SUPPORT</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li><Link to="/profile" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>TRACK ORDER</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>RETURNS & EXCHANGES</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>SHIPPING INFO</Link></li>
              <li><Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: '700', transition: '0.2s' }}>FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4 style={{ fontSize: '13px', fontWeight: '950', marginBottom: '25px', letterSpacing: '1px' }}>JOIN THE REVOLUTION</h4>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>
              Subscribe for early access to drops and exclusive offers.
            </p>
            <div className="newsletter-box" style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px 15px', color: 'white', fontSize: '11px', fontWeight: '800', width: '100%', borderRadius: '4px' }}
              />
              <button style={{ background: 'var(--ss-red)', border: 'none', color: 'white', padding: '12px 20px', fontWeight: '900', fontSize: '11px', cursor: 'pointer', borderRadius: '4px', letterSpacing: '1px' }}>JOIN</button>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#444', fontSize: '11px', fontWeight: '800' }}>&copy; 2026 AURA STORE. ALL RIGHTS RESERVED.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ color: '#444', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>PRIVACY</span>
            <span style={{ color: '#444', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>TERMS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
