"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitBankTransferOrder } from "@/app/actions/order"
import type { CustomerDetails } from "@/lib/types"

export default function PaymentPage() {
  const { state, dispatch } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<"gateway" | "form" | null>(null)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    surname: "",
    address: "",
    phoneNumber: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        customerDetails,
        cartItems: state.items,
        total: state.total,
      }

      const result = await submitBankTransferOrder(orderData)

      if (result.success) {
        alert(`${result.message}\nOrder ID: ${result.orderId}`)
        // Clear cart after successful submission
        dispatch({ type: "CLEAR_CART" })
        // Optionally redirect to a success page
        // router.push('/order-success')
      } else {
        alert(result.error || "There was an error submitting your order. Please try again.")
      }
    } catch (error) {
      console.error("Order submission error:", error)
      alert("There was an error submitting your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentGateway = () => {
    // This will be implemented when you provide the payment gateway details
    alert("Payment gateway integration will be added here")
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Items to Pay For</h1>
          <p className="text-gray-600 mb-8">Your cart is empty.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {state.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>${state.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>

          {!paymentMethod && (
            <div className="space-y-4">
              <Button onClick={() => setPaymentMethod("gateway")} className="w-full" size="lg">
                Pay with Payment Gateway
              </Button>
              <Button onClick={() => setPaymentMethod("form")} variant="outline" className="w-full" size="lg">
                Pay with Bank Transfer
              </Button>
            </div>
          )}

          {paymentMethod === "gateway" && (
            <div className="space-y-4">
              <p className="text-gray-600">You will be redirected to our secure payment gateway.</p>
              <Button onClick={handlePaymentGateway} className="w-full" size="lg">
                Continue to Payment Gateway
              </Button>
              <Button onClick={() => setPaymentMethod(null)} variant="outline" className="w-full">
                Back to Payment Options
              </Button>
            </div>
          )}

          {paymentMethod === "form" && (
            <div className="space-y-4">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="surname">Surname *</Label>
                    <Input
                      id="surname"
                      value={customerDetails.surname}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, surname: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerDetails.phoneNumber}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, phoneNumber: e.target.value })}
                    required
                  />
                </div>

                {/* Bank Transfer Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Bank Transfer Instructions</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      <strong>Bank:</strong> Your Bank Name
                    </p>
                    <p>
                      <strong>Account Name:</strong> Your Store Name
                    </p>
                    <p>
                      <strong>Account Number:</strong> 1234567890
                    </p>
                    <p>
                      <strong>Reference:</strong> Please use your order ID as reference
                    </p>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-600 mb-2">QR Code for Payment</p>
                  <div className="w-32 h-32 bg-gray-200 mx-auto flex items-center justify-center">
                    <span className="text-gray-500">QR Code Here</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Scan this QR code to complete your payment</p>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1" size="lg">
                    {isSubmitting ? "Submitting..." : "Submit Order"}
                  </Button>
                  <Button type="button" onClick={() => setPaymentMethod(null)} variant="outline" className="flex-1">
                    Back
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
