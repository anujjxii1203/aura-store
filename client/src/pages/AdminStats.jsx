import { useState, useEffect } from 'react';
import api from '../api/client';
import { Database, Users, Package, CreditCard, RefreshCw, Lock, LayoutDashboard, Ticket, Trash2, Edit2, LogOut } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', image: '', description: '', category: 'T-Shirts', gender: 'Men', stock: 10
  });

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

  if (!isAuthorized) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7f9', fontFamily: 'system-ui' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Lock size={48} style={{ color: '#e11b23', marginBottom: '15px' }} />
            <h1 style={{ fontWeight: '950', fontSize: '24px', letterSpacing: '-0.5px' }}>ADMIN PORTAL</h1>
          </div>
          <form onSubmit={handleLogin}>
            <input type="text" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '8px', border: '1.5px solid #eee', fontSize: '14px' }} placeholder="Admin Username" />
            <input type="password" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1.5px solid #eee', fontSize: '14px' }} placeholder="Admin Password" />
            {loginError && <p style={{ color: '#e11b23', fontSize: '12px', marginBottom: '15px', fontWeight: '800' }}>{loginError}</p>}
            <button type="submit" style={{ width: '100%', padding: '15px', background: '#e11b23', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}>SECURE LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  const updateOrderStatus = async (paymentId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${paymentId}`, { status_track: newStatus });
      fetchStats();
      alert('Order tracking status updated successfully!');
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleCreateCoupon = async () => {
    const code = prompt('Enter New Coupon Code (e.g. SAVE20):');
    if (!code) return;
    const value = prompt('Enter Discount Percentage (e.g. 20 for 20%):');
    if (!value) return;
    try {
      await api.post('/admin/coupons', { code: code.toUpperCase(), discount_type: 'percentage', discount_value: parseInt(value) });
      fetchStats();
      alert('Coupon created!');
    } catch (err) {
      alert('Failed to create coupon.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchStats();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      fetchStats();
    } catch (err) {
      alert('Failed to delete coupon.');
    }
  };

  const handleUpdateProduct = async (id, field, currentValue) => {
    const newValue = prompt(`Enter new ${field}:`, currentValue);
    if (newValue === null || newValue === '') return;
    try {
      await api.patch(`/admin/products/${id}`, { [field]: parseInt(newValue) });
      fetchStats();
    } catch (err) {
      alert(`Failed to update ${field}.`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchStats();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/products', newProduct);
      fetchStats();
      setShowAddProductModal(false);
      setNewProduct({ name: '', price: '', image: '', description: '', category: 'T-Shirts', gender: 'Men', stock: 10 });
      alert('Product created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product.');
    }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', background: '#f5f7f9' }}>SYNCING DATABASE...</div>;
  if (error) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '#f5f7f9' }}>
      <h2 style={{ color: '#e11b23', fontWeight: '900', marginBottom: '20px' }}>ERROR: {error}</h2>
      <button onClick={fetchStats} className="btn-red" style={{ padding: '12px 25px', borderRadius: '6px' }}>TRY AGAIN</button>
    </div>
  );
  if (!data) return null;

  // Calculate totals
  const totalRevenue = data.payments.reduce((acc, curr) => curr.status === 'paid' ? acc + curr.amount : acc, 0);
  const totalOrders = data.payments.length;

  const NavItem = ({ id, icon: Icon, label }) => (
    <div 
      onClick={() => setActiveTab(id)}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', 
        background: activeTab === id ? '#e11b23' : 'transparent',
        color: activeTab === id ? 'white' : '#888',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '13px',
        marginBottom: '8px', transition: 'all 0.2s'
      }}
    >
      <Icon size={18} /> {label}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7f9', fontFamily: 'system-ui' }}>
      
      {/* Sidebar */}
      <div style={{ width: '280px', background: '#111', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '50px', padding: '0 10px' }}>
          <div style={{ width: '40px', height: '40px', background: '#e11b23', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '950', margin: 0, letterSpacing: '-0.5px' }}>AURA ADMIN</h2>
            <p style={{ fontSize: '11px', color: '#888', margin: 0, fontWeight: '700' }}>Control Panel v1.0</p>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <NavItem id="dashboard" icon={LayoutDashboard} label="DASHBOARD" />
          <NavItem id="orders" icon={CreditCard} label="ORDERS" />
          <NavItem id="products" icon={Package} label="PRODUCTS" />
          <NavItem id="users" icon={Users} label="CUSTOMERS" />
          <NavItem id="coupons" icon={Ticket} label="COUPONS" />
        </nav>

        <div 
          onClick={() => { logout(); setIsAuthorized(false); navigate('/login'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', color: '#ff4444', cursor: 'pointer', fontWeight: '800', fontSize: '13px', borderTop: '1px solid #333', marginTop: '20px' }}
        >
          <LogOut size={18} /> LOGOUT
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px 50px', overflowY: 'auto', height: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '950', color: '#111', letterSpacing: '-1px' }}>
            {activeTab.toUpperCase()}
          </h1>
          <button onClick={fetchStats} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1.5px solid #eee', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', color: '#111', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <RefreshCw size={16} /> REFRESH DATA
          </button>
        </div>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1.5px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <p style={{ fontSize: '12px', fontWeight: '800', color: '#888', marginBottom: '10px' }}>TOTAL REVENUE</p>
                <h2 style={{ fontSize: '32px', fontWeight: '950', color: '#008080' }}>{formatPrice(totalRevenue)}</h2>
              </div>
              <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1.5px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <p style={{ fontSize: '12px', fontWeight: '800', color: '#888', marginBottom: '10px' }}>TOTAL ORDERS</p>
                <h2 style={{ fontSize: '32px', fontWeight: '950', color: '#111' }}>{totalOrders}</h2>
              </div>
              <div style={{ background: 'white', padding: '25px', borderRadius: '16px', border: '1.5px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <p style={{ fontSize: '12px', fontWeight: '800', color: '#888', marginBottom: '10px' }}>REGISTERED USERS</p>
                <h2 style={{ fontSize: '32px', fontWeight: '950', color: '#111' }}>{data.users.length}</h2>
              </div>
            </div>

            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1.5px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '20px', color: '#111' }}>LOW STOCK ALERTS</h3>
              {data.products.filter(p => p.stock < 10).length === 0 ? (
                <p style={{ color: '#008080', fontWeight: '800', fontSize: '14px' }}>All products are well stocked!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.products.filter(p => p.stock < 10).map(p => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff1f1', borderRadius: '8px', border: '1px solid #ffcccc' }}>
                      <span style={{ fontWeight: '800', color: '#111', fontSize: '14px' }}>{p.name}</span>
                      <span style={{ fontWeight: '900', color: '#e11b23', fontSize: '14px' }}>Only {p.stock} left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #eee', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>ORDER ID</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>DATE</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>AMOUNT</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>PAYMENT</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>FULFILLMENT</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map(py => (
                  <tr key={py.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '20px', fontWeight: '800' }}>{py.reference.substring(0,12)}...</td>
                    <td style={{ padding: '20px', color: '#666' }}>{new Date(py.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '20px', fontWeight: '900', color: '#008080' }}>{formatPrice(py.amount)}</td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', background: py.status === 'paid' ? '#e6f4f1' : '#fff1f1', color: py.status === 'paid' ? '#008080' : '#e11b23' }}>
                        {py.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <select 
                        value={py.status_track || 'processing'} 
                        onChange={(e) => updateOrderStatus(py.id, e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #eee', fontSize: '12px', fontWeight: '800', background: '#f8f9fa', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div>
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
              <button onClick={() => setShowAddProductModal(true)} style={{ background: '#111', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '13px' }}>+ ADD PRODUCT</button>
            </div>
            
            <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #eee', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead style={{ background: '#f8f9fa' }}>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>PRODUCT NAME</th>
                    <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>CATEGORY</th>
                    <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>PRICE</th>
                    <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>STOCK</th>
                    <th style={{ padding: '20px', color: '#888', fontWeight: '800', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                      <td style={{ padding: '20px', fontWeight: '800' }}>{p.name}</td>
                      <td style={{ padding: '20px', color: '#666', textTransform: 'capitalize' }}>{p.category}</td>
                      <td style={{ padding: '20px', fontWeight: '900', color: '#008080' }}>{formatPrice(p.price)}</td>
                      <td style={{ padding: '20px' }}>
                        <span style={{ fontWeight: '900', color: p.stock < 10 ? '#e11b23' : '#111' }}>{p.stock}</span>
                      </td>
                      <td style={{ padding: '20px', textAlign: 'right' }}>
                        <button onClick={() => handleUpdateProduct(p.id, 'price', p.price)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008080', marginRight: '15px' }} title="Edit Price"><Edit2 size={16} /></button>
                        <button onClick={() => handleUpdateProduct(p.id, 'stock', p.stock)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', marginRight: '15px' }} title="Edit Stock"><Package size={16} /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11b23' }} title="Delete Product"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD PRODUCT MODAL */}
            {showAddProductModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h2 style={{ marginTop: 0, marginBottom: '20px', fontWeight: '900' }}>Add New Product</h2>
                  <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input required placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input required type="number" placeholder="Price (INR)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input required placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <textarea required placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }} />
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <option value="T-Shirts">T-Shirts</option>
                        <option value="Hoodies">Hoodies</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Bottomwear">Bottomwear</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Tops">Tops</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                      <select required value={newProduct.gender} onChange={e => setNewProduct({...newProduct, gender: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                    </div>

                    <input required type="number" placeholder="Stock Quantity" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="button" onClick={() => setShowAddProductModal(false)} style={{ flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
                      <button type="submit" style={{ flex: 1, padding: '12px', background: '#e11b23', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>SAVE PRODUCT</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === 'users' && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #eee', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>USER ID</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>NAME</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>EMAIL</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>PASSWORD (TESTING)</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>JOINED</th>
                  <th style={{ padding: '20px', color: '#888', fontWeight: '800', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '20px', color: '#888', fontSize: '12px' }}>#{u.id}</td>
                    <td style={{ padding: '20px', fontWeight: '800' }}>{u.username}</td>
                    <td style={{ padding: '20px', color: '#666' }}>{u.email}</td>
                    <td style={{ padding: '20px', color: '#e11b23', fontWeight: 'bold' }}>{u.plain_password || 'Hidden/Hashed'}</td>
                    <td style={{ padding: '20px', color: '#666', fontSize: '13px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <button onClick={() => handleDeleteUser(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11b23' }} title="Delete User"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- COUPONS TAB --- */}
        {activeTab === 'coupons' && (
          <div>
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
              <button onClick={handleCreateCoupon} style={{ background: '#111', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', fontSize: '13px' }}>+ NEW COUPON</button>
            </div>
            {data.coupons.length === 0 ? (
              <div style={{ padding: '50px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1.5px solid #eee' }}>
                <Ticket size={48} color="#ddd" style={{ marginBottom: '20px' }} />
                <h3 style={{ color: '#888' }}>No active coupons found.</h3>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #eee', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr style={{ textAlign: 'left' }}>
                      <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>CODE</th>
                      <th style={{ padding: '20px', color: '#888', fontWeight: '800' }}>DISCOUNT</th>
                      <th style={{ padding: '20px', color: '#888', fontWeight: '800', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.coupons.map(c => (
                      <tr key={c.id} style={{ borderTop: '1px solid #eee' }}>
                        <td style={{ padding: '20px', fontWeight: '900', color: '#e11b23' }}>{c.code}</td>
                        <td style={{ padding: '20px', fontWeight: '800' }}>{c.discount_value}% OFF</td>
                        <td style={{ padding: '20px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteCoupon(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e11b23' }}><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminStats;
