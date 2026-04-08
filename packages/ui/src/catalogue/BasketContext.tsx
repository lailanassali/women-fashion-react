'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useBasket } from './useBasket'
import type { BasketItem, Product } from './types'

interface BasketContextValue {
  items: BasketItem[]
  totalCount: number
  totalPrice: number
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
}

const BasketContext = createContext<BasketContextValue | null>(null)

export function BasketProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const basket = useBasket()
  return <BasketContext.Provider value={basket}>{children}</BasketContext.Provider>
}

export function useBasketContext(): BasketContextValue {
  const ctx = useContext(BasketContext)
  if (!ctx) throw new Error('useBasketContext must be used inside <BasketProvider>')
  return ctx
}
