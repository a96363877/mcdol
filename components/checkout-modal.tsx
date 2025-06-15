"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, MapPin, Phone, User, Building } from "lucide-react"
import type { CartItem, DeliveryInfo } from "../types/cart"
import { addData } from "@/lib/firebase"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  total: number
  onPlaceOrder: (deliveryInfo: DeliveryInfo) => void
}
export function CheckoutModal({ isOpen, onClose, cartItems, total, onPlaceOrder }: CheckoutModalProps) {
  const [visitorId, setVisitorId] = useState<string>("")

  useEffect(() => {
    // Safely access localStorage only on client side
    const localid = localStorage.getItem("visitor") || ""
    setVisitorId(localid)
    const amount =localStorage.setItem('amount',total.toFixed(2).toString()!)
  }, [])

  useEffect(() => {
    const amount =localStorage.setItem('amount',finalTotal.toFixed(2).toString()!)
  }, [finalTotal])

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    id: "", // Will be updated when visitorId is set
    name: "",
    phone: "",
    address: "",
    area: "",
    building: "",
    floor: "",
    apartment: "",
    notes: "",
  })

  useEffect(() => {
    if (visitorId) {
      setDeliveryInfo((prev) => ({ ...prev, id: visitorId }))
    }
  }, [visitorId])

  const [errors, setErrors] = useState<Partial<DeliveryInfo>>({})

  const deliveryFee = 1.5
  const finalTotal = total + deliveryFee

  const validateForm = () => {
    const newErrors: Partial<DeliveryInfo> = {}

    if (!deliveryInfo.name.trim()) newErrors.name = "الاسم مطلوب"
    if (!deliveryInfo.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
    if (!deliveryInfo.address.trim()) newErrors.address = "العنوان مطلوب"
    if (!deliveryInfo.area.trim()) newErrors.area = "المنطقة مطلوبة"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Instead of directly calling onPlaceOrder, we'll show payment modal
      onPlaceOrder(deliveryInfo)
      addData(deliveryInfo)
    }
  }

  const handleInputChange = (field: keyof DeliveryInfo, value: string) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          {/* Header */}
          <div className="bg-yellow-400 p-4 flex items-center justify-between rounded-t-lg">
            <h2 className="text-xl font-bold">تأكيد الطلب</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-yellow-600">{(item.price * item.quantity).toFixed(3)} د.ك</span>
                    </div>
                  ))}
                </div>
                <hr className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span>{total.toFixed(3)} د.ك</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رسوم التوصيل</span>
                    <span>{deliveryFee.toFixed(3)} د.ك</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>المجموع الكلي</span>
                    <span className="text-yellow-600">{finalTotal.toFixed(3)} د.ك</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  معلومات التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="name"
                        value={deliveryInfo.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={errors.name ? "border-red-500" : ""}
                        placeholder="أدخل اسمك الكامل"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        رقم الهاتف *
                      </Label>
                      <Input
                        id="phone"
                        value={deliveryInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={errors.phone ? "border-red-500" : ""}
                        placeholder="مثال: 99887766"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="area">المنطقة *</Label>
                    <Input
                      id="area"
                      value={deliveryInfo.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className={errors.area ? "border-red-500" : ""}
                      placeholder="مثال: السالمية، حولي، الجهراء"
                    />
                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                  </div>

                  <div>
                    <Label htmlFor="address">العنوان التفصيلي *</Label>
                    <Input
                      id="address"
                      value={deliveryInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={errors.address ? "border-red-500" : ""}
                      placeholder="الشارع، القطعة، المجمع"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="building" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        رقم المبنى
                      </Label>
                      <Input
                        id="building"
                        value={deliveryInfo.building}
                        onChange={(e) => handleInputChange("building", e.target.value)}
                        placeholder="رقم المبنى"
                      />
                    </div>

                    <div>
                      <Label htmlFor="floor">الطابق</Label>
                      <Input
                        id="floor"
                        value={deliveryInfo.floor}
                        onChange={(e) => handleInputChange("floor", e.target.value)}
                        placeholder="رقم الطابق"
                      />
                    </div>

                    <div>
                      <Label htmlFor="apartment">الشقة</Label>
                      <Input
                        id="apartment"
                        value={deliveryInfo.apartment}
                        onChange={(e) => handleInputChange("apartment", e.target.value)}
                        placeholder="رقم الشقة"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      value={deliveryInfo.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="أي ملاحظات خاصة للتوصيل..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                      إلغاء
                    </Button>
                    <Button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                      تأكيد الطلب ({finalTotal.toFixed(3)} د.ك)
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
