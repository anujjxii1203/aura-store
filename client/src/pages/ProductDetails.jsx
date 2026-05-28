import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Check, ShieldCheck, Truck, Plus, Minus, Share2, Ruler, X, Star, MessageSquare } from 'lucide-react';
import BackButton from '../components/BackButton';
import Preloader from '../components/Preloader';
import PageTitle from '../components/PageTitle';
import ProductCard from '../components/ProductCard';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { FALLBACK_IMAGE, formatPrice, getOriginalPrice } from '../utils/formatters';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { user } = useUser();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [stockWarning] = useState(() => Math.floor(Math.random() * 5) + 1);

  // Review State
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const data = response.data;
      setProduct(data);
      
      // Save to Recently Viewed
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updated = [data, ...recentlyViewed.filter(p => p.id !== data.id)].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));

      // Fetch Related
      const relatedRes = await api.get(`/products?category=${data.category}`);
      setRelatedProducts(relatedRes.data.filter(p => p.id !== data.id).slice(0, 4));
    } catch (err) {
      setError(err.userMessage || 'Failed to load product details.');
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, quantity });
    setIsAdded(true);
    showToast(`${product.name} added to bag!`, 'success');
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to leave a review.', 'error');
      navigate('/login');
      return;
    }
    setIsSubmittingReview(true);
    try {
      await api.post('/reviews', { product_id: id, ...reviewForm });
      showToast('Review submitted successfully!', 'success');
      setReviewForm({ rating: 5, comment: '' });
      fetchProduct();
    } catch (err) {
      showToast('Failed to submit review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (error) return <div className="container" style={{ padding: '100px', textAlign: 'center', color: '#e11b23', fontWeight: 'bold' }}>{error}</div>;
  if (!product) return <Preloader />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <PageTitle title={product.name} />
      <div className="breadcrumbs">
        <Link to="/">HOME</Link>
        <span>/</span>
        <Link to={`/?gender=${product.gender || 'Men'}`}>{product.gender ? product.gender.toUpperCase() : 'UNISEX'}</Link>
        <span>/</span>
        <Link to={`/?gender=${product.gender || 'Men'}&category=${product.category}`}>{product.category ? product.category.toUpperCase() : 'APPAREL'}</Link>
        <span>/</span>
        <span>{product.name.toUpperCase()}</span>
      </div>

      <BackButton label="Back to Shop" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }} className="pdp-grid">
        <div style={{ borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
          <img src={product.image || FALLBACK_IMAGE} alt={product.name} style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover', aspectRatio: '4/5' }} />
          <button onClick={() => toggleWishlist(product)} className="product-card-icon-button" style={{ position: 'absolute', top: '20px', right: '20px', width: '45px', height: '45px', zIndex: 10 }}>
            <Heart size={20} fill={isInWishlist(product.id) ? '#e11b23' : 'none'} color={isInWishlist(product.id) ? '#e11b23' : '#333'} />
          </button>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', background: 'var(--ss-light-grey)', padding: '4px 10px', borderRadius: '4px' }}>{product.gender?.toUpperCase()}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffc107' }}>
              <Star size={14} fill="#ffc107" />
              <span style={{ fontSize: '13px', fontWeight: '900', color: '#111' }}>4.8</span>
              <span style={{ fontSize: '11px', color: '#666' }}>({product.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '15px' }}>{product.name.toUpperCase()}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <p style={{ fontSize: '28px', fontWeight: '900', color: '#e11b23' }}>{formatPrice(product.price)}</p>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#999', textDecoration: 'line-through' }}>{formatPrice(getOriginalPrice(product.price))}</p>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px' }}>{product.description}</p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '900', marginBottom: '10px' }}>SIZE</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} style={{ width: '50px', height: '50px', borderRadius: '8px', border: '2px solid', borderColor: selectedSize === size ? '#111' : '#eee', background: selectedSize === size ? '#111' : 'white', color: selectedSize === size ? 'white' : '#111', fontWeight: '900', cursor: 'pointer' }}>{size}</button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleAddToCart} style={{ width: '100%', padding: '20px', background: isAdded ? '#008080' : '#e11b23', color: 'white', fontWeight: '900', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
            {isAdded ? 'ADDED TO BAG' : 'ADD TO BAG'}
          </button>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section style={{ marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '60px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '950', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageSquare size={24} color="#e11b23" /> CUSTOMER REVIEWS
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px' }} className="reviews-grid">
          {/* Review Form */}
          <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '15px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', marginBottom: '5px' }}>RATING</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} fill={star <= reviewForm.rating ? '#ffc107' : 'none'} color={star <= reviewForm.rating ? '#ffc107' : '#ccc'} style={{ cursor: 'pointer' }} onClick={() => setReviewForm({ ...reviewForm, rating: star })} />
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', marginBottom: '5px' }}>YOUR COMMENT</label>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '100px' }} required placeholder="What do you think about this product?" />
              </div>
              <button type="submit" disabled={isSubmittingReview} style={{ width: '100%', padding: '15px', background: '#111', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '900', cursor: 'pointer' }}>
                {isSubmittingReview ? 'SUBMITTING...' : 'POST REVIEW'}
              </button>
            </form>
          </div>

          {/* Review List */}
          <div>
            {product.reviews?.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews yet. Be the first to review!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {product.reviews?.map(r => (
                  <div key={r.id} style={{ borderBottom: '1px solid #eee', pb: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '900', fontSize: '15px' }}>{r.username}</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? '#ffc107' : 'none'} color={i < r.rating ? '#ffc107' : '#ccc'} />)}
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.5' }}>{r.comment}</p>
                    <p style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section style={{ marginTop: '80px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '950', marginBottom: '30px' }}>YOU MAY ALSO LIKE</h2>
        <div className="product-grid">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} onWishlistToggle={toggleWishlist} isWishlisted={isInWishlist(p.id)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
