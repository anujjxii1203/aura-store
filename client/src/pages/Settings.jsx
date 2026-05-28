import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Bell, Shield, Save } from 'lucide-react';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';

const Settings = () => {
  const { user, updateUser, logout } = useUser();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [localUser, setLocalUser] = useState(() => ({
    username: user?.username || '',
    email: user?.email || '',
  }));
  const [activeTab, setActiveTab] = useState('profile');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUser(localUser);
    showToast("Profile updated successfully!", "success");
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/me');
      
      // Clear associated local storage data
      if (user?.email) {
        localStorage.removeItem(`orders_${user.email}`);
        localStorage.removeItem(`addresses_${user.email}`);
      }
      
      logout();
      navigate('/');
      showToast("Account deleted successfully.", "info");
    } catch (err) {
      showToast(err.userMessage || "Failed to delete account. Please try again.", "error");
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <PageTitle title="Account Settings" />
      <BackButton />
      <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px' }}>ACCOUNT SETTINGS</h1>
      
      <div className="profile-wrapper" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }}>
        {/* Settings Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: activeTab === 'profile' ? '#f0fcfc' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', color: activeTab === 'profile' ? 'var(--yaperz-green)' : '#555', textAlign: 'left' }}
          >
            <User size={18} /> PROFILE
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: activeTab === 'security' ? '#f0fcfc' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', color: activeTab === 'security' ? 'var(--yaperz-green)' : '#555', textAlign: 'left' }}
          >
            <Shield size={18} /> SECURITY
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: activeTab === 'notifications' ? '#f0fcfc' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', color: activeTab === 'notifications' ? 'var(--yaperz-green)' : '#555', textAlign: 'left' }}
          >
            <Bell size={18} /> NOTIFICATIONS
          </button>
        </div>

        {/* Settings Content */}
        <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '12px', border: '1.5px solid #eee' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px' }}>PUBLIC PROFILE</h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '8px' }}>FULL NAME</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                  <input 
                    type="text" 
                    value={localUser.username} 
                    onChange={(e) => setLocalUser({...localUser, username: e.target.value})}
                    style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1.5px solid #eee', borderRadius: '6px' }} 
                  />
                </div>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '8px' }}>EMAIL ADDRESS</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                  <input 
                    type="email" 
                    value={localUser.email} 
                    onChange={(e) => setLocalUser({...localUser, email: e.target.value})}
                    style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1.5px solid #eee', borderRadius: '6px' }} 
                  />
                </div>
              </div>
              <button type="submit" className="btn-red" style={{ padding: '12px 30px', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={18} /> SAVE CHANGES
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={(e) => e.preventDefault()}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px' }}>SECURITY & PASSWORD</h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '8px' }}>CURRENT PASSWORD</label>
                <input type="password" name="current_password" autoComplete="current-password" style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', marginBottom: '8px' }}>NEW PASSWORD</label>
                <input type="password" name="new_password" autoComplete="new-password" style={{ width: '100%', padding: '12px', border: '1.5px solid #eee', borderRadius: '6px' }} />
              </div>
              <button type="submit" className="btn-red" style={{ padding: '12px 30px', borderRadius: '6px', fontSize: '14px' }}>UPDATE PASSWORD</button>
              
              <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#e11b23', marginBottom: '10px' }}>DANGER ZONE</h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button type="button" onClick={handleDeleteAccount} style={{ padding: '10px 20px', border: '1.5px solid #e11b23', color: '#e11b23', background: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
                  DELETE ACCOUNT
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '25px' }}>NOTIFICATION PREFERENCES</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { title: 'Email Notifications', desc: 'Receive order updates and promotions via email.' },
                  { title: 'SMS Alerts', desc: 'Get real-time delivery tracking on your phone.' },
                  { title: 'New Drops', desc: 'Be the first to know about upcoming urban collections.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid #eee' }}>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '14px' }}>{item.title}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
