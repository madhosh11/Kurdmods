import nodemailer from "nodemailer"

interface EmailData {
  customerDetails: {
    name: string
    surname: string
    address: string
    phoneNumber: string
  }
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
  orderDate: string
  orderId?: string
}

// Create transporter for GoDaddy SMTP
function createTransporter() {
  // Debug environment variables
  console.log("🔍 Environment variable check:")
  console.log("GODADDY_EMAIL exists:", !!process.env.GODADDY_EMAIL)
  console.log("GODADDY_EMAIL_PASSWORD exists:", !!process.env.GODADDY_EMAIL_PASSWORD)
  console.log(
    "GODADDY_EMAIL value:",
    process.env.GODADDY_EMAIL ? "***@" + process.env.GODADDY_EMAIL.split("@")[1] : "undefined",
  )

  // List all environment variables that start with GODADDY
  console.log(
    "All GODADDY env vars:",
    Object.keys(process.env).filter((key) => key.startsWith("GODADDY")),
  )

  // Validate environment variables
  if (!process.env.GODADDY_EMAIL || !process.env.GODADDY_EMAIL_PASSWORD) {
    const error = `Email configuration missing. 
    GODADDY_EMAIL: ${process.env.GODADDY_EMAIL ? "SET" : "NOT SET"}
    GODADDY_EMAIL_PASSWORD: ${process.env.GODADDY_EMAIL_PASSWORD ? "SET" : "NOT SET"}
    
    Please ensure both environment variables are set in Vercel and the deployment has been redeployed.`

    console.error("❌", error)
    throw new Error(error)
  }

  console.log("Creating email transporter for:", process.env.GODADDY_EMAIL)

  return nodemailer.createTransporter({
    host: "smtpout.secureserver.net", // GoDaddy SMTP server
    port: 465, // SSL port
    secure: true, // Use SSL
    auth: {
      user: process.env.GODADDY_EMAIL,
      pass: process.env.GODADDY_EMAIL_PASSWORD,
    },
    // Additional debugging options
    debug: true,
    logger: true,
  })
}

