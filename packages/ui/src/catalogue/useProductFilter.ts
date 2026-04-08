import { useState, useMemo } from 'react'
import type { Product } from './types'

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc'

export interface FilterState {
  search: string
  category: string
  sort: SortOption
}

export function useProductFilter(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    sort: 'default',
  })

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category))).sort(),
    [products]
  )

  const filtered = useMemo(() => {
    let result = products

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q))
    }

    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }

    switch (filters.sort) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price)
      case 'rating-desc':
        return [...result].sort((a, b) => b.rating.rate - a.rating.rate)
      default:
        return result
    }
  }, [products, filters])

  const setSearch = (search: string) => setFilters(prev => ({ ...prev, search }))
  const setCategory = (category: string) => setFilters(prev => ({ ...prev, category }))
  const setSort = (sort: SortOption) => setFilters(prev => ({ ...prev, sort }))

  return { filters, filtered, categories, setSearch, setCategory, setSort }
}
