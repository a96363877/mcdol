"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, CreditCard, Shield, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import type { PaymentMethod, PaymentResult } from "../types/payment"
import type { Order } from "../types/cart"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order
  onPaymentComplete: (result: PaymentResult) => void
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "knet",
    name: "KNET",
    nameAr: "كي نت",
    type: "knet",
    icon: "🏦",
    enabled: true,
  },
  {
    id: "visa",
    name: "Visa",
    nameAr: "فيزا",
    type: "visa",
    icon: "💳",
    enabled: true,
  },
  {
    id: "mastercard",
    name: "Mastercard",
    nameAr: "ماستركارد",
    type: "mastercard",
    icon: "💳",
    enabled: true,
  },
  
]

export function PaymentModal({ isOpen, onClose, order, onPaymentComplete }: PaymentModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>("knet")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "knet" | "card" | "processing" | "success" | "error">(
    "select",
  )

  // KNET form state
  const [knetForm, setKnetForm] = useState({
    cardNumber: "",
    pin: "",
  })

  // Card form state
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateKnetForm = () => {
    const newErrors: Record<string, string> = {}

    if (!knetForm.cardNumber || knetForm.cardNumber.length !== 16) {
      newErrors.cardNumber = "رقم البطاقة يجب أن يكون 16 رقم"
    }

    if (!knetForm.pin || knetForm.pin.length !== 4) {
      newErrors.pin = "الرقم السري يجب أن يكون 4 أرقام"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCardForm = () => {
    const newErrors: Record<string, string> = {}

    if (!cardForm.cardNumber || cardForm.cardNumber.length < 13) {
      newErrors.cardNumber = "رقم البطاقة غير صحيح"
    }

    if (!cardForm.expiryMonth || !cardForm.expiryYear) {
      newErrors.expiry = "تاريخ انتهاء الصلاحية مطلوب"
    }

    if (!cardForm.cvv || cardForm.cvv.length < 3) {
      newErrors.cvv = "رمز الأمان غير صحيح"
    }

    if (!cardForm.cardholderName.trim()) {
      newErrors.cardholderName = "اسم حامل البطاقة مطلوب"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const processKnetPayment = async () => {
    if (!validateKnetForm()) return

    setIsProcessing(true)
    setPaymentStep("processing")

    // Simulate KNET payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate random success/failure for demo
      const success = Math.random() > 0.2 // 80% success rate

      if (success) {
        const result: PaymentResult = {
          success: true,
          transactionId: `KNET${Date.now()}`,
        }
        setPaymentStep("success")
        setTimeout(() => {
          onPaymentComplete(result)
        }, 2000)
      } else {
        const result: PaymentResult = {
          success: false,
          errorMessage: "Payment declined by bank",
          errorMessageAr: "تم رفض الدفع من البنك",
        }
        setPaymentStep("error")
        setTimeout(() => {
          onPaymentComplete(result)
        }, 3000)
      }
    } catch (error) {
      const result: PaymentResult = {
        success: false,
        errorMessage: "Network error occurred",
        errorMessageAr: "حدث خطأ في الشبكة",
      }
      setPaymentStep("error")
      setTimeout(() => {
        onPaymentComplete(result)
      }, 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const processCardPayment = async () => {
    if (!validateCardForm()) return

    setIsProcessing(true)
    setPaymentStep("processing")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const success = Math.random() > 0.15 // 85% success rate

      if (success) {
        const result: PaymentResult = {
          success: true,
          transactionId: `CC${Date.now()}`,
        }
        setPaymentStep("success")
        setTimeout(() => {
          onPaymentComplete(result)
        }, 2000)
      } else {
        const result: PaymentResult = {
          success: false,
          errorMessage: "Card payment failed",
          errorMessageAr: "فشل في دفع البطاقة",
        }
        setPaymentStep("error")
        setTimeout(() => {
          onPaymentComplete(result)
        }, 3000)
      }
    } catch (error) {
      const result: PaymentResult = {
        success: false,
        errorMessage: "Payment processing error",
        errorMessageAr: "خطأ في معالجة الدفع",
      }
      setPaymentStep("error")
      setTimeout(() => {
        onPaymentComplete(result)
      }, 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const processCashPayment = () => {
    const result: PaymentResult = {
      success: true,
      transactionId: `CASH${Date.now()}`,
    }
    onPaymentComplete(result)
  }

  const handlePaymentSubmit = () => {
    const selectedMethod = paymentMethods.find((m) => m.id === selectedPayment)

    if (selectedMethod?.type === "knet") {
        setIsProcessing(true)
        setPaymentStep("processing")
        window.location.href="/kpay"
      
    } else if (selectedMethod?.type === "visa" || selectedMethod?.type === "mastercard") {
      setPaymentStep("card")
    } else if (selectedMethod?.type === "cash") {
      processCashPayment()
    }
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md" dir="rtl">
          {/* Header */}
          <div className="bg-yellow-400 p-4 flex items-center justify-between rounded-t-lg">
            <h2 className="text-xl font-bold">الدفع</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">المجموع الكلي</span>
                  <span className="text-2xl font-bold text-yellow-600">{order.total.toFixed(3)} د.ك</span>
                </div>
                <p className="text-sm text-gray-600">رقم الطلب: #{order.id}+{"4M5L452"}</p>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            {paymentStep === "select" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">اختر طريقة الدفع</h3>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50"
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-semibold">{method.nameAr}</p>
                          <p className="text-sm text-gray-600">{method.name}</p>
                        </div>
                        {method.type === "knet" && (
                          <div className="mr-auto">
                            <Shield className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  onClick={handlePaymentSubmit}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 mt-6"
                >
                  متابعة الدفع
                </Button>
              </div>
            )}

            {/* KNET Payment Form */}
            {paymentStep === "knet" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">دفع كي نت</h3>
                  <p className="text-sm text-gray-600">ادخل بيانات بطاقة كي نت الخاصة بك</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="knet-card">رقم البطاقة</Label>
                    <Input
                      id="knet-card"
                      type="text"
                      maxLength={16}
                      value={knetForm.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        setKnetForm((prev) => ({ ...prev, cardNumber: value }))
                      }}
                      placeholder="1234567890123456"
                      className={errors.cardNumber ? "border-red-500" : ""}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="knet-pin">الرقم السري</Label>
                    <Input
                      id="knet-pin"
                      type="password"
                      maxLength={4}
                      value={knetForm.pin}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        setKnetForm((prev) => ({ ...prev, pin: value }))
                      }}
                      placeholder="****"
                      className={errors.pin ? "border-red-500" : ""}
                    />
                    {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">آمان كي نت</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    جميع المعاملات محمية بتشفير 256-bit SSL ومعتمدة من البنك المركزي الكويتي
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setPaymentStep("select")} className="flex-1">
                    رجوع
                  </Button>
                  <Button
                    onClick={processKnetPayment}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                    دفع {order.total.toFixed(3)} د.ك
                  </Button>
                </div>
              </div>
            )}

            {/* Card Payment Form */}
            {paymentStep === "card" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg">دفع بالبطاقة الائتمانية</h3>
                  <p className="text-sm text-gray-600">ادخل بيانات البطاقة الائتمانية</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">رقم البطاقة</Label>
                    <Input
                      id="card-number"
                      type="text"
                      maxLength={19}
                      value={formatCardNumber(cardForm.cardNumber)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "").replace(/\D/g, "")
                        setCardForm((prev) => ({ ...prev, cardNumber: value }))
                      }}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? "border-red-500" : ""}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cardholder-name">اسم حامل البطاقة</Label>
                    <Input
                      id="cardholder-name"
                      type="text"
                      value={cardForm.cardholderName}
                      onChange={(e) => setCardForm((prev) => ({ ...prev, cardholderName: e.target.value }))}
                      placeholder="AHMED AL-SALEM"
                      className={errors.cardholderName ? "border-red-500" : ""}
                    />
                    {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="expiry-month">الشهر</Label>
                      <Input
                        id="expiry-month"
                        type="text"
                        maxLength={2}
                        value={cardForm.expiryMonth}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          setCardForm((prev) => ({ ...prev, expiryMonth: value }))
                        }}
                        placeholder="12"
                        className={errors.expiry ? "border-red-500" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry-year">السنة</Label>
                      <Input
                        id="expiry-year"
                        type="text"
                        maxLength={2}
                        value={cardForm.expiryYear}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          setCardForm((prev) => ({ ...prev, expiryYear: value }))
                        }}
                        placeholder="25"
                        className={errors.expiry ? "border-red-500" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        maxLength={4}
                        value={cardForm.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          setCardForm((prev) => ({ ...prev, cvv: value }))
                        }}
                        placeholder="123"
                        className={errors.cvv ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                  {errors.expiry && <p className="text-red-500 text-xs">{errors.expiry}</p>}
                  {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setPaymentStep("select")} className="flex-1">
                    رجوع
                  </Button>
                  <Button
                    onClick={processCardPayment}
                    disabled={isProcessing}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
                    دفع {order.total.toFixed(3)} د.ك
                  </Button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {paymentStep === "processing" && (
              <div className="text-center py-8">
                <Loader2 className="h-16 w-16 animate-spin mx-auto text-yellow-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">جاري معالجة الدفع...</h3>
                <p className="text-gray-600">يرجى عدم إغلاق هذه النافذة</p>
              </div>
            )}

            {/* Success State */}
            {paymentStep === "success" && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h3 className="font-bold text-lg text-green-600 mb-2">تم الدفع بنجاح!</h3>
                <p className="text-gray-600">سيتم تحويلك لصفحة تأكيد الطلب...</p>
              </div>
            )}

            {/* Error State */}
            {paymentStep === "error" && (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
                <h3 className="font-bold text-lg text-red-600 mb-2">فشل في الدفع</h3>
                <p className="text-gray-600 mb-4">يرجى المحاولة مرة أخرى أو اختيار طريقة دفع أخرى</p>
                <Button
                  onClick={() => setPaymentStep("select")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  المحاولة مرة أخرى
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
