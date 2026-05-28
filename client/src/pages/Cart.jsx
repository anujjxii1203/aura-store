import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { FALLBACK_IMAGE, formatPrice } from '../utils/formatters';
import BackButton from '../components/BackButton';
import PageTitle from '../components/PageTitle';

const Cart = () => {
  const { cart, cartCount, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/checkout');
    } else {
      showToast("Please log in to proceed with your order.", "warning");
      navigate('/login');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <PageTitle title="Empty Bag" />
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
          <BackButton />
        </div>
        <div style={{ background: '#f9f9f9', padding: '60px', borderRadius: '12px' }}>
          <ShoppingBag size={80} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px' }}>Your bag is empty!</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Looks like you haven't added anything to your bag yet.</p>
          <Link to="/" className="btn-red" style={{ display: 'inline-block', padding: '15px 40px', borderRadius: '4px', textDecoration: 'none' }}>START SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <PageTitle title="Shopping Bag" />
      <BackButton />
      <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '30px' }}>MY SHOPPING BAG ({cartCount})</h1>

      <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* Cart Items List */}
        <div>
          {cart.map((item) => {
            const itemKey = item.cartKey || `${item.id}:${item.selectedSize || 'standard'}`;

            return (
              <div key={itemKey} className="cart-item" style={{ display: 'flex', gap: '20px', padding: '20px 0', borderBottom: '1px solid #eee' }}>
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.name}
                  onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }}
                  style={{ width: '120px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{item.name}</h3>
                    <p style={{ fontSize: '16px', fontWeight: '900' }}>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <p style={{ color: '#777', fontSize: '13px', marginBottom: '15px' }}>
                    {item.category}{item.selectedSize ? ` / Size ${item.selectedSize}` : ''}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #eee', borderRadius: '4px' }}>
                      <button onClick={() => updateQuantity(itemKey, -1)} style={{ padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                      <span style={{ padding: '0 10px', fontWeight: '800' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(itemKey, 1)} style={{ padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(itemKey)} style={{ color: '#e11b23', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '700' }}>
                      <Trash2 size={14} /> REMOVE
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px', color: '#555', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}>
            <ArrowLeft size={18} /> CONTINUE SHOPPING
          </Link>
        </div>

        {/* Order Summary */}
        <div style={{ background: '#f9f9f9', padding: '25px', borderRadius: '12px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>ORDER SUMMARY</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555', fontSize: '14px' }}>
            <span>Bag Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555', fontSize: '14px' }}>
            <span>Shipping Charges</span>
            <span style={{ color: '#008080', fontWeight: '800' }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: '#555', fontSize: '14px' }}>
            <span>Tax (Estimated)</span>
            <span>{formatPrice(cartTotal * 0.05)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
            <span style={{ fontWeight: '900', fontSize: '16px' }}>Total Amount</span>
            <span style={{ fontWeight: '900', fontSize: '16px' }}>{formatPrice(cartTotal * 1.05)}</span>
          </div>
          <button onClick={handleCheckoutClick} className="btn-red" style={{ width: '100%', display: 'block', textAlign: 'center', padding: '15px', borderRadius: '4px', textDecoration: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
