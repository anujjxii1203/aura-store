import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, LoaderCircle, Lock, Mail, User } from 'lucide-react';
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
  const [step, setStep] = useState('credentials'); // 'credentials' or 'otp'
  const [otp, setOtp] = useState('');
  const { setSession } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    if (step === 'credentials') {
      if (!isLogin && !formData.username.trim()) {
        return 'Please enter a username.';
      }
      if (!formData.email.trim()) {
        return 'Please enter your email address.';
      }
      if (!formData.email.includes('@')) {
        return 'Please enter a valid email address.';
      }
      if (!formData.password) {
        return 'Please enter your password.';
      }
      return '';
    }
    // OTP step validation
    if (step === 'otp') {
      if (!otp.trim()) {
        return 'Please enter the OTP sent to your email.';
      }
      return '';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      if (step === 'otp') setOtpError(validationError); else setError(validationError);
      return;
    }

    setError('');
    setOtpError('');
    setLoading(true);

    try {
      if (step === 'credentials') {
        if (!isLogin) {
          const response = await api.post('/register', formData);
          showToast('Account created successfully!', 'success');
          setIsLogin(true);
          setFormData(initialForm);
        } else {
          await api.post('/auth/request-otp', { email: formData.email, password: formData.password });
          setStep('otp');
          showToast('OTP sent to your email.', 'success');
        }
      } else if (step === 'otp') {
        const response = await api.post('/auth/verify-otp', { email: formData.email, otp });
        setSession({ user: response.data.user, token: response.data.token });
        showToast('Welcome back!', 'success');
        navigate('/profile');
      }
    } catch (err) {
      if (step === 'otp') setOtpError(err.userMessage || 'Unable to verify OTP.');
      else setError(err.userMessage || 'Unable to complete this request.');
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
  };

  return (
    <div className="auth-page">
      <PageTitle title={isLogin ? "Sign In" : "Register"} />
      <section className="auth-panel">
        <BackButton />
        <div className="auth-heading">
          <h1>AURA STORE</h1>
          <p>{isLogin ? 'Welcome back.' : 'Create your account.'}</p>
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
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Enter password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                </div>
              </label>
            </>
          )}
          {step === 'otp' && (
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
          )}

          <button type="submit" className="btn-red auth-submit" disabled={loading}>
            {loading ? <LoaderCircle size={18} className="spin-icon" /> : <ArrowRight size={18} />}
            {step === 'credentials' ? (isLogin ? 'Sign In' : 'Create Account') : 'Verify OTP'}
          </button>
        </form>

        <div className="auth-switch">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button type="button" onClick={toggleMode}>
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Login;
