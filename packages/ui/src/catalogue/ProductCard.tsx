'use client'

import type { Product } from './types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
  return (
    <article className="product-card">
      <img className="product-image" src={product.image} alt={product.title} />
      <div className="product-card-body">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-category">{product.category}</p>
      </div>
    </article>
  )
}
