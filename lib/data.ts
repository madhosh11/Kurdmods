import type { Product, ProductType } from "./types"

export const products: Product[] = [
  {
    id: "1",
    name: "Forza Horizon 5",
    description: "Forza Horizon 5 Modded Accounts",
    price: 299.99,
    images: ["/FH5.png", "/FH5.png"], // ← Updated to use your FH5.png image
    featured: true,
  },
  {
    id: "2",
    name: "GTA VI",
    description: "GTA VI Modded Accounts",
    price: 199.99,
    images: ["/gta6.jpeg", "/gta6.jpeg"], // ← Updated to use your gta6.jpg image
    featured: true,
    comingSoon: true,
  },
  {
    id: "3",
    name: "Call Of Duty: Black Ops 7",
    description: "Call Of Duty: Black Ops 7 Modded Accounts",
    price: 149.99,
    images: ["/1397239.jpg", "/1397239.jpg"], // ← Updated to use your bo7.jpg image
    featured: true,
    comingSoon: true,
  },
  {
    id: "4",
    name: "Game 4",
    description: "Description",
    price: 79.99,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    comingSoon: true,
  },
  {
    id: "5",
    name: "Game 5",
    description: "Description",
    price: 159.99,
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    comingSoon: true,
  },
  // Add more products here...
]

export const productTypes: ProductType[] = [
  {
    id: "type1",
    name: "Personal",
    options: ["100M Credit", "250M Credit", "500M Credit"],
  },
  {
    id: "type2",
    name: "Premade",
    options: ["100M Credit", "250M Credit", "500M Credit"],
  },
]
