"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function Header() {
  const { state } = useCart()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Store
          </Link>

          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-gray-800 transition-colors">
              Shop
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-800 transition-colors">
              Contact
            </Link>
            <Link href="/cart" className="relative text-gray-600 hover:text-gray-800 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
