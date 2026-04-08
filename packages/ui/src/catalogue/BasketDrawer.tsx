'use client'

import type { BasketItem } from './types'

interface BasketDrawerProps {
  items: BasketItem[]
  totalPrice: number
  onClose: () => void
  onRemoveItem: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
}

export function BasketDrawer({ items, totalPrice, onClose, onRemoveItem, onUpdateQuantity }: BasketDrawerProps): React.JSX.Element {
  return (
    <div className="basket-overlay" onClick={onClose}>
      <aside className="basket-drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping basket">
        <div className="basket-header">
          <h2 className="basket-title">Your Basket</h2>
          <button className="basket-close" onClick={onClose} aria-label="Close basket">✕</button>
        </div>

        {items.length === 0 ? (
          <p className="basket-empty">Your basket is empty.</p>
        ) : (
          <>
            <ul className="basket-list">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="basket-item">
                  <img className="basket-item-image" src={product.image} alt={product.title} loading="lazy" />
                  <div className="basket-item-info">
                    <p className="basket-item-title">{product.title}</p>
                    <p className="basket-item-subtotal">£{(product.price * quantity).toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="quantity-value">{quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="basket-item-remove"
                    onClick={() => onRemoveItem(product.id)}
                    aria-label={`Remove ${product.title}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="basket-footer">
              <div className="basket-total">
                <span>Total</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
