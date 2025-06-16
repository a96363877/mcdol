export interface CartItem {
  id: string
  name: string
  nameEn: string
  image: string
  price: number
  quantity: number
  category: string
}

export interface DeliveryInfo {
  name: string
  phone: string
  address: string
  area: string
  building: string
  floor: string
  apartment: string
  notes: string
}

export interface Order {
  ORid: string
  items: CartItem[]
  deliveryInfo: DeliveryInfo
  subtotal: number
  deliveryFee: number
  total: number
  ORstatus: "pending" | "confirmed" | "preparing" | "on-way" | "delivered"
  createdAt: string;
}
