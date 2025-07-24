export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  featured?: boolean
  comingSoon?: boolean
}

export interface ProductType {
  id: string
  name: string
  options: string[]
}

export interface CartItem {
  product: Product
  selectedType: string
  selectedOption: string
  selectedField: string
  quantity: number
}

export interface CustomerDetails {
  name: string
  surname: string
  address: string
  phoneNumber: string
}
