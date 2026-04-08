'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ProductGrid, PaginationControls, type Product } from '@repo/ui/catalogue'

const PRODUCTS_PER_PAGE = 8
const queryClient = new QueryClient()

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`https://fakestoreapi.com/products/category/women's%20clothing`)
  if (!response.ok) {
    throw new Error('Failed to load products')
  }

  return response.json()
}

function ProductCatalogueContent(): React.JSX.Element {
  const [page, setPage] = useState(1)

  const { data: products, isLoading, error, isFetching } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  const allProducts = products ?? []
  const totalPages = Math.max(1, Math.ceil(allProducts.length / PRODUCTS_PER_PAGE))
  const pageProducts = allProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)

  useEffect(() => {
    if (page > totalPages) {
      setPage(1)
    }
  }, [page, totalPages])

  return (
    <section className="product-page">
      <div className="catalogue-header">
        <div>
          <h1 className="title">Women's Catalogue</h1>
          <p className="description">
            Browse beauty, fashion and selected essentials with clean pagination and fast loading.
          </p>
        </div>
        <div className="status-line">{isFetching && !isLoading ? 'Refreshing products…' : ''}</div>
      </div>

      {isLoading ? (
        <div className="message">Loading products...</div>
      ) : error ? (
        <div className="message error">Unable to load products. Please try again later.</div>
      ) : (
        <>
          <ProductGrid products={pageProducts} />
          <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
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
