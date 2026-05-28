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
  const [loading, setLoading] = useState(false);
  const { setSession } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    if (!isLogin && !formData.username.trim()) {
      return 'Full name is required to create an account.';
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

    if (!isLogin && formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.username, email: formData.email, password: formData.password };
      const response = await api.post(endpoint, payload);

      setSession({ user: response.data.user, token: response.data.token });
      showToast(isLogin ? 'Welcome back!' : 'Account created successfully!', 'success');
      navigate('/profile');
    } catch (err) {
      setError(err.userMessage || 'Unable to complete this request.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setError('');
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

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <label className="field-group">
              <span>Full Name</span>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(event) => updateField('username', event.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
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

          <button type="submit" className="btn-red auth-submit" disabled={loading}>
            {loading ? <LoaderCircle size={18} className="spin-icon" /> : <ArrowRight size={18} />}
            {isLogin ? 'Sign In' : 'Create Account'}
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
