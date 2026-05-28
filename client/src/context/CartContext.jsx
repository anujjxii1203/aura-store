import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/client';

const CartContext = createContext();
const getCartKey = (product) => `${product.id}:${product.selectedSize || 'standard'}`;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      localStorage.removeItem('cart');
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const cartKey = getCartKey(product);
      const existing = prevCart.find(item => (item.cartKey || getCartKey(item)) === cartKey);

      if (existing) {
        return prevCart.map(item => 
          (item.cartKey || getCartKey(item)) === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, cartKey, quantity: 1 }];
    });
    toggleCart(true); // Open drawer automatically
  };

  const removeFromCart = (cartKey) => {
    setCart(prevCart => prevCart.filter(item => (item.cartKey || getCartKey(item)) !== cartKey));
  };

  const updateQuantity = (cartKey, amount) => {
    setCart(prevCart => 
      prevCart.map(item => 
        (item.cartKey || getCartKey(item)) === cartKey ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const toggleCart = (state) => setIsCartOpen(prev => typeof state === 'boolean' ? state : !prev);

  const applyCoupon = async (code) => {
    try {
      const response = await api.post('/coupons/validate', { code });
      const coupon = response.data;
      
      const value = coupon.discount_type === 'percentage' 
        ? coupon.discount_value / 100 
        : coupon.discount_value / subtotal;
        
      setDiscount(value);
      setAppliedCoupon(code.toUpperCase());
      return true;
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon('');
      return false;
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const cartTotal = subtotal - discountAmount;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartCount, 
      subtotal,
      discountAmount,
      discount,
      appliedCoupon,
      applyCoupon,
      cartTotal, 
      clearCart,
      isCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
