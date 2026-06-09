import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, RotateCcw, Truck, Filter, ListFilter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import PageTitle from '../components/PageTitle';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Men = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();


  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const priceFilter = searchParams.get('price') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.gender === 'Men' && p.category !== 'Footwear');
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(product => {
        const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase();
        return searchable.includes(query);
      });
    }
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (priceFilter !== 'All') {
      if (priceFilter === 'under-1000') result = result.filter(p => p.price < 1000);
      else if (priceFilter === '1000-2000') result = result.filter(p => p.price >= 1000 && p.price <= 2000);
      else if (priceFilter === 'over-2000') result = result.filter(p => p.price > 2000);
    }
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') result.sort((a, b) => b.id - a.id);
    return result;
  }, [products, searchQuery, categoryFilter, priceFilter, sortBy]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/products', {
          params: { gender: 'Men' },
          signal: controller.signal,
        });
        setProducts(response.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.userMessage || 'Products could not be loaded.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, [searchQuery]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'All' || !value) nextParams.delete(key);
    else nextParams.set(key, value);
    setSearchParams(nextParams);
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <main>
      <PageTitle title="Men's Collection" />
      <section className="category-tabs" aria-label="Shop by gender">
        <div className="container">
          <div className="tab-list">
            <button
              type="button"
              className="tab-item active"
            >
              Men
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/?gender=Women'}
              className="tab-item"
            >
              Women
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/footwear'}
              className="tab-item"
            >
              Footwear
            </button>
          </div>
        </div>
      </section>
      {/* Hero Section */}
      <section className="hero-full" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1800&q=85')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '400px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))' }}></div>
        <div style={{ position: 'relative', zIndex: 1, color: '#fff', padding: '2rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '0.5rem', letterSpacing: '1px' }}>MEN'S STREETWEAR</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '600' }}>Explore premium tees, jackets, pants and more.</p>
          <a href="/men" style={{
            display: 'inline-block',
            background: '#fff',
            color: '#111',
            padding: '0.8rem 2rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '800',
            fontSize: '1rem',
            textTransform: 'uppercase'
          }}>Shop Now</a>
        </div>
      </section>

<div className="trust-strip" style={{ background: 'var(--ss-light-grey)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '15px', display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
  <div className="trust-item"><Truck size={20} color="var(--ss-red)" /> <span style={{ fontWeight: '900' }}>Express Shipping</span></div>
  <div className="trust-item"><RotateCcw size={20} color="var(--ss-red)" /> <span style={{ fontWeight: '900' }}>Hassle-Free Returns</span></div>
  <div className="trust-item"><CreditCard size={20} color="var(--ss-red)" /> <span style={{ fontWeight: '900' }}>Secure Checkout</span></div>
</div>
      {/* Filter Bar */}
      <section className="container shop-section">
        {!searchQuery && (
          <div style={{ marginBottom: '4rem' }}>
            <div className="section-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <h2 style={{ color: 'black', fontSize: '32px', fontWeight: '950', textTransform: 'uppercase' }}>
                CATEGORIES
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              {[
                { name: 'T-Shirts', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80' },
                { name: 'Outerwear', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80' },
                { name: 'Bottomwear', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80' },
                { name: 'Hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80' }
              ].map(cat => (
                <div
                  key={cat.name}
                  onClick={() => {
                    updateFilter('category', cat.name);
                    const el = document.querySelector('.filter-bar');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    height: '220px',
                    boxShadow: categoryFilter === cat.name ? '0 0 0 4px var(--ss-red)' : '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = categoryFilter === cat.name ? '0 0 0 4px var(--ss-red)' : '0 4px 6px rgba(0,0,0,0.1)'; }}
                >
                  <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '30px 10px 15px',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: '900',
                    fontSize: '18px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    {cat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ color: 'black', fontSize: '32px', fontWeight: '950', textTransform: 'uppercase', marginBottom: '5px' }}>
            {searchQuery ? `SEARCH RESULTS FOR: "${searchQuery.toUpperCase()}"` : 'ALL PRODUCTS'}
          </h2>
        </div>
        <div className="filter-bar" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '800' }}>
            <Filter size={14} /> FILTERS:
          </div>
          <select className="filter-select" value={categoryFilter} onChange={e => updateFilter('category', e.target.value)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontWeight: '900', cursor: 'pointer' }}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
          <select className="filter-select" value={priceFilter} onChange={e => updateFilter('price', e.target.value)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontWeight: '900', cursor: 'pointer' }}>
            <option value="All">ALL PRICES</option>
            <option value="under-1000">UNDER ₹1000</option>
            <option value="1000-2000">₹1000 - ₹2000</option>
            <option value="over-2000">OVER ₹2000</option>
          </select>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '800' }}>
            <ListFilter size={14} /> SORT BY:
          </div>
          <select className="filter-select" value={sortBy} onChange={e => updateFilter('sort', e.target.value)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontWeight: '900', cursor: 'pointer' }}>
            <option value="newest">NEWEST FIRST</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
          </select>
        </div>

        {loading ? (
          <div className="product-grid">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="state-panel">
            <h3>Products did not load</h3>
            <p>{error}</p>
            <button type="button" className="btn-red state-action" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <motion.div className="product-grid" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {filteredProducts.length === 0 ? (
              <div className="state-panel product-grid-empty">
                <h3>No results found</h3>
                <p>Nothing matched your selection. Try adjusting filters or search.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                    <ProductCard product={product} isWishlisted={isInWishlist(product.id)} onAddToCart={handleAddToCart} onWishlistToggle={toggleWishlist} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </section>


    </main>
  );
};

export default Men;
