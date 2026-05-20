"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type { CartItem } from "./Interface"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void
  cartQuantity: number
  shouldGlow: boolean
  clearCart: () => void
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

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
      setIsInitialized(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
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

  /**
   * ✅ SECURITY CHECK: Prevent out-of-stock items from being added
   * This is a backup validation in case someone tries to:
   * - Manipulate the browser console
   * - Bypass the disabled button in ProductClient
   * - Use browser dev tools to force add items
   */
  const addToCart = (product: CartItem) => {
    // 🛡️ VALIDATION: Check if product is out of stock
    if (product.outOfStock) {
      console.warn('⚠️ Blocked attempt to add out-of-stock item:', product.name);
      toast.error('This item is currently out of stock and cannot be added to cart');
      return; // Stop execution - don't add to cart
    }

    // ✅ Product is in stock - proceed with adding to cart
    setCartItems((prevItems) => {
      // Check if this exact item (same ID, size, color) already exists in cart
      const existingItem = prevItems.find(
        (item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor,
      )

      // If item exists, increase its quantity
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item,
        )
      }
      
      // If item doesn't exist, add it as a new entry
      return [...prevItems, { ...product }]
    })
    
    // Trigger the cart icon glow animation
    setShouldGlow(true)
    setTimeout(() => setShouldGlow(false), 500)
  }

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find(
        (item) => item._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor,
      )
      
      // If quantity > 1, just decrease by 1
      if (itemToUpdate && itemToUpdate.quantity > 1) {
        return prevItems.map((item) =>
          item._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
      }
      
      // If quantity = 1, remove item completely
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