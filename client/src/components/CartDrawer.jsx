import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, FALLBACK_IMAGE } from '../utils/formatters';

const CartDrawer = () => {
  const {
    cart,
    subtotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    cartTotal,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    toggleCart
  } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    const success = applyCoupon(couponCode);
    if (!success) {
      setCouponError('Invalid coupon code');
      setTimeout(() => setCouponError(''), 3000);
    } else {
      setCouponCode('');
    }
  };

  const handleCheckout = () => {
    toggleCart(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    toggleCart(false);
    navigate('/cart');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={() => toggleCart(false)}
        style={{ zIndex: 3000 }}
      />

      {/* Drawer */}
      <div
        className={`cart-drawer ${isCartOpen ? 'active' : ''}`}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            YOUR BAG <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>({cart.reduce((total, item) => total + item.quantity, 0)})</span>
          </h2>
          <button
            onClick={() => toggleCart(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: 'var(--text-primary)' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Shipping Progress */}
        <div className="shipping-progress" style={{ borderBottom: '1px solid var(--border-color)' }}>
          {(() => {
            const freeShippingThreshold = 2500;
            const remaining = Math.max(0, freeShippingThreshold - subtotal);
            const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

            return (
              <>
                <div className="progress-text">
                  <span style={{ fontSize: '11px', fontWeight: '800', color: remaining === 0 ? '#008080' : 'var(--text-primary)' }}>
                    {remaining > 0 ? `ADD ${formatPrice(remaining)} MORE FOR FREE SHIPPING` : 'YOU HAVE FREE SHIPPING!'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '800' }}>{Math.round(progress)}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%`, background: remaining === 0 ? '#008080' : 'var(--ss-red)' }}></div>
                </div>
              </>
            );
          })()}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', gap: '15px' }}>
              <ShoppingBag size={64} strokeWidth={1} />
              <p style={{ fontWeight: '700' }}>Your bag is empty</p>
              <button
                onClick={() => toggleCart(false)}
                style={{ color: 'var(--ss-red)', fontWeight: '800', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => (
                <div key={item.cartKey} style={{ display: 'flex', gap: '15px' }}>
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.name}
                    style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: '#aaa' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0' }}>{item.category}</p>
                    <p style={{ fontWeight: '900', fontSize: '14px', margin: '8px 0', color: 'var(--text-primary)' }}>{formatPrice(item.price)}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                        <button onClick={() => updateQuantity(item.cartKey, -1)} style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-primary)' }}><Minus size={14} /></button>
                        <span style={{ fontSize: '12px', fontWeight: '800', minWidth: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartKey, 1)} style={{ background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-primary)' }}><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--ss-light-grey)' }}>
            {/* Coupon Input */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '12px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
                <button
                  onClick={handleApplyCoupon}
                  style={{ padding: '10px 20px', background: 'var(--ss-dark)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  APPLY
                </button>
              </div>
              {couponError && <p style={{ color: 'var(--ss-red)', fontSize: '11px', marginTop: '5px', fontWeight: '700' }}>{couponError}</p>}
              {appliedCoupon && <p style={{ color: '#008080', fontSize: '11px', marginTop: '5px', fontWeight: '700' }}>COUPON {appliedCoupon} APPLIED! (20% OFF)</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-secondary)' }}>SUBTOTAL</span>
                <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-primary)' }}>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700', fontSize: '12px', color: '#008080' }}>DISCOUNT</span>
                  <span style={{ fontWeight: '800', fontSize: '13px', color: '#008080' }}>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <span style={{ fontWeight: '900', fontSize: '16px', color: 'var(--text-primary)' }}>TOTAL</span>
                <span style={{ fontWeight: '950', fontSize: '20px', color: 'var(--ss-red)' }}>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleViewCart}
                style={{ flex: 1, padding: '14px', background: 'white', border: '2px solid #222', fontWeight: '900', borderRadius: '6px', cursor: 'pointer' }}
              >
                VIEW BAG
              </button>
              <button
                onClick={handleCheckout}
                className="btn-red"
                style={{ flex: 1, padding: '14px', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                CHECKOUT <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
