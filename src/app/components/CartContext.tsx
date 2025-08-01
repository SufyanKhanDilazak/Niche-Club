"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem } from "./Interface"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void
  cartQuantity: number
  shouldGlow: boolean
  clearCart: () => void
  // Add the missing properties
  subtotal: number
  tax: number
  shipping: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [shouldGlow, setShouldGlow] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const addToCart = (product: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor,
      )

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item,
        )
      }
      return [...prevItems, { ...product }]
    })
    setShouldGlow(true)
    setTimeout(() => setShouldGlow(false), 500)
  }

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find(
        (item) => item._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor,
      )
      if (itemToUpdate && itemToUpdate.quantity > 1) {
        return prevItems.map((item) =>
          item._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
      }
      return prevItems.filter(
        (item) =>
          !(item._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor),
      )
    })
  }

  const clearCart = () => {
    setCartItems([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartItems")
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        cartQuantity,
        shouldGlow,
        clearCart,
        subtotal,
        tax,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
