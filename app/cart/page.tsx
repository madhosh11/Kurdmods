"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CartPage() {
  const { state, dispatch } = useCart()

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <Image
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">Type: {item.selectedType}</p>
                  <p className="text-sm text-gray-600">Option: {item.selectedOption}</p>
                  <p className="text-sm text-gray-600">Field: {item.selectedField}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <Button variant="outline" size="sm" onClick={() => removeItem(item.product.id)} className="mt-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${state.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Link href="/payment">
            <Button className="w-full" size="lg">
              Proceed to Payment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
