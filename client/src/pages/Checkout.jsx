import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  Banknote,
  Briefcase,
  CheckCircle,
  CreditCard,
  Home,
  LoaderCircle,
  MapPin,
  Plus,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import api from '../api/client';
import { formatPrice } from '../utils/formatters';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';
import confetti from 'canvas-confetti';

const paymentOptions = [
  { id: 'stripe', label: 'Card Payment', detail: 'Pay with credit/debit card', icon: Smartphone },
  { id: 'cod', label: 'Cash on Delivery', detail: 'Pay when your order arrives', icon: Banknote },
];

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


const Checkout = () => {
  const { cart, subtotal, discountAmount, cartTotal, clearCart, applyCoupon, appliedCoupon } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [addresses] = useState(() => getSavedAddresses(user?.email));
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const savedAddresses = getSavedAddresses(user?.email);
    const defaultAddress = savedAddresses.find((address) => address.default) || savedAddresses[0];
    return defaultAddress?.id || null;
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paymentError, setPaymentError] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const finalTotal = Math.round(cartTotal * 1.05);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const elements = useElements();


  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cart.length === 0 && !isOrdered) {
      navigate('/cart');
    }
  }, [cart.length, user, navigate]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    try {
      const success = await applyCoupon(couponInput);
      if (success) {
        showToast('Coupon applied successfully!', 'success');
        setCouponInput('');
      } else {
        showToast('Invalid coupon code.', 'error');
      }
    } catch (err) {
      showToast('Error applying coupon.', 'error');
    } finally {
      setIsApplying(false);
    }
  };




  const saveOrder = (payment) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(Math.random() * 1000000),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      total: finalTotal,
      status: payment.status === 'paid' ? 'Paid' : 'Placed',
      payment,
      items: cart,
    };

    const existingOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
    localStorage.setItem(`orders_${user.email}`, JSON.stringify([newOrder, ...existingOrders]));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11b23', '#222222', '#ffffff', '#008080']
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (addresses.length === 0) {
      showToast('Please add a delivery address first!', 'warning');
      navigate('/addresses');
      return;
    }

    if (paymentMethod === 'cod') {
      setIsPaying(true);
      try {
        const payload = { amount: finalTotal, method: 'cod', metadata: { items: cart } };
        const response = await api.post('/payments', payload);
        saveOrder(response.data.payment);
        setIsOrdered(true);
        triggerConfetti();
        setTimeout(() => {
          clearCart();
          navigate('/profile');
        }, 3000);
      } catch (err) {
        setPaymentError(err.userMessage || 'Payment could not be processed.');
      } finally {
        setIsPaying(false);
      }
      return;
    }



  if (paymentMethod === 'stripe') {
  setIsPaying(true);
  setPaymentError('');
  try {
    // 1. Create Stripe PaymentIntent and get client secret
    const intentRes = await api.post('/payments/create-intent', { amount: finalTotal });
    const clientSecret = intentRes.data.clientSecret;
    // 2. Confirm Card Payment using Stripe Elements
    const stripe = await stripePromise;
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.username,
          email: user.email,
        },
      },
    });
    if (error) {
      setPaymentError(error.message || 'Payment failed.');
      setIsPaying(false);
      return;
    }
    // Save order with Stripe payment details
    const payment = {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      method: 'stripe',
      status: paymentIntent.status,
      reference: paymentIntent.id,
      metadata: paymentIntent.metadata || {},
    };
    saveOrder(payment);
    setIsOrdered(true);
    triggerConfetti();
    setTimeout(() => {
      clearCart();
      navigate('/profile');
    }, 3000);
  } catch (err) {
    setPaymentError(err.message || 'Could not process payment.');
    setIsPaying(false);
  }
}  };


  useEffect(() => {
    let timer;
    if (isOrdered && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOrdered, countdown]);

  if (isOrdered) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ background: 'var(--ss-light-grey)', padding: '80px 20px', borderRadius: '12px' }}>
          <CheckCircle size={80} style={{ color: '#008080', margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '950', marginBottom: '10px' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Payment confirmed. Thank you for shopping with AURA STORE.</p>
          <p style={{ color: '#999', fontSize: '13px', marginTop: '15px', fontWeight: '800' }}>REDIRECTING TO YOUR ORDERS IN {countdown} SECONDS...</p>
          
          {/* Progress Bar */}
          <div style={{ width: '200px', height: '4px', background: '#eee', borderRadius: '10px', margin: '20px auto 0', overflow: 'hidden', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              height: '100%', 
              width: `${(countdown / 3) * 100}%`, 
              background: '#008080', 
              transition: 'width 1s linear',
              borderRadius: '10px'
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Checkout Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px' }}>
        {[
          { label: 'ADDRESS', step: 1 },
          { label: 'PAYMENT', step: 2 },
          { label: 'COMPLETED', step: 3 },
        ].map((item, index, array) => (
          <div key={item.step} style={{ display: 'flex', alignItems: 'center', flex: index === array.length - 1 ? 'none' : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: isOrdered || (item.step === 1) || (item.step === 2 && paymentMethod) ? '#008080' : '#eee', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '14px', 
                fontWeight: '900',
                border: '4px solid white',
                boxShadow: '0 0 0 1px #eee'
              }}>
                {isOrdered && item.step < 3 ? '✓' : item.step}
              </div>
              <span style={{ fontSize: '10px', fontWeight: '900', marginTop: '8px', color: isOrdered || (item.step === 1) || (item.step === 2 && paymentMethod) ? '#008080' : '#999' }}>{item.label}</span>
            </div>
            {index !== array.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: isOrdered || (item.step === 1 && paymentMethod) ? '#008080' : '#eee', margin: '0 15px', marginTop: '-18px' }}></div>
            )}
          </div>
        ))}
      </div>

      <PageTitle title="Checkout" />
      <BackButton label="Back to Cart" />
      <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '50px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '30px' }}>SELECT DELIVERY ADDRESS</h1>

          {addresses.length === 0 ? (
            <div style={{ padding: '40px', background: 'var(--ss-light-grey)', borderRadius: '12px', textAlign: 'center', border: '1.5px dashed #ccc' }}>
              <p style={{ color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '20px' }}>You haven't saved any addresses yet.</p>
              <Link to="/addresses" className="btn-red" style={{ padding: '12px 25px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', display: 'inline-block' }}>
                + ADD NEW ADDRESS
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  style={{
                    padding: '20px',
                    border: selectedAddressId === addr.id ? '2px solid #008080' : '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedAddressId === addr.id ? 'var(--ss-light-grey)' : 'transparent',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    transition: '0.2s',
                  }}
                >
                  <input type="radio" checked={selectedAddressId === addr.id} readOnly style={{ marginTop: '5px' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '900' }}>{addr.name}</h3>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                        {addr.type === 'Home' ? <Home size={12} /> : addr.type === 'Office' ? <Briefcase size={12} /> : <MapPin size={12} />} {addr.type.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {addr.details}, {addr.city}, {addr.state} - {addr.pin}
                    </p>
                  </div>
                </div>
              ))}

              <Link to="/addresses" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#e11b23', textDecoration: 'none', marginTop: '10px' }}>
                <Plus size={16} /> ADD ANOTHER ADDRESS
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900' }}>PAYMENT METHOD</h2>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#008080', fontSize: '12px', fontWeight: '900' }}>
              <ShieldCheck size={16} /> SECURE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isActive = paymentMethod === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(option.id);
                    setPaymentError('');
                  }}
                  style={{
                    background: isActive ? 'var(--ss-light-grey)' : 'transparent',
                    border: isActive ? '2px solid #008080' : '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    padding: '16px',
                    textAlign: 'left',
                    color: 'var(--text-primary)'
                  }}
                >
                  <Icon size={22} color={isActive ? '#008080' : '#555'} />
                  <span>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '900' }}>{option.label}</span>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{option.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handlePlaceOrder}>

            {paymentMethod === 'stripe' && (
              <div style={{ background: 'var(--ss-light-grey)', border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '22px', marginBottom: '18px' }}>
                <CardElement options={{ style: { base: { color: '#32325d', fontFamily: 'Arial, sans-serif', fontSize: '16px', '::placeholder': { color: '#a0aec0' } }, invalid: { color: '#fa755a' } } }} />
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div style={{ background: 'var(--ss-light-grey)', border: '1.5px solid #ffe0a6', borderRadius: '12px', padding: '18px', marginBottom: '18px', color: '#ff9800', fontSize: '13px', fontWeight: '700' }}>
                Cash will be collected at delivery. Your order will be marked as payment pending.
              </div>
            )}

            {paymentError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#e11b23', background: '#fff1f1', border: '1px solid #ffcaca', borderRadius: '8px', padding: '12px 14px', marginBottom: '18px', fontSize: '13px', fontWeight: '800' }}>
                <AlertCircle size={16} />
                {paymentError}
              </div>
            )}
          </form>
        </div>

        <div>
          <div style={{ background: 'var(--ss-light-grey)', padding: '30px', borderRadius: '12px', position: 'sticky', top: '100px', border: '1.5px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>ORDER SUMMARY</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: '#008080', fontWeight: '700' }}>
                <span>Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', marginBottom: '10px' }}>HAVE A COUPON CODE?</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter Code (e.g. AURA20)"
                  style={{ flex: 1, padding: '10px', border: '1.5px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!couponInput.trim() || isApplying}
                  style={{ padding: '0 20px', background: '#222', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', transition: '0.2s', opacity: !couponInput.trim() || isApplying ? 0.5 : 1 }}
                >
                  {isApplying ? '...' : 'APPLY'}
                </button>
              </div>
              {appliedCoupon && (
                <p style={{ color: '#008080', fontSize: '12px', fontWeight: '800', marginTop: '10px' }}>
                  ✅ Coupon {appliedCoupon} applied!
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span style={{ color: '#008080', fontWeight: '800' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              <span>Taxes (5%)</span>
              <span>{formatPrice(cartTotal * 0.05)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '20px', fontWeight: '950', color: 'var(--ss-red)' }}>
              <span>TOTAL</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="btn-red"
              disabled={addresses.length === 0 || isPaying}
              style={{ width: '100%', padding: '18px', fontSize: '15px', borderRadius: '6px', opacity: addresses.length === 0 || isPaying ? 0.5 : 1, cursor: addresses.length === 0 || isPaying ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isPaying && <LoaderCircle size={18} className="spin-icon" />}
              {paymentMethod === 'cod' ? 'PLACE ORDER' : `PAY ${formatPrice(finalTotal)}`}
            </button>
          </div>
        </div>
      </div>
        </div>
    </Elements>
  );
};

export default Checkout;