// Generate HTML email template
function generateEmailHTML(data: EmailData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Received - KurdMods</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f4f4f4; 
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background-color: white; 
          border-radius: 10px; 
          overflow: hidden; 
          box-shadow: 0 0 20px rgba(0,0,0,0.1); 
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .order-info { 
          background-color: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          border-left: 4px solid #667eea; 
        }
        .customer-info { 
          background-color: #e3f2fd; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
        }
        .item { 
          border-bottom: 1px solid #eee; 
          padding: 15px 0; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
        }
        .item:last-child { border-bottom: none; }
        .item-details { flex: 1; }
        .item-price { 
          font-weight: bold; 
          color: #667eea; 
          font-size: 16px; 
        }
        .total-section { 
          background-color: #e8f5e8; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          text-align: center; 
        }
        .total { 
          font-weight: bold; 
          font-size: 24px; 
          color: #2e7d32; 
          margin: 0; 
        }
        .bank-info { 
          background-color: #fff3e0; 
          border: 2px solid #ff9800; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
        }
        .footer { 
          background-color: #f5f5f5; 
          padding: 20px; 
          text-align: center; 
          color: #666; 
        }
        .badge { 
          background-color: #667eea; 
          color: white; 
          padding: 4px 8px; 
          border-radius: 4px; 
          font-size: 12px; 
          font-weight: bold; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 New Order Received!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">KurdMods Store</p>
        </div>

        <div class="content">
          <div class="order-info">
            <h2 style="margin-top: 0; color: #667eea;">📋 Order Information</h2>
            <p><strong>Order ID:</strong> <span class="badge">${data.orderId || "N/A"}</span></p>
            <p><strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> <span style="color: #ff9800; font-weight: bold;">Bank Transfer</span></p>
          </div>

          <div class="customer-info">
            <h2 style="margin-top: 0; color: #1976d2;">👤 Customer Information</h2>
            <p><strong>Name:</strong> ${data.customerDetails.name} ${data.customerDetails.surname}</p>
            <p><strong>Phone:</strong> <a href="tel:${data.customerDetails.phoneNumber}">${data.customerDetails.phoneNumber}</a></p>
            <p><strong>Address:</strong> ${data.customerDetails.address}</p>
          </div>

          <h2 style="color: #667eea;">🛍️ Order Items</h2>
          <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            ${data.cartItems
              .map(
                (item) => `
              <div class="item">
                <div class="item-details">
                  <h4 style="margin: 0 0 8px 0; color: #333;">${item.product.name}</h4>
                  <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Type:</strong> ${item.selectedType}</p>
                  <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Option:</strong> ${item.selectedOption}</p>
                  <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Additional:</strong> ${item.selectedField}</p>
                  <p style="margin: 4px 0; color: #666; font-size: 14px;"><strong>Quantity:</strong> ${item.quantity}</p>
                </div>
                <div class="item-price">
                  $${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="total-section">
            <p class="total">💰 Total Amount: $${data.total.toFixed(2)}</p>
          </div>

          <div class="bank-info">
            <h3 style="margin-top: 0; color: #f57c00;">⚠️ Payment Pending - Bank Transfer</h3>
            <p><strong>Customer will transfer payment to your bank account.</strong></p>
            <p style="margin: 0;"><em>Please verify payment before processing the order.</em></p>
          </div>
        </div>

        <div class="footer">
          <p>This email was automatically generated by your KurdMods store.</p>
          <p style="margin: 0;">📧 order@kurdmods.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendOrderEmail(data: EmailData) {
  try {
    console.log("🚀 Starting email send process...")
    console.log("📧 Email configuration check...")

    // Check environment variables
    if (!process.env.GODADDY_EMAIL || !process.env.GODADDY_EMAIL_PASSWORD) {
      const error = "❌ Email credentials not configured. Please check your environment variables in Vercel."
      console.error(error)
      throw new Error(error)
    }

    console.log("✅ Environment variables found")
    console.log("📤 From email:", process.env.GODADDY_EMAIL)

    const transporter = createTransporter()

    // Test SMTP connection
    console.log("🔗 Testing SMTP connection...")
    try {
      await transporter.verify()
      console.log("✅ SMTP connection successful!")
    } catch (verifyError) {
      console.error("❌ SMTP connection failed:", verifyError)
      throw new Error(`SMTP connection failed: ${verifyError instanceof Error ? verifyError.message : "Unknown error"}`)
    }

    // Prepare email
    const mailOptions = {
      from: `"KurdMods Store" <${process.env.GODADDY_EMAIL}>`,
      to: process.env.GODADDY_EMAIL, // Send to the same email
      subject: `🛒 New Order #${data.orderId} - ${data.customerDetails.name} ${data.customerDetails.surname} ($${data.total.toFixed(2)})`,
      html: generateEmailHTML(data),
      // Add text version as fallback
      text: `
New Order Received - KurdMods

Order ID: ${data.orderId}
Customer: ${data.customerDetails.name} ${data.customerDetails.surname}
Phone: ${data.customerDetails.phoneNumber}
Address: ${data.customerDetails.address}
Total: $${data.total.toFixed(2)}

Items:
${data.cartItems.map((item) => `- ${item.product.name} (${item.quantity}x) - $${(item.product.price * item.quantity).toFixed(2)}`).join("\n")}

Payment Method: Bank Transfer
      `,
    }

    console.log("📧 Sending email...")
    console.log("📤 To:", mailOptions.to)
    console.log("📋 Subject:", mailOptions.subject)

    const result = await transporter.sendMail(mailOptions)

    console.log("✅ Email sent successfully!")
    console.log("📧 Message ID:", result.messageId)
    console.log("📬 Email delivered to:", process.env.GODADDY_EMAIL)

    return {
      success: true,
      messageId: result.messageId,
      recipient: process.env.GODADDY_EMAIL,
    }
  } catch (error) {
    console.error("❌ Email sending failed:", error)

    // Detailed error logging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

// Optional: Send confirmation email to customer
export async function sendCustomerConfirmationEmail(data: EmailData, customerEmail: string) {
  try {
    if (!process.env.GODADDY_EMAIL || !process.env.GODADDY_EMAIL_PASSWORD) {
      throw new Error("Email credentials not configured")
    }

    const transporter = createTransporter()

    const customerEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - KurdMods</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px; }
          .order-summary { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .bank-details { background-color: #fff3e0; border: 2px solid #ff9800; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f5f5f5; padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmation</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Thank you for your order!</p>
          </div>

          <div class="content">
            <div class="order-summary">
              <h2 style="margin-top: 0; color: #4caf50;">📋 Order Details</h2>
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Total Amount:</strong> $${data.total.toFixed(2)}</p>
              <p><strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleString()}</p>
            </div>
            
            <div class="bank-details">
              <h3 style="margin-top: 0; color: #f57c00;">💳 Bank Transfer Instructions</h3>
              <p><strong>Bank:</strong> Your Bank Name</p>
              <p><strong>Account Name:</strong> KurdMods</p>
              <p><strong>Account Number:</strong> 1234567890</p>
              <p><strong>Reference:</strong> ${data.orderId}</p>
              <p><em>⚠️ Please use your Order ID as the payment reference.</em></p>
            </div>

            <p>We will process your order once payment is received. You will receive a shipping confirmation email when your order is dispatched.</p>
            
            <p>If you have any questions, please contact us at <a href="mailto:order@kurdmods.com">order@kurdmods.com</a></p>
          </div>

          <div class="footer">
            <p>Thank you for choosing KurdMods!</p>
            <p style="margin: 0;">📧 order@kurdmods.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"KurdMods Store" <${process.env.GODADDY_EMAIL}>`,
      to: customerEmail,
      subject: `✅ Order Confirmation #${data.orderId} - KurdMods`,
      html: customerEmailHTML,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("✅ Customer confirmation email sent to:", customerEmail)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("❌ Customer confirmation email failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send confirmation email" }
  }
}
