import { type NextRequest, NextResponse } from "next/server"
import { setupSheetHeaders, getAllOrders, updateOrderStatus } from "@/lib/google-sheets"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    switch (action) {
      case "setup":
        const setupResult = await setupSheetHeaders()
        return NextResponse.json(setupResult)

      case "orders":
        const ordersResult = await getAllOrders()
        return NextResponse.json(ordersResult)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Google Sheets API error:", error)
    return NextResponse.json({ error: "Failed to process Google Sheets request" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, orderId, status } = await request.json()

    if (action === "updateStatus") {
      if (!orderId || !status) {
        return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 })
      }

      const result = await updateOrderStatus(orderId, status)
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Google Sheets API error:", error)
    return NextResponse.json({ error: "Failed to process Google Sheets request" }, { status: 500 })
  }
}
