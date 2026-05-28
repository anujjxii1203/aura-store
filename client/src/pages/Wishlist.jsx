import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import BackButton from '../components/BackButton';
import ProductCard from '../components/ProductCard';
import PageTitle from '../components/PageTitle';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToBag = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    removeFromWishlist(product.id);
    showToast(`${product.name} moved to bag!`, "success");
  };

  if (wishlist.length === 0) {
    return (
      <div className="container empty-page">
        <PageTitle title="Empty Wishlist" />
        <BackButton />
        <div className="state-panel">
          <Heart size={72} strokeWidth={1.2} />
          <h2>Your Wishlist is Empty</h2>
          <p>Save pieces you love and move them to your bag when you are ready.</p>
          <Link to="/" className="btn-red state-action">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <PageTitle title="My Wishlist" />
      <BackButton />
      <div className="page-title-row">
        <h1>My Wishlist ({wishlist.length})</h1>
        <Link to="/" className="text-link">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>

      <div className="product-grid">
        {wishlist.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleMoveToBag}
            onRemove={removeFromWishlist}
            actionLabel="MOVE TO BAG"
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
