import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            product.comingSoon ? "blur-sm" : ""
          }`}
        />
        {product.comingSoon && (
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-6 py-3 rounded-lg shadow-lg">
              <span className="text-lg font-bold text-gray-800">Coming Soon</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <p className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
      </div>
    </div>
  )

  if (product.comingSoon) {
    return (
      <div className="group cursor-not-allowed">
        <CardContent />
      </div>
    )
  }

  return (
    <Link href={`/products/${product.id}`} className="group">
      <CardContent />
    </Link>
  )
}
