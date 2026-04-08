'use client'

import type { Product } from './types'

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAddToBasket: (product: Product) => void
}

function StarRating({ rate }: { rate: number }): React.JSX.Element {
  return (
    <span className="star-rating">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rate)
        const half = !filled && i < Math.ceil(rate) && rate % 1 >= 0.5
        return (
          <span key={i} className={filled ? 'star star-filled' : half ? 'star star-half' : 'star'}>
            ★
          </span>
        )
      })}
      <span className="rating-value">{rate.toFixed(1)}</span>
    </span>
  )
}

export function ProductModal({ product, onClose, onAddToBasket }: ProductModalProps): React.JSX.Element {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.title}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-content">
          <div className="modal-image-wrap">
            <img className="modal-image" src={product.image} alt={product.title} loading="lazy" />
          </div>
          <div className="modal-details">
            <p className="modal-category">{product.category}</p>
            <h2 className="modal-title">{product.title}</h2>
            <div className="modal-rating">
              <StarRating rate={product.rating.rate} />
              <span className="rating-count">({product.rating.count} reviews)</span>
            </div>
            <p className="modal-price">£{product.price.toFixed(2)}</p>
            <p className="modal-description">{product.description}</p>
            <button className="add-to-basket-btn" onClick={() => onAddToBasket(product)}>
              Add to Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
