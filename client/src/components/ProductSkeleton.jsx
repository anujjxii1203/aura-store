import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="product-card" style={{ cursor: 'default' }}>
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      <div className="skeleton skeleton-price" style={{ marginTop: '10px' }} />
    </div>
  );
};

export default ProductSkeleton;
