import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, LoaderCircle, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';
import api from '../api/client';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

const initialForm = { username: '', email: '', password: '' };

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('credentials'); // 'credentials', 'otp', 'forgot', 'forgot-otp'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { setSession } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    if (step === 'credentials') {
      if (!isLogin && !formData.username.trim()) return 'Please enter a username.';
      if (!formData.email.trim()) return 'Please enter your email address.';
      if (!formData.email.includes('@')) return 'Please enter a valid email address.';
      if (!formData.password) return 'Please enter your password.';
      return '';
    }
    if (step === 'forgot') {
      if (!formData.email.trim()) return 'Please enter your email address.';
      if (!formData.email.includes('@')) return 'Please enter a valid email address.';
      return '';
    }
    if (step === 'otp' || step === 'forgot-otp') {
      if (!otp.trim()) return 'Please enter the OTP sent to your email.';
      if (step === 'forgot-otp' && newPassword.length < 6) return 'New password must be at least 6 characters long.';
      return '';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      if (step === 'otp' || step === 'forgot-otp') setOtpError(validationError); else setError(validationError);
      return;
    }

    setError('');
    setOtpError('');
    setLoading(true);

    try {
      if (step === 'credentials') {
        if (!isLogin) {
          await api.post('/register', formData);
          showToast('Account created successfully!', 'success');
          setIsLogin(true);
          setFormData(initialForm);
        } else {
          await api.post('/auth/request-otp', { email: formData.email, password: formData.password });
          setStep('otp');
          showToast('OTP sent to your email.', 'success');
        }
      } else if (step === 'forgot') {
        await api.post('/auth/forgot-password', { email: formData.email });
        setStep('forgot-otp');
        showToast('Password reset OTP sent to your email.', 'success');
      } else if (step === 'forgot-otp') {
        await api.post('/auth/reset-password', { email: formData.email, otp, newPassword });
        showToast('Password reset successfully! Please log in.', 'success');
        setStep('credentials');
        setIsLogin(true);
        setFormData(initialForm);
        setOtp('');
        setNewPassword('');
      } else if (step === 'otp') {
        const response = await api.post('/auth/verify-otp', { email: formData.email, otp });
        setSession({ user: response.data.user, token: response.data.token });
        showToast('Welcome back!', 'success');
        navigate('/profile');
      }
    } catch (err) {
      if (step === 'otp' || step === 'forgot-otp') setOtpError(err.userMessage || 'Unable to verify OTP.');
      else setError(err.userMessage || 'Unable to complete this request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setOtpError('');
      if (step === 'forgot-otp') {
        await api.post('/auth/forgot-password', { email: formData.email });
      } else {
        await api.post('/auth/request-otp', { email: formData.email, password: formData.password });
      }
      showToast('OTP resent to your email.', 'success');
    } catch (err) {
      setOtpError(err.userMessage || 'Unable to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setError('');
    setOtpError('');
    setStep('credentials');
    setFormData(initialForm);
    setOtp('');
    setNewPassword('');
  };

  return (
    <div className="auth-page">
      <PageTitle title={step.includes('forgot') ? "Forgot Password" : (isLogin ? "Sign In" : "Register")} />
      <section className="auth-panel">
        <BackButton />
        <div className="auth-heading">
          <h1>AURA STORE</h1>
          <p>{step.includes('forgot') ? 'Reset your password.' : (isLogin ? 'Welcome back.' : 'Create your account.')}</p>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}
        {otpError && (
          <div className="error-banner" role="alert">
            <AlertCircle size={17} />
            <span>{otpError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {step === 'credentials' && (
            <>
              {!isLogin && (
                <label className="field-group">
                  <span>Username</span>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(event) => updateField('username', event.target.value)}
                      placeholder="Username"
                      autoComplete="username"
                    />
                  </div>
                </label>
              )}
              <label className="field-group">
                <span>Email Address</span>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="field-group">
                <span>Password</span>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <Lock size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Enter password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
              {isLogin && (
                <div style={{ textAlign: 'right', marginTop: '4px' }}>
                  <button type="button" onClick={() => { setError(''); setStep('forgot'); }} style={{ background: 'none', border: 'none', color: '#888', fontSize: '13px', cursor: 'pointer' }}>
                    Forgot Password?
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'forgot' && (
            <>
              <label className="field-group">
                <span>Email Address</span>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    placeholder="Enter your account email"
                    autoComplete="email"
                  />
                </div>
              </label>
            </>
          )}

          {(step === 'otp' || step === 'forgot-otp') && (
            <>
              <label className="field-group">
                <span>One‑Time Password</span>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    autoComplete="one-time-code"
                  />
                </div>
              </label>
              
              {step === 'forgot-otp' && (
                <label className="field-group" style={{ marginTop: '16px' }}>
                  <span>New Password</span>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <Lock size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
              )}

              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={handleResendOtp} 
                  style={{ background: 'none', border: 'none', color: '#e11b23', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}

          <button type="submit" className="btn-red auth-submit" disabled={loading} style={{ marginTop: '24px' }}>
            {loading ? <LoaderCircle size={18} className="spin-icon" /> : <ArrowRight size={18} />}
            {step === 'credentials' ? (isLogin ? 'Sign In' : 'Create Account') : step === 'forgot' ? 'Send Reset OTP' : step === 'forgot-otp' ? 'Reset Password' : 'Verify OTP'}
          </button>
        </form>

        <div className="auth-switch">
          {step.includes('forgot') ? (
            <button type="button" onClick={() => { setStep('credentials'); setError(''); }}>
              Back to Login
            </button>
          ) : (
            <>
              <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
              <button type="button" onClick={toggleMode}>
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Login;
