import { useState, useCallback, useEffect } from 'react'
import type { BasketItem, Product } from './types'

const STORAGE_KEY = 'women-fashion-basket'

function loadFromStorage(): BasketItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BasketItem[]) : []
  } catch {
    return []
  }
}

function saveToStorage(items: BasketItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage unavailable — silently ignore
  }
}

export function useBasket() {
  const [items, setItems] = useState<BasketItem[]>(() => loadFromStorage())

  useEffect(() => {
    saveToStorage(items)
  }, [items])

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }, [])

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return { items, addItem, removeItem, updateQuantity, totalCount, totalPrice }
}
