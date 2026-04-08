'use client'

import type { SortOption } from './useProductFilter'

interface FilterBarProps {
  search: string
  category: string
  sort: SortOption
  categories: string[]
  resultCount: number
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortChange: (value: SortOption) => void
}

export function FilterBar({
  search,
  category,
  sort,
  categories,
  resultCount,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: FilterBarProps): React.JSX.Element {
  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-search-wrap">
          <span className="filter-search-icon">&#x2315;</span>
          <input
            className="filter-search"
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="filter-selects">
          <select
            className="filter-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            aria-label="Sort products"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>
      </div>
      <p className="filter-count">{resultCount} {resultCount === 1 ? 'product' : 'products'}</p>
    </div>
  )
}
