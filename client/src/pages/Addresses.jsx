import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Trash2, Home, Briefcase, Navigation, X } from 'lucide-react';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

const getSavedAddresses = (email) => {
  if (!email) return [];
  try {
    const saved = localStorage.getItem(`addresses_${email}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    localStorage.removeItem(`addresses_${email}`);
    return [];
  }
};

const Addresses = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(() => getSavedAddresses(user?.email));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAddressId, setActiveAddressId] = useState(() => getSavedAddresses(user?.email)[0]?.id || null);
  const [newAddr, setNewAddr] = useState({ name: '', type: 'Home', details: '', city: '', state: '', pin: '' });
  const activeAddress = addresses.find((address) => address.id === activeAddressId) || addresses[0] || null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  const saveAddresses = (updatedList) => {
    setAddresses(updatedList);
    localStorage.setItem(`addresses_${user.email}`, JSON.stringify(updatedList));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const addressToAdd = { ...newAddr, id: Date.now(), default: addresses.length === 0 };
    const newList = [...addresses, addressToAdd];
    saveAddresses(newList);
    setActiveAddressId(addressToAdd.id);
    setIsModalOpen(false);
    setNewAddr({ name: '', type: 'Home', details: '', city: '', state: '', pin: '' });
    showToast('Address added successfully!', 'success');
  };

  const deleteAddress = (id, e) => {
    e.stopPropagation();
    const newList = addresses.filter(a => a.id !== id);
    saveAddresses(newList);
    if (activeAddressId === id) {
      setActiveAddressId(newList[0]?.id || null);
    }
    showToast('Address removed.', 'info');
  };

  const demoMapUrl = (address) => {
    const query = `${address.city} ${address.details}`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <PageTitle title="My Addresses" />
      <BackButton />
      {/* Add Address Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '12px', padding: '30px', position: 'relative' }}>
            <X size={24} onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }} />
            <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '20px' }}>ADD NEW ADDRESS</h2>
            <form onSubmit={handleAddAddress}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '5px' }}>FULL NAME</label>
                <input type="text" required value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }} placeholder="e.g. Anushka Sharma" />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '5px' }}>ADDRESS TYPE</label>
                  <select value={newAddr.type} onChange={e => setNewAddr({...newAddr, type: e.target.value})} style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }}>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '5px' }}>PIN CODE</label>
                  <input type="text" required value={newAddr.pin} onChange={e => setNewAddr({...newAddr, pin: e.target.value})} style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }} placeholder="400001" />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '5px' }}>ADDRESS (FLAT/HOUSE NO, AREA)</label>
                <textarea required value={newAddr.details} onChange={e => setNewAddr({...newAddr, details: e.target.value})} style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px', minHeight: '80px' }} placeholder="Street address..."></textarea>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '5px' }}>CITY</label>
                  <input type="text" required value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }} placeholder="Mumbai" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '5px' }}>STATE</label>
                  <input type="text" required value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }} placeholder="Maharashtra" />
                </div>
              </div>
              <button type="submit" className="btn-red" style={{ width: '100%', padding: '15px', borderRadius: '6px', fontSize: '14px' }}>SAVE ADDRESS</button>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900' }}>MY ADDRESSES</h1>
        <button onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1.5px solid #eee', background: 'white', borderRadius: '4px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
          <Plus size={16} /> ADD NEW ADDRESS
        </button>
      </div>

      <div className="profile-wrapper">
        {/* Addresses List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {addresses.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', border: '1.5px dashed #ccc', borderRadius: '12px' }}>
              <p style={{ color: '#888', fontWeight: '700' }}>No addresses saved yet.</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div 
                key={addr.id} 
                onClick={() => setActiveAddressId(addr.id)}
                style={{ 
                  padding: '20px', 
                  border: addr.id === activeAddress?.id ? '2px solid var(--yaperz-green)' : '1.5px solid #eee', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  background: addr.id === activeAddress?.id ? '#f0fcfc' : 'white',
                  transition: '0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '900', color: '#555', border: '1px solid #eee' }}>
                    {addr.type === 'Home' ? <Home size={14}/> : addr.type === 'Office' ? <Briefcase size={14}/> : <MapPin size={14}/>} {addr.type.toUpperCase()}
                  </span>
                  {addr.default && <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--yaperz-green)' }}>DEFAULT</span>}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '5px' }}>{addr.name}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  {addr.details}<br/>
                  {addr.city}, {addr.state} - {addr.pin}
                </p>
                
                <div style={{ display: 'flex', gap: '20px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <button style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: '800', color: 'var(--yaperz-green)', cursor: 'pointer' }}>EDIT</button>
                  <button onClick={(e) => deleteAddress(addr.id, e)} style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: '800', color: '#e11b23', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Trash2 size={13} /> REMOVE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Google Maps View */}
        <div style={{ position: 'sticky', top: '100px', height: '500px', background: '#f9f9f9', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #eee' }}>
          {activeAddress ? (
            <>
              <div style={{ padding: '15px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Navigation size={18} color="var(--yaperz-green)" />
                <span style={{ fontSize: '13px', fontWeight: '800' }}>MAP VIEW: {activeAddress.city.toUpperCase()}</span>
              </div>
              
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={demoMapUrl(activeAddress)}
                style={{ border: 0 }}
              ></iframe>
              
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <MapPin size={24} color="#e11b23" />
                 <div>
                   <p style={{ fontSize: '12px', fontWeight: '800' }}>DELIVERING TO:</p>
                   <p style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>{activeAddress.details}</p>
                 </div>
              </div>
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontWeight: '700' }}>
              Select an address to view on map
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresses;
