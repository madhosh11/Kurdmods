import { type NextRequest, NextResponse } from "next/server"
import { sendOrderEmail, sendCustomerConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { type, data, customerEmail } = await request.json()

    if (type === "order") {
      const result = await sendOrderEmail(data)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      // Optionally send confirmation to customer
      if (customerEmail) {
        await sendCustomerConfirmationEmail(data, customerEmail)
      }

      return NextResponse.json({
        success: true,
        message: "Order email sent successfully",
        messageId: result.messageId,
      })
    }

    return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
