'use client'

import type { Product } from './types'

interface ProductCardProps {
  product: Product
  onProductClick: (product: Product) => void
}

export function ProductCard({ product, onProductClick }: ProductCardProps): React.JSX.Element {
  return (
    <article className="product-card" onClick={() => onProductClick(product)}>
      <div className="product-image-wrap">
        <img className="product-image" src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h2 className="product-title">{product.title}</h2>
        <div className="product-footer">
          <p className="product-price">£{product.price.toFixed(2)}</p>
          <div className="product-rating">
            <span className="rating-star">★</span>
            <span className="rating-num">{product.rating.rate}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
