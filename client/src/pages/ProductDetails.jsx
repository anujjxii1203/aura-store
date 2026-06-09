import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Check, ShieldCheck, Truck, Plus, Minus, Share2, Ruler, X, Star, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
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

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

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
      const relatedRes = await api.get(`/products?category=${data.category}&gender=${data.gender}`);
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

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="pdp-container">
      <PageTitle title={product.name} />
      
      <div className="breadcrumbs" style={{ marginBottom: '20px' }}>
        <Link to="/">HOME</Link>
        <span>/</span>
        <Link to={`/?gender=${product.gender || 'Men'}`}>{product.gender ? product.gender.toUpperCase() : 'UNISEX'}</Link>
        <span>/</span>
        <Link to={`/?gender=${product.gender || 'Men'}&category=${product.category}`}>{product.category ? product.category.toUpperCase() : 'APPAREL'}</Link>
        <span>/</span>
        <span>{product.name.toUpperCase()}</span>
      </div>

      <div className="pdp-grid-ss">
        {/* Left Column: Image */}
        <div className="pdp-left">
          <div style={{ borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5' }}>
            <img 
              src={product.image || FALLBACK_IMAGE} 
              alt={product.name} 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
            />
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="pdp-right">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '25px', marginBottom: '25px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px', color: '#111' }}>{product.name}</h1>
            <p style={{ color: '#666', fontSize: '15px', fontWeight: '600', marginBottom: '15px' }}>{product.category}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '26px', fontWeight: '900', color: '#111' }}>{formatPrice(product.price)}</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#999', textDecoration: 'line-through' }}>{formatPrice(getOriginalPrice(product.price))}</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#008080' }}>30% OFF</span>
            </div>
            <div className="pdp-tax-info">Inclusive of all taxes</div>
            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', background: 'rgba(225, 27, 35, 0.1)', color: '#e11b23', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '800' }}>
              <Star size={14} fill="#e11b23" style={{ marginRight: '6px' }} />
              EARN {Math.floor(product.price * 0.1)} AURA POINTS WITH THIS PURCHASE
            </div>
          </div>

          {/* Size Selection */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '800' }}>Please select a size.</span>
              <button style={{ background: 'transparent', border: 'none', color: '#008080', fontWeight: '800', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Ruler size={14} /> Size Guide
              </button>
            </div>
            <div className="size-selector-grid">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <div 
                  key={size} 
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pdp-action-row">
            <button className="btn-ss-primary" onClick={handleAddToCart}>
              {isAdded ? 'ADDED TO BAG' : 'ADD TO BAG'}
            </button>
            <button 
              className="btn-ss-secondary" 
              onClick={() => toggleWishlist(product)}
              style={{ borderColor: isWishlisted ? '#e11b23' : '#eee', color: isWishlisted ? '#e11b23' : '#111' }}
            >
              <Heart size={18} fill={isWishlisted ? '#e11b23' : 'none'} />
              {isWishlisted ? 'WISHLISTED' : 'ADD TO WISHLIST'}
            </button>
          </div>

          {/* Accordions */}
          <div style={{ marginTop: '10px' }}>
            <AccordionItem title="Product Details" defaultOpen={true}>
              <p style={{ marginBottom: '15px' }}>{product.description}</p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Material:</strong> 100% Premium Cotton</li>
                <li><strong>Fit:</strong> Relaxed Comfort Fit</li>
                <li><strong>Wash Care:</strong> Machine wash. Wash in cold water, use mild detergent, dry in shade.</li>
                <li><strong>Note:</strong> Colors may slightly vary depending on your screen brightness.</li>
              </ul>
            </AccordionItem>
            
            <AccordionItem title="Delivery & Returns">
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Pay on delivery is available</li>
                <li>Easy 15 days return and exchange. Return Policies may vary based on products and promotions.</li>
                <li>Estimated delivery time: 3-5 working days.</li>
              </ul>
            </AccordionItem>

            <AccordionItem title={`Customer Reviews (${product.reviews?.length || 0})`}>
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '15px' }}>Write a Review</h4>
                <form onSubmit={handleReviewSubmit}>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={20} fill={star <= reviewForm.rating ? '#ffc107' : 'none'} color={star <= reviewForm.rating ? '#ffc107' : '#ccc'} style={{ cursor: 'pointer' }} onClick={() => setReviewForm({ ...reviewForm, rating: star })} />
                    ))}
                  </div>
                  <textarea 
                    value={reviewForm.comment} 
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} 
                    style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ddd', height: '80px', marginBottom: '10px', fontFamily: 'inherit' }} 
                    required 
                    placeholder="Tell us what you think..." 
                  />
                  <button type="submit" disabled={isSubmittingReview} className="btn-ss-secondary" style={{ width: 'auto', padding: '10px 20px', fontSize: '12px' }}>
                    {isSubmittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                  </button>
                </form>
              </div>

              {product.reviews?.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews yet. Be the first!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {product.reviews?.map(r => (
                    <div key={r.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '800', fontSize: '14px', color: '#111' }}>{r.username}</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? '#ffc107' : 'none'} color={i < r.rating ? '#ffc107' : '#ccc'} />)}
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.5' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '950', marginBottom: '30px', textAlign: 'center' }}>YOU MAY ALSO LIKE</h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} onWishlistToggle={toggleWishlist} isWishlisted={isInWishlist(p.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
