"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { products, productTypes } from "@/lib/data"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const { dispatch } = useCart()
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [selectedField, setSelectedField] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
        </div>
      </div>
    )
  }

  const selectedTypeData = productTypes.find((type) => type.id === selectedType)
  const canAddToCart = selectedType && selectedOption && selectedField

  const handleAddToCart = () => {
    if (!canAddToCart) return

    dispatch({
      type: "ADD_ITEM",
      payload: {
        product,
        selectedType,
        selectedOption,
        selectedField,
        quantity: 1,
      },
    })

    // Show success message or redirect to cart
    router.push("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Image
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`border-2 rounded-lg overflow-hidden ${
                  currentImageIndex === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details and Selection */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
          </div>

          {/* Type Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Type </Label>
              <RadioGroup value={selectedType} onValueChange={setSelectedType} className="mt-2">
                {productTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <Label htmlFor={type.id}>{type.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Options Dropdown */}
            {selectedType && selectedTypeData && (
              <div>
                <Label className="text-base font-semibold">Packages</Label>
                <Select value={selectedOption} onValueChange={setSelectedOption}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTypeData.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Field Selection */}
            {selectedOption && (
              <div>
                <Label className="text-base font-semibold">Platform</Label>
                <RadioGroup value={selectedField} onValueChange={setSelectedField} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="field1" id="field1" />
                    <Label htmlFor="field1">PlayStation 5</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="field2" id="field2" />
                    <Label htmlFor="field2">Xbox - PC</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} disabled={!canAddToCart} className="w-full" size="lg">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
