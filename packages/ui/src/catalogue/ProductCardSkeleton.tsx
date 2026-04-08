'use client'

export function ProductCardSkeleton(): React.JSX.Element {
  return (
    <div className="product-card product-card-skeleton" aria-hidden="true">
      <div className="product-image-wrap">
        <div className="skeleton skeleton-image" />
      </div>
      <div className="product-card-body">
        <div className="skeleton skeleton-text skeleton-text-short" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text skeleton-text-medium" />
        <div className="product-footer">
          <div className="skeleton skeleton-text skeleton-text-short" />
          <div className="skeleton skeleton-text skeleton-text-short" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }): React.JSX.Element {
  return (
    <div className="product-grid" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
