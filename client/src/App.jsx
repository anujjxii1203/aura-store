import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Addresses from './pages/Addresses';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import TrackOrder from './pages/TrackOrder';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Shipping from './pages/Shipping';
import QA from './pages/QA';
import Returns from './pages/Returns';
import { ToastProvider } from './context/ToastContext';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './components/NotFound';
import CartDrawer from './components/CartDrawer';
import FloatingActions from './components/FloatingActions';
import AdminStats from './pages/AdminStats';


function App() {
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoad) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Preloader />
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <UserProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="App">
                <FloatingActions />
                <CartDrawer />
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/addresses" element={<Addresses />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/qa" element={<QA />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/admin-data" element={<AdminStats />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </div>
            </CartProvider>
          </WishlistProvider>
        </UserProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
