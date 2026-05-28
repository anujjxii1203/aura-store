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

const genders = ['Men', 'Women'];

const getGenderFromParams = (searchParams) => {
  const gender = searchParams.get('gender');
  return genders.find((item) => item.toLowerCase() === gender?.toLowerCase()) || 'Men';
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const genderFilter = getGenderFromParams(searchParams);
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const priceFilter = searchParams.get('price') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((product) => {
        const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase();
        return searchable.includes(query);
      });
    }

    // Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Price Filter
    if (priceFilter !== 'All') {
      if (priceFilter === 'under-1000') result = result.filter(p => p.price < 1000);
      else if (priceFilter === '1000-2000') result = result.filter(p => p.price >= 1000 && p.price <= 2000);
      else if (priceFilter === 'over-2000') result = result.filter(p => p.price > 2000);
    }

    // Sorting
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
        // If searching, we fetch all products to make it a global search
        const params = searchQuery.trim() ? {} : { gender: genderFilter };
        
        const response = await api.get('/products', {
          params,
          signal: controller.signal,
        });
        setProducts(response.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.userMessage || 'Products could not be loaded.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [genderFilter, searchQuery]);

  const handleGenderChange = (gender) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('gender', gender);
    // Reset filters when changing gender
    nextParams.delete('category');
    nextParams.delete('price');
    setSearchParams(nextParams);
  };

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
      <PageTitle title="Shop Streetwear" />
      <section className="category-tabs" aria-label="Shop by gender">
        <div className="container">
          <div className="tab-list">
            {genders.map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => handleGenderChange(gender)}
                className={`tab-item ${genderFilter === gender ? 'active' : ''}`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>
      </section>

      {!searchQuery.trim() && (
        <section className="hero-full">
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>URBAN AURA</h1>
            <p>New streetwear drops in premium cotton, structured denim, and everyday layers.</p>
          </div>
        </section>
      )}

      <section className="container shop-section">
        <div className="trust-strip" style={{ background: 'var(--ss-light-grey)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          <div className="trust-item"><Truck size={20} color="var(--ss-red)" /> <span style={{ fontWeight: '900' }}>Express Shipping</span></div>
          <div className="trust-item"><RotateCcw size={20} color="var(--ss-red)" /> <span style={{ fontWeight: '900' }}>Hassle-Free Returns</span></div>
          <div className="trust-item"><CreditCard size={20} color="var(--ss-red)" /> <span style={{ fontWeight: '900' }}>Secure Checkout</span></div>
        </div>

        <div className="section-title" style={{ marginBottom: '10px' }}>
          <h2 style={{ color: 'black', fontSize: '24px', fontWeight: '950' }}>
            {searchQuery ? `SEARCH RESULTS FOR: "${searchQuery.toUpperCase()}"` : `TOP TRENDING: ${genderFilter.toUpperCase()}`}
          </h2>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '800' }}>
            <Filter size={14} /> FILTERS:
          </div>
          
          <select 
            className="filter-select" 
            value={categoryFilter} 
            onChange={(e) => updateFilter('category', e.target.value)}
            style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontWeight: '900', cursor: 'pointer' }}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
          </select>

          <select 
            className="filter-select" 
            value={priceFilter} 
            onChange={(e) => updateFilter('price', e.target.value)}
            style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontWeight: '900', cursor: 'pointer' }}
          >
            <option value="All">ALL PRICES</option>
            <option value="under-1000">UNDER ₹1000</option>
            <option value="1000-2000">₹1000 - ₹2000</option>
            <option value="over-2000">OVER ₹2000</option>
          </select>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '800' }}>
            <ListFilter size={14} /> SORT BY:
          </div>
          <select 
            className="filter-select" 
            value={sortBy} 
            onChange={(e) => updateFilter('sort', e.target.value)}
            style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontWeight: '900', cursor: 'pointer' }}
          >
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
            <button type="button" className="btn-red state-action" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : (
          <motion.div 
            className="product-grid"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {filteredProducts.length === 0 ? (
              <div className="state-panel product-grid-empty">
                <h3>No results found</h3>
                <p>Nothing matched your selection. Try adjusting filters or search.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard
                      product={product}
                      isWishlisted={isInWishlist(product.id)}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={toggleWishlist}
                    />
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

export default Home;
