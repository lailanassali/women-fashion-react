'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import {
  ProductGrid,
  PaginationControls,
  ProductModal,
  BasketDrawer,
  FilterBar,
  useBasket,
  useProductFilter,
  type Product,
} from '@repo/ui/catalogue'

const PRODUCTS_PER_PAGE = 8
const queryClient = new QueryClient()

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`https://fakestoreapi.com/products/category/women's%20clothing`)
  if (!response.ok) throw new Error('Failed to load products')
  return response.json()
}

function ProductCatalogueContent(): React.JSX.Element {
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [basketOpen, setBasketOpen] = useState(false)
  const { items, addItem, removeItem, updateQuantity, totalCount, totalPrice } = useBasket()

  const { data: products, isLoading, error, isFetching } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  const { filters, filtered, categories, setSearch, setCategory, setSort } = useProductFilter(products ?? [])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE))
  const pageProducts = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)

  useEffect(() => {
    setPage(1)
  }, [filters.search, filters.category, filters.sort])

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

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
          <button className="basket-btn" onClick={() => setBasketOpen(true)}>
            Basket
            {totalCount > 0 && <span className="basket-badge">{totalCount}</span>}
          </button>
        </div>
      </header>

      <div className="page-intro">
        <h1 className="title">New Collection</h1>
        <p className="description">Discover the latest arrivals in women's fashion.</p>
      </div>

      {isLoading ? (
        <div className="message">Loading products...</div>
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
          <ProductGrid products={pageProducts} onProductClick={setSelectedProduct} />
          <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
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

export function ProductCatalogueClient(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductCatalogueContent />
    </QueryClientProvider>
  )
}
