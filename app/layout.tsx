import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { CartProvider } from "@/contexts/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "Your one-stop shop for premium products",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
