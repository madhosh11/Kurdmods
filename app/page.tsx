import ProductCard from "@/components/product-card"
import { products } from "@/lib/data"

export default function HomePage() {
  const featuredProducts = products.filter((product) => product.featured)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          KurdMods {/* ← Change main title */}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Selling Gaming Services in style {/* ← Change subtitle */}</p>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Items {/* ← Change section title */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
