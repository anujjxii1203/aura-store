import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { FALLBACK_IMAGE, formatPrice, getOriginalPrice } from '../utils/formatters';

const ProductCard = ({
  product,
  isWishlisted = false,
  onAddToCart,
  onWishlistToggle,
  onRemove,
  actionLabel = 'ADD TO BAG',
}) => {
  const handleImageError = (event) => {
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  const handleAction = () => {
    onAddToCart?.(product);
  };

  const [isPopping, setIsPopping] = useState(false);

  const handleWishlistClick = (event) => {
    event.preventDefault();

    if (onRemove) {
      onRemove(product.id);
      return;
    }

    if (!isWishlisted) {
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 400);
    }
    
    onWishlistToggle?.(product);
  };

  return (
    <article className="product-card">
      {(onWishlistToggle || onRemove) && (
        <button
          type="button"
          className={`product-card-icon-button wishlist-btn ${isPopping ? 'popped' : ''}`}
          onClick={handleWishlistClick}
          aria-label={onRemove ? `Remove ${product.name} from wishlist` : `Toggle ${product.name} in wishlist`}
        >
          {onRemove ? (
            <Trash2 size={17} color="#e11b23" />
          ) : (
            <Heart
              size={18}
              fill={isWishlisted ? '#e11b23' : 'none'}
              color={isWishlisted ? '#e11b23' : '#555'}
            />
          )}
        </button>
      )}

      <Link to={`/product/${product.id}`} className="product-card-media" aria-label={`View ${product.name}`}>
        <div className="p-img-box">
          <img src={product.image || FALLBACK_IMAGE} alt={product.name} onError={handleImageError} loading="lazy" />
          <span className="p-badge">{product.category.toUpperCase()}</span>
        </div>
      </Link>

      <div className="p-details">
        <p className="p-brand">AURA STORE</p>
        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3 className="p-type">{product.name}</h3>
        </Link>
        <div className="p-price-row">
          <span className="p-price">{formatPrice(product.price)}</span>
          <span className="p-old-price">{formatPrice(getOriginalPrice(product.price))}</span>
          <span className="p-off">30% OFF</span>
        </div>
        <button type="button" className="btn-red product-action-button" onClick={handleAction}>
          <ShoppingBag size={16} /> {actionLabel}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
