"use client"

import { useState, useCallback } from "react"
import type { CartItem } from "../types/cart"

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id)
        return
      }
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cartItems])

  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }
}
