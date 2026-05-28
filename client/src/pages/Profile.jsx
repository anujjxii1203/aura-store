import { useEffect, useState } from 'react';
import api from '../api/client';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Package, Heart, LogOut, MapPin, Settings as SettingsIcon, ChevronDown, ChevronUp, Truck, CheckCircle, Home } from 'lucide-react';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';
import { useUser } from '../context/UserContext';
import { FALLBACK_IMAGE, formatPrice } from '../utils/formatters';

const getSavedOrders = (email) => {
  if (!email) return [];
  try {
    return JSON.parse(localStorage.getItem(`orders_${email}`) || '[]');
  } catch {
    localStorage.removeItem(`orders_${email}`);
    return [];
  }
};

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/me');
      // Format backend orders to match UI structure
      const formatted = res.data.map(order => ({
        id: order.id,
        reference: order.reference,
        date: new Date(order.created_at).toLocaleDateString(),
        total: order.amount,
        status: order.status_track || 'processing',
        payment_status: order.status,
        items: JSON.parse(order.metadata).items || []
      }));
      setOrders(formatted);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <PageTitle title="My Profile" />
      <BackButton />
      <div className="profile-wrapper">
        {/* Sidebar */}
        <div className="profile-sidebar" style={{ background: 'var(--ss-light-grey)', padding: '30px', borderRadius: '12px', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '80px', height: '80px', background: '#008080', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900', margin: '0 auto 15px' }}>
              {(user.username || 'A').charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '950', color: 'var(--text-primary)' }}>{(user.username || 'Customer').toUpperCase()}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{user.email}</p>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: location.pathname === '/profile' ? 'var(--bg-primary)' : 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', color: location.pathname === '/profile' ? '#008080' : 'var(--text-primary)' }}>
                <Package size={18} /> MY ORDERS
              </div>
            </Link>
            <Link to="/wishlist" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', color: 'var(--text-primary)' }}>
                <Heart size={18} /> WISHLIST
              </div>
            </Link>
            <Link to="/addresses" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', color: 'var(--text-primary)' }}>
                <MapPin size={18} /> ADDRESSES
              </div>
            </Link>
            <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', color: 'var(--text-primary)' }}>
                <SettingsIcon size={18} /> SETTINGS
              </div>
            </Link>
            <div onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', color: '#e11b23', marginTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <LogOut size={18} /> LOGOUT
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '950', marginBottom: '30px', color: 'var(--text-primary)' }}>RECENT ORDERS</h1>
          
          {orders.length === 0 ? (
            <div style={{ padding: '40px', background: 'var(--ss-light-grey)', borderRadius: '12px', textAlign: 'center', border: '1.5px dashed var(--border-color)' }}>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
              <Link to="/" className="btn-red" style={{ padding: '12px 25px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', display: 'inline-block' }}>START SHOPPING</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {orders.map((order) => (
                <div key={order.id} style={{ border: '1.5px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-primary)' }}>
                  <div 
                    className="order-header" 
                    onClick={() => toggleOrder(order.id)}
                    style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expandedOrder === order.id ? 'var(--ss-light-grey)' : 'transparent', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ display: 'flex' }}>
                        {order.items.slice(0, 3).map((item, idx) => (
                          <img key={idx} src={item.image || FALLBACK_IMAGE} alt={item.name} onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '6px', marginLeft: idx > 0 ? '-25px' : '0', border: '2px solid var(--bg-primary)', zIndex: 10 - idx }} />
                        ))}
                      </div>
                      <div>
                        <p style={{ fontWeight: '900', fontSize: '14px', color: 'var(--text-primary)' }}>ORDER #{order.id}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{order.date}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div>
                        <p style={{ fontWeight: '900', fontSize: '15px', color: 'var(--text-primary)' }}>{formatPrice(order.total)}</p>
                        <p style={{ fontSize: '11px', color: '#e11b23', fontWeight: '800' }}>{order.status.toUpperCase()}</p>
                      </div>
                      {expandedOrder === order.id ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="order-details-expanded" style={{ padding: '30px 20px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                      
                      {/* Tracking Timeline */}
                      <div style={{ marginBottom: '40px', padding: '0 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '10px' }}>
                          <div style={{ position: 'absolute', top: '12px', left: '0', right: '0', height: '2px', background: 'var(--border-color)', zIndex: 1 }}></div>
                          <div style={{ 
                            position: 'absolute', 
                            top: '12px', 
                            left: '0', 
                            width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : '33%', 
                            height: '2px', 
                            background: '#008080', 
                            zIndex: 2,
                            transition: 'width 0.3s ease'
                          }}></div>
                          
                          <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', background: '#008080', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><CheckCircle size={14} /></div>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: '#008080' }}>PLACED</span>
                          </div>
                          <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '24px', 
                              height: '24px', 
                              background: ['processing', 'shipped', 'delivered'].includes(order.status) ? '#008080' : 'var(--border-color)', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              color: ['processing', 'shipped', 'delivered'].includes(order.status) ? 'white' : 'var(--text-secondary)' 
                            }}><Package size={14} /></div>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: ['processing', 'shipped', 'delivered'].includes(order.status) ? '#008080' : 'var(--text-secondary)' }}>PROCESSING</span>
                          </div>
                          <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '24px', 
                              height: '24px', 
                              background: ['shipped', 'delivered'].includes(order.status) ? '#008080' : 'var(--border-color)', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              color: ['shipped', 'delivered'].includes(order.status) ? 'white' : 'var(--text-secondary)' 
                            }}><Truck size={14} /></div>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: ['shipped', 'delivered'].includes(order.status) ? '#008080' : 'var(--text-secondary)' }}>SHIPPED</span>
                          </div>
                          <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '24px', 
                              height: '24px', 
                              background: order.status === 'delivered' ? '#008080' : 'var(--border-color)', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              color: order.status === 'delivered' ? 'white' : 'var(--text-secondary)' 
                            }}><Home size={14} /></div>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: order.status === 'delivered' ? '#008080' : 'var(--text-secondary)' }}>DELIVERED</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                              <img src={item.image || FALLBACK_IMAGE} alt={item.name} style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} />
                              <div>
                                <p style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{item.name}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Size: {item.selectedSize} | Qty: {item.quantity || 1}</p>
                              </div>
                            </div>
                            <p style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)' }}>{formatPrice(item.price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '40px', background: '#f0fcfc', padding: '25px', borderRadius: '12px', border: '1px solid #d0f0f0' }}>
            <h3 style={{ fontWeight: '900', color: 'var(--yaperz-green)', marginBottom: '10px', fontSize: '14px' }}>AURA PRIVILEGE MEMBER</h3>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>You've unlocked free shipping on all orders and 10% cashback on your next streetwear grab!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
