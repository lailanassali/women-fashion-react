import { renderHook, act } from '@testing-library/react'
import { useProductFilter } from '../useProductFilter'
import type { Product } from '../types'

jest.useFakeTimers()

const products: Product[] = [
  { id: 1, title: 'Red Dress', price: 80, category: "women's clothing", description: '', image: '', rating: { rate: 4.8, count: 10 } },
  { id: 2, title: 'Blue Blouse', price: 30, category: "women's clothing", description: '', image: '', rating: { rate: 3.2, count: 5 } },
  { id: 3, title: 'Green Skirt', price: 55, category: "women's clothing", description: '', image: '', rating: { rate: 4.1, count: 8 } },
]

describe('useProductFilter', () => {
  it('returns all products by default', () => {
    const { result } = renderHook(() => useProductFilter(products))
    act(() => jest.runAllTimers())
    expect(result.current.filtered).toHaveLength(3)
  })

  it('filters by debounced search term', () => {
    const { result } = renderHook(() => useProductFilter(products))
    act(() => result.current.setSearch('dress'))
    expect(result.current.filtered).toHaveLength(3) // not yet debounced
    act(() => jest.advanceTimersByTime(300))
    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].title).toBe('Red Dress')
  })

  it('sorts by price ascending', () => {
    const { result } = renderHook(() => useProductFilter(products))
    act(() => result.current.setSort('price-asc'))
    const prices = result.current.filtered.map(p => p.price)
    expect(prices).toEqual([30, 55, 80])
  })

  it('sorts by price descending', () => {
    const { result } = renderHook(() => useProductFilter(products))
    act(() => result.current.setSort('price-desc'))
    const prices = result.current.filtered.map(p => p.price)
    expect(prices).toEqual([80, 55, 30])
  })

  it('sorts by rating descending', () => {
    const { result } = renderHook(() => useProductFilter(products))
    act(() => result.current.setSort('rating-desc'))
    const ratings = result.current.filtered.map(p => p.rating.rate)
    expect(ratings).toEqual([4.8, 4.1, 3.2])
  })

  it('derives unique categories', () => {
    const { result } = renderHook(() => useProductFilter(products))
    expect(result.current.categories).toEqual(["women's clothing"])
  })
})
