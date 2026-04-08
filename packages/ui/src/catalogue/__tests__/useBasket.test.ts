import { renderHook, act } from '@testing-library/react'
import { useBasket } from '../useBasket'
import type { Product } from '../types'

const mockProduct: Product = {
  id: 1,
  title: 'Test Dress',
  price: 49.99,
  category: "women's clothing",
  description: 'A lovely dress',
  image: 'https://example.com/dress.png',
  rating: { rate: 4.5, count: 80 },
}

const anotherProduct: Product = { ...mockProduct, id: 2, title: 'Test Blouse', price: 29.99 }

beforeEach(() => localStorage.clear())

describe('useBasket', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useBasket())
    expect(result.current.items).toEqual([])
    expect(result.current.totalCount).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('adds an item', () => {
    const { result } = renderHook(() => useBasket())
    act(() => result.current.addItem(mockProduct))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(1)
    expect(result.current.totalCount).toBe(1)
  })

  it('increments quantity when adding the same item twice', () => {
    const { result } = renderHook(() => useBasket())
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.addItem(mockProduct))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('removes an item', () => {
    const { result } = renderHook(() => useBasket())
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.removeItem(mockProduct.id))
    expect(result.current.items).toHaveLength(0)
  })

  it('updates quantity', () => {
    const { result } = renderHook(() => useBasket())
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.updateQuantity(mockProduct.id, 5))
    expect(result.current.items[0].quantity).toBe(5)
  })

  it('calculates totalPrice correctly', () => {
    const { result } = renderHook(() => useBasket())
    act(() => result.current.addItem(mockProduct))
    act(() => result.current.addItem(anotherProduct))
    expect(result.current.totalPrice).toBeCloseTo(79.98)
  })

  it('persists to and rehydrates from localStorage', () => {
    const { result: first } = renderHook(() => useBasket())
    act(() => first.current.addItem(mockProduct))

    const { result: second } = renderHook(() => useBasket())
    expect(second.current.items).toHaveLength(1)
    expect(second.current.items[0].product.id).toBe(mockProduct.id)
  })
})
