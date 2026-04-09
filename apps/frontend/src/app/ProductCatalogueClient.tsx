'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import {
  ProductGrid,
  ProductGridSkeleton,
  PaginationControls,
  ProductModal,
  BasketDrawer,
  FilterBar,
  BasketProvider,
  useBasketContext,
  useProductFilter,
  type Product,
} from '@repo/ui/catalogue'

// ---- Server state ----
const queryClient = new QueryClient()

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, title: 'Floral Wrap Dress', price: 52.99, category: "women's clothing", description: 'A light and airy wrap dress with a floral print, perfect for any occasion.', image: 'https://fakestoreapi.com/img/81fAn9bZXkL._AC_UX679_.jpg', rating: { rate: 4.5, count: 120 } },
  { id: 2, title: 'Classic Trench Coat', price: 129.99, category: "women's clothing", description: 'A timeless trench coat in a neutral tone, tailored for a modern silhouette.', image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', rating: { rate: 4.7, count: 89 } },
  { id: 3, title: 'Slim Fit Blazer', price: 89.99, category: "women's clothing", description: 'Sharp and structured blazer, ideal for office wear or smart-casual looks.', image: 'https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg', rating: { rate: 4.3, count: 65 } },
  { id: 4, title: 'Ribbed Knit Jumper', price: 44.99, category: "women's clothing", description: 'Soft ribbed knit jumper in a relaxed fit, great for layering in cooler months.', image: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg', rating: { rate: 4.1, count: 200 } },
  { id: 5, title: 'High Waist Wide Leg Trousers', price: 67.50, category: "women's clothing", description: 'Elegant wide leg trousers with a high waist cut for a flattering, elongated look.', image: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg', rating: { rate: 4.6, count: 45 } },
  { id: 6, title: 'Satin Slip Skirt', price: 38.00, category: "women's clothing", description: 'Luxurious satin slip skirt with a fluid drape, available in midi length.', image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_FMwebp_QL65_.jpg', rating: { rate: 4.2, count: 77 } },
  { id: 7, title: 'Linen Shirt Dress', price: 59.99, category: "women's clothing", description: 'Breathable linen shirt dress with button-down front, perfect for warm days.', image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg', rating: { rate: 4.4, count: 133 } },
  { id: 8, title: 'Cashmere Blend Cardigan', price: 95.00, category: "women's clothing", description: 'Soft cashmere blend cardigan with a relaxed, oversized fit for effortless comfort.', image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', rating: { rate: 4.8, count: 58 } },
]

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/category/women%27s%20clothing`)
    if (!response.ok) throw new Error('API unavailable')
    return response.json()
  } catch {
    return FALLBACK_PRODUCTS
  }
}

const PRODUCTS_PER_PAGE = 8

// ---- Basket button (lives inside the header) ----
function BasketButton({ onClick }: { onClick: () => void }): React.JSX.Element {
  const { totalCount } = useBasketContext()
  return (
    <button className="basket-btn" onClick={onClick}>
      Basket
      {totalCount > 0 && <span className="basket-badge">{totalCount}</span>}
    </button>
  )
}

// ---- Empty state ----
function EmptyState({ hasFilters }: { hasFilters: boolean }): React.JSX.Element {
  return (
    <div className="empty-state">
      <p className="empty-state-icon">🔍</p>
      <p className="empty-state-title">No products found</p>
      <p className="empty-state-body">
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'No products are available right now.'}
      </p>
    </div>
  )
}

// ---- Product catalogue ----
function ProductCatalogueContent(): React.JSX.Element {
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [basketOpen, setBasketOpen] = useState(false)
  const { items, addItem, removeItem, updateQuantity, totalPrice } = useBasketContext()

  // Server state — React Query owns caching, loading, error
  const { data: products, isLoading, error, isFetching } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  // Client state — filter/sort derived from server data
  const { filters, filtered, categories, setSearch, setCategory, setSort } = useProductFilter(products ?? [])

  const hasActiveFilters = !!(filters.search || filters.category || filters.sort !== 'default')
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE))
  const pageProducts = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)

  useEffect(() => { setPage(1) }, [filters.search, filters.category, filters.sort])
  useEffect(() => { if (page > totalPages) setPage(1) }, [page, totalPages])

  function handleAddToBasket(product: Product) {
    addItem(product)
    setSelectedProduct(null)
  }

  return (
    <section className="product-page">
      <header className="site-header">
        <span className="brand">Women's Fashion</span>
        <div className="header-actions">
          {isFetching && !isLoading && <span className="status-line">Refreshing…</span>}
          <BasketButton onClick={() => setBasketOpen(true)} />
        </div>
      </header>

      <div className="page-intro">
        <h1 className="title">New Collection</h1>
        <p className="description">Discover the latest arrivals in women's fashion.</p>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={PRODUCTS_PER_PAGE} />
      ) : error ? (
        <div className="message error">Unable to load products. Please try again later.</div>
      ) : (
        <>
          <FilterBar
            search={filters.search}
            category={filters.category}
            sort={filters.sort}
            categories={categories}
            resultCount={filtered.length}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onSortChange={setSort}
          />
          {filtered.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} />
          ) : (
            <>
              <ProductGrid products={pageProducts} onProductClick={setSelectedProduct} />
              <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToBasket={handleAddToBasket}
        />
      )}

      {basketOpen && (
        <BasketDrawer
          items={items}
          totalPrice={totalPrice}
          onClose={() => setBasketOpen(false)}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </section>
  )
}

// ---- Root: providers declare state boundaries ----
export function ProductCatalogueClient(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>  {/* server state */}
      <BasketProvider>                          {/* client state */}
        <ProductCatalogueContent />
      </BasketProvider>
    </QueryClientProvider>
  )
}
