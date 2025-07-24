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
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Bank Transfer Instructions</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      <strong>Bank:</strong> Your Bank Name
                    </p>
                    <p>
                      <strong>Account Name:</strong> KurdMods Store
                    </p>
                    <p>
                      <strong>Account Number:</strong> 1234567890
                    </p>
                    <p>
                      <strong>Reference:</strong> Please use your order ID as reference
                    </p>
                  </div>
                </div>

                {/* QR Code Section - Using regular img tag instead of Next.js Image */}
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <h3 className="font-semibold text-green-800 mb-4 text-center">Scan QR Code to Pay</h3>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-green-100">
                      <img
                        src="/QR.png"
                        alt="Payment QR Code"
                        width="200"
                        height="200"
                        className="rounded-lg"
                        onError={(e) => {
                          console.log("QR image failed to load from /QR.png")
                          const img = e.target as HTMLImageElement
                          // Try different variations
                          if (img.src.includes("/QR.png")) {
                            console.log("Trying /qr.png")
                            img.src = "/qr.png"
                          } else if (img.src.includes("/qr.png")) {
                            console.log("Trying /QR.jpg")
                            img.src = "/QR.jpg"
                          } else if (img.src.includes("/QR.jpg")) {
                            console.log("Trying /qr.jpg")
                            img.src = "/qr.jpg"
                          } else {
                            console.log("All attempts failed, hiding image")
                            img.style.display = "none"
                            // Show error message
                            const errorDiv = document.createElement("div")
                            errorDiv.innerHTML = `
              <div class="text-center p-4 bg-red-50 border border-red-200 rounded">
                <p class="text-red-700 font-semibold">QR Code temporarily unavailable</p>
                <p class="text-red-600 text-sm">Please use bank transfer details above</p>
              </div>
            `
                            img.parentNode?.appendChild(errorDiv)
                          }
                        }}
                        onLoad={() => console.log("QR image loaded successfully")}
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-green-700 text-center mb-2">
                    <strong>Scan this QR code with your mobile wallet to complete payment</strong>
                  </p>
                  <div className="text-xs text-green-600 text-center space-y-1">
                    <p>
                      <strong>Amount:</strong> ${state.total.toFixed(2)}
                    </p>
                    <p>
                      <strong>Reference:</strong> Use your order ID when it's generated
                    </p>
                  </div>

                  {/* Fallback text if image doesn't load */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                    <p className="text-sm text-yellow-800">
                      <strong>If QR code doesn't appear:</strong>
                      <br />
                      Please use the bank transfer details above or contact us for payment assistance.
                    </p>
                  </div>
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
