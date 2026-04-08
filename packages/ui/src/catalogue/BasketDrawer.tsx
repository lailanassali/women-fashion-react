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
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="basket-overlay" onClick={onClose}>
      <aside className="basket-drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping basket">

        <div className="basket-header">
          <div>
            <h2 className="basket-title">Your Basket</h2>
            {totalCount > 0 && (
              <p className="basket-count">{totalCount} {totalCount === 1 ? 'item' : 'items'}</p>
            )}
          </div>
          <button className="basket-close" onClick={onClose} aria-label="Close basket">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="basket-empty">
            <p className="basket-empty-icon">🛍</p>
            <p className="basket-empty-title">Your basket is empty</p>
            <p className="basket-empty-body">Add items from the catalogue to get started.</p>
          </div>
        ) : (
          <>
            <ul className="basket-list">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="basket-item">
                  <div className="basket-item-image-wrap">
                    <img className="basket-item-image" src={product.image} alt={product.title} loading="lazy" />
                  </div>
                  <div className="basket-item-info">
                    <p className="basket-item-title">{product.title}</p>
                    <p className="basket-item-unit-price">£{product.price.toFixed(2)} each</p>
                    <div className="basket-item-row">
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
                      <p className="basket-item-subtotal">£{(product.price * quantity).toFixed(2)}</p>
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
              <div className="basket-summary">
                <div className="basket-summary-row">
                  <span>Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'})</span>
                  <span>£{totalPrice.toFixed(2)}</span>
                </div>
                <div className="basket-summary-row basket-summary-shipping">
                  <span>Shipping</span>
                  <span className="basket-free">Free</span>
                </div>
              </div>
              <div className="basket-total">
                <span>Total</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
