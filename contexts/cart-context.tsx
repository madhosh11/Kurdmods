"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { CartItem } from "@/lib/types"

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.selectedType === action.payload.selectedType &&
          item.selectedOption === action.payload.selectedOption &&
          item.selectedField === action.payload.selectedField,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        }
      }

      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter((item) => item.product.id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
