import { useState, useEffect } from 'react';
import api from '../api/client';
import { Database, Users, Package, CreditCard, RefreshCw, Lock, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatters';
import { useUser } from '../context/UserContext';

const AdminStats = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');

  // New Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'T-Shirts',
    gender: 'Men'
  });
  const [addLoading, setAddLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'anuj') {
      setIsAuthorized(true);
      fetchStats();
    } else {
      setLoginError('Invalid Admin Credentials!');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch database stats.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await api.post('/products', newProduct);
      setShowAddForm(false);
      setNewProduct({ name: '', price: '', image: '', description: '', category: 'T-Shirts', gender: 'Men' });
      fetchStats();
      alert('Product added successfully to database!');
    } catch (err) {
      alert('Failed to add product.');
    } finally {
      setAddLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', fontFamily: 'system-ui' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Lock size={48} style={{ color: '#e11b23', marginBottom: '15px' }} />
            <h1 style={{ fontWeight: '950', fontSize: '24px' }}>ADMIN ACCESS</h1>
          </div>
          <form onSubmit={handleLogin}>
            <input type="text" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '2px solid #eee' }} placeholder="Username" />
            <input type="password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '2px solid #eee' }} placeholder="Password" />
            {loginError && <p style={{ color: '#e11b23', fontSize: '12px', marginBottom: '15px' }}>{loginError}</p>}
            <button type="submit" style={{ width: '100%', padding: '15px', background: '#e11b23', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  const updateOrderStatus = async (paymentId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${paymentId}`, { status_track: newStatus });
      fetchStats();
      alert('Status updated!');
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    const code = prompt('Enter Coupon Code (e.g. SAVE20):');
    if (!code) return;
    const value = prompt('Enter Discount Value (e.g. 20 for 20%):');
    if (!value) return;
    try {
      await api.post('/admin/coupons', { code, discount_type: 'percentage', discount_value: parseInt(value) });
      fetchStats();
      alert('Coupon created!');
    } catch (err) {
      alert('Failed to create coupon.');
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', fontWeight: '900' }}>ACCESSING DATABASE...</div>;
  
  if (error) return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h2 style={{ color: '#e11b23', fontWeight: '900' }}>ERROR: {error}</h2>
      <button onClick={fetchStats} className="btn-red" style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '6px' }}>TRY AGAIN</button>
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: 'system-ui' }}>
      <div style={{ background: '#000', color: '#fff', padding: '15px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '20px', fontWeight: '950', color: '#e11b23' }}>AURA ADMIN PANEL</div>
        <button onClick={() => { logout(); setIsAuthorized(false); navigate('/login'); }} style={{ background: 'none', border: '1px solid #444', color: '#fff', padding: '5px 15px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>LOGOUT</button>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '950' }}>LIVE DATABASE MONITOR</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleCreateCoupon} style={{ padding: '10px 20px', borderRadius: '8px', background: '#222', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer' }}>
              CREATE COUPON
            </button>
            <button onClick={() => setShowAddForm(true)} style={{ padding: '10px 20px', borderRadius: '8px', background: '#008080', color: 'white', border: 'none', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Plus size={18} /> ADD NEW PRODUCT
            </button>
            <button onClick={fetchStats} style={{ padding: '10px 20px', borderRadius: '8px', background: '#eee', border: 'none', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <RefreshCw size={18} /> REFRESH
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {/* Users Table */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', border: '1.5px solid #eee' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '20px' }}>USERS ({data.users.length})</h2>
            <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead><tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}><th style={{ padding: '10px' }}>NAME</th><th style={{ padding: '10px' }}>EMAIL</th></tr></thead>
                <tbody>{data.users.map(u => (<tr key={u.id} style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px', fontWeight: '800' }}>{u.username}</td><td style={{ padding: '10px', color: '#666' }}>{u.email}</td></tr>))}</tbody>
              </table>
            </div>
          </div>

          {/* Products Table with Stock Alerts */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', border: '1.5px solid #eee' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '20px' }}>PRODUCTS ({data.products.length})</h2>
            <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead><tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}><th style={{ padding: '10px' }}>ITEM</th><th style={{ padding: '10px' }}>STOCK</th><th style={{ padding: '10px' }}>PRICE</th></tr></thead>
                <tbody>{data.products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee', background: p.stock < 5 ? '#fff1f1' : 'transparent' }}>
                    <td style={{ padding: '10px', fontWeight: '800' }}>{p.name}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ color: p.stock < 5 ? '#e11b23' : '#111', fontWeight: '900' }}>
                        {p.stock} {p.stock < 5 && '(LOW)'}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{formatPrice(p.price)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          {/* Transactions with Status Update */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', border: '1.5px solid #eee', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '20px' }}>TRANSACTIONS ({data.payments.length})</h2>
            <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead><tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}><th style={{ padding: '10px' }}>REF</th><th style={{ padding: '10px' }}>AMOUNT</th><th style={{ padding: '10px' }}>METHOD</th><th style={{ padding: '10px' }}>TRACKING</th><th style={{ padding: '10px' }}>STATUS</th></tr></thead>
                <tbody>{data.payments.map(py => (
                  <tr key={py.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontSize: '11px' }}>{py.reference}</td>
                    <td style={{ padding: '10px', fontWeight: '900', color: '#e11b23' }}>{formatPrice(py.amount)}</td>
                    <td style={{ padding: '10px' }}>{py.method}</td>
                    <td style={{ padding: '10px' }}>
                      <select 
                        value={py.status_track} 
                        onChange={(e) => updateOrderStatus(py.id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '11px' }}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td style={{ padding: '10px' }}><span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', background: py.status === 'paid' ? '#e6f4f1' : '#fff1f1', color: py.status === 'paid' ? '#008080' : '#e11b23' }}>{py.status.toUpperCase()}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {showAddForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontWeight: '950', marginBottom: '20px' }}>ADD NEW PRODUCT</h2>
            <form onSubmit={handleAddProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '11px', fontWeight: '900' }}>PRODUCT NAME</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '900' }}>PRICE (₹)</label>
                  <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '900' }}>INITIAL STOCK</label>
                  <input type="number" value={newProduct.stock || 10} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} required />
                </div>
                {/* ... other fields keep same ... */}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <button type="submit" disabled={addLoading} style={{ flex: 1, padding: '15px', background: '#008080', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>
                  {addLoading ? 'SAVING...' : 'SAVE PRODUCT'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '15px', background: '#eee', color: '#111', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
