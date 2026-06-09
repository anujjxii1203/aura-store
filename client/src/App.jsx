import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Men from './pages/Men';
import Footwear from './pages/Footwear';
import Drops from './pages/Drops';
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

const MainLayout = () => (
  <>
    <FloatingActions />
    <CartDrawer />
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const AdminLayout = () => (
  <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
    <Outlet />
  </div>
);

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
                <Routes>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin-data" element={<AdminStats />} />
                  </Route>

                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/men" element={<Men />} />
                    <Route path="/footwear" element={<Footwear />} />
                    <Route path="/drops" element={<Drops />} />
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
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </div>
            </CartProvider>
          </WishlistProvider>
        </UserProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
