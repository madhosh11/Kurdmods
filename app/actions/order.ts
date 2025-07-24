"use server"

import { addOrderToSheet } from "@/lib/google-sheets"
import type { CustomerDetails } from "@/lib/types"

interface OrderData {
  customerDetails: CustomerDetails
  cartItems: Array<{
    product: {
      id: string
      name: string
      price: number
    }
    selectedType: string
    selectedOption: string
    selectedField: string
    quantity: number
  }>
  total: number
}

export async function submitBankTransferOrder(orderData: OrderData) {
  try {
    // Generate order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Prepare data with order ID and date
    const completeOrderData = {
      ...orderData,
      orderDate: new Date().toISOString(),
      orderId,
    }

    console.log("🚀 Processing order submission...")
    console.log("📊 Adding to Google Sheets...")

    // Add to Google Sheets
    const sheetsResult = await addOrderToSheet(completeOrderData)

    if (!sheetsResult.success) {
      console.error("❌ Google Sheets failed:", sheetsResult.error)
      throw new Error(`Failed to save order: ${sheetsResult.error}`)
    }

    console.log("✅ Order processing completed successfully")

    return {
      success: true,
      orderId,
      message:
        "Order submitted successfully! Your order has been saved and you will be contacted once payment is confirmed.",
      sheetsUpdated: sheetsResult.success,
      details: {
        sheets: `Added ${sheetsResult.rowsAdded} rows to Google Sheets`,
        rowsAdded: sheetsResult.rowsAdded,
      },
    }
  } catch (error) {
    console.error("❌ Order submission failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit order. Please try again.",
    }
  }
}
