export interface PaymentMethod {
    id: string
    name: string
    nameAr: string
    type: "knet" | "visa" | "mastercard" | "cash"
    icon: string
    enabled: boolean
  }
  
  export interface KnetPayment {
    cardNumber: string
    pin: string
    amount: number
    merchantId: string
    transactionId: string
  }
  
  export interface PaymentResult {
    success: boolean
    transactionId?: string
    errorMessage?: string
    errorMessageAr?: string
  }
  