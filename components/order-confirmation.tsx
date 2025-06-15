"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react"
import type { Order } from "../types/cart"

interface OrderConfirmationProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

export function OrderConfirmation({ isOpen, onClose, order }: OrderConfirmationProps) {
  if (!isOpen || !order) return null

  const estimatedTime = "30-45 دقيقة"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md" dir="rtl">
          <div className="p-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-green-600 mb-2">تم تأكيد طلبك!</h2>
            <p className="text-gray-600 mb-6">شكراً لك، سيتم تحضير طلبك الآن</p>

            {/* Order Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">تفاصيل الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>رقم الطلب</span>
                  <span className="font-bold">#{order.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">وقت التوصيل المتوقع: {estimatedTime}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-600 mt-1" />
                  <div className="text-sm text-right">
                    <p className="font-semibold">{order.deliveryInfo.name}</p>
                    <p>{order.deliveryInfo.area}</p>
                    <p>{order.deliveryInfo.address}</p>
                    {order.deliveryInfo.building && <p>مبنى {order.deliveryInfo.building}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{order.deliveryInfo.phone}</span>
                </div>

                <hr />

                <div className="flex justify-between font-bold text-lg">
                  <span>المجموع الكلي</span>
                  <span className="text-yellow-600">{order.total.toFixed(3)} د.ك</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={onClose} className="w-full bg-yellow-100 hover:bg-yellow-50 text-black font-bold">
                متابعة التسوق
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // In a real app, this would navigate to order tracking
                  alert("سيتم إضافة تتبع الطلب قريباً")
                }}
              >
                تتبع الطلب
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4">سيتم إرسال رسالة نصية لتأكيد الطلب وتحديثات التوصيل</p>
          </div>
        </div>
      </div>
    </div>
  )
}
