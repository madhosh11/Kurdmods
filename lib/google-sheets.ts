import { GoogleAuth } from "google-auth-library"
import { type sheets_v4, google } from "googleapis"

interface OrderData {
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
  orderId: string
}

// Google Sheets configuration
const SPREADSHEET_ID = "1PsiejHBvLJ5TdNERxnKvJrPz61TBUDUHaqQQ_vFk7RU"
const SHEET_NAME = "Sheet1" // Change this if your sheet has a different name

// Initialize Google Sheets API
async function getGoogleSheetsInstance(): Promise<sheets_v4.Sheets> {
  try {
    // Check if credentials are available
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("Google Sheets credentials not configured. Please check environment variables.")
    }

    console.log("🔑 Initializing Google Sheets API...")

    // Create credentials from environment variables
    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }

    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const authClient = await auth.getClient()
    const sheets = google.sheets({ version: "v4", auth: authClient })

    console.log("✅ Google Sheets API initialized successfully")
    return sheets
  } catch (error) {
    console.error("❌ Failed to initialize Google Sheets API:", error)
    throw error
  }
}

// Set up headers in the Google Sheet (run this once)
export async function setupSheetHeaders() {
  try {
    const sheets = await getGoogleSheetsInstance()

    const headers = [
      "Order ID",
      "Date/Time",
      "Customer Name",
      "Customer Surname",
      "Phone Number",
      "Address",
      "Product Name",
      "Product Type",
      "Product Option",
      "Additional Field",
      "Quantity",
      "Unit Price",
      "Total Amount",
      "Payment Method",
      "Status",
    ]

    // Check if headers already exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:O1`,
    })

    if (!response.data.values || response.data.values.length === 0) {
      // Headers don't exist, add them
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:O1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [headers],
        },
      })

      console.log("✅ Headers added to Google Sheet")
      return { success: true, message: "Headers added successfully" }
    } else {
      console.log("ℹ️ Headers already exist in Google Sheet")
      return { success: true, message: "Headers already exist" }
    }
  } catch (error) {
    console.error("❌ Failed to setup sheet headers:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to setup headers",
    }
  }
}

// Add order data to Google Sheets
export async function addOrderToSheet(orderData: OrderData) {
  try {
    console.log("📊 Adding order to Google Sheets...")

    const sheets = await getGoogleSheetsInstance()

    // Ensure headers are set up
    await setupSheetHeaders()

    // Prepare rows for each cart item
    const rows = orderData.cartItems.map((item) => [
      orderData.orderId,
      new Date(orderData.orderDate).toLocaleString(),
      orderData.customerDetails.name,
      orderData.customerDetails.surname,
      orderData.customerDetails.phoneNumber,
      orderData.customerDetails.address,
      item.product.name,
      item.selectedType,
      item.selectedOption,
      item.selectedField,
      item.quantity,
      `$${item.product.price.toFixed(2)}`,
      `$${(item.product.price * item.quantity).toFixed(2)}`,
      "Bank Transfer",
      "Pending Payment",
    ])

    // Add a summary row for the total order
    const summaryRow = [
      orderData.orderId,
      new Date(orderData.orderDate).toLocaleString(),
      orderData.customerDetails.name,
      orderData.customerDetails.surname,
      orderData.customerDetails.phoneNumber,
      orderData.customerDetails.address,
      "--- ORDER TOTAL ---",
      "",
      "",
      "",
      orderData.cartItems.reduce((sum, item) => sum + item.quantity, 0),
      "",
      `$${orderData.total.toFixed(2)}`,
      "Bank Transfer",
      "Pending Payment",
    ]

    // Combine all rows
    const allRows = [...rows, summaryRow]

    // Append data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:O`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: allRows,
      },
    })

    console.log("✅ Order added to Google Sheets successfully")
    console.log("📊 Updated range:", response.data.updates?.updatedRange)

    return {
      success: true,
      message: "Order added to Google Sheets successfully",
      updatedRange: response.data.updates?.updatedRange,
      rowsAdded: allRows.length,
    }
  } catch (error) {
    console.error("❌ Failed to add order to Google Sheets:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add order to Google Sheets",
    }
  }
}

// Update order status in Google Sheets
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    console.log(`📊 Updating order ${orderId} status to: ${newStatus}`)

    const sheets = await getGoogleSheetsInstance()

    // Get all data to find the order
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:O`,
    })

    if (!response.data.values) {
      throw new Error("No data found in sheet")
    }

    const rows = response.data.values
    const updates: any[] = []

    // Find rows with matching order ID and update status
    rows.forEach((row, index) => {
      if (row[0] === orderId) {
        // Order ID is in column A (index 0)
        updates.push({
          range: `${SHEET_NAME}!O${index + 1}`, // Status is in column O (index 14)
          values: [[newStatus]],
        })
      }
    })

    if (updates.length === 0) {
      throw new Error(`Order ${orderId} not found in sheet`)
    }

    // Batch update all matching rows
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "RAW",
        data: updates,
      },
    })

    console.log(`✅ Updated ${updates.length} rows for order ${orderId}`)

    return {
      success: true,
      message: `Order status updated to: ${newStatus}`,
      rowsUpdated: updates.length,
    }
  } catch (error) {
    console.error("❌ Failed to update order status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order status",
    }
  }
}

// Get all orders from Google Sheets
export async function getAllOrders() {
  try {
    console.log("📊 Fetching all orders from Google Sheets...")

    const sheets = await getGoogleSheetsInstance()

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:O`,
    })

    if (!response.data.values || response.data.values.length <= 1) {
      return { success: true, orders: [], message: "No orders found" }
    }

    const [headers, ...rows] = response.data.values
    const orders = rows.map((row, index) => ({
      rowNumber: index + 2, // +2 because we skip header and arrays are 0-indexed
      orderId: row[0] || "",
      dateTime: row[1] || "",
      customerName: row[2] || "",
      customerSurname: row[3] || "",
      phoneNumber: row[4] || "",
      address: row[5] || "",
      productName: row[6] || "",
      productType: row[7] || "",
      productOption: row[8] || "",
      additionalField: row[9] || "",
      quantity: row[10] || "",
      unitPrice: row[11] || "",
      totalAmount: row[12] || "",
      paymentMethod: row[13] || "",
      status: row[14] || "",
    }))

    console.log(`✅ Retrieved ${orders.length} order entries`)

    return {
      success: true,
      orders,
      message: `Retrieved ${orders.length} order entries`,
    }
  } catch (error) {
    console.error("❌ Failed to get orders from Google Sheets:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve orders",
    }
  }
}
