import axios from 'axios'

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

export class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY
  }

  async initializePayment(paymentData) {
    try {
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          reference: paymentData.reference,
          amount: paymentData.amount * 100, // Paystack expects amount in kobo
          email: paymentData.email,
          callback_url: paymentData.callbackUrl,
          metadata: {
            custom_fields: [
              {
                display_name: 'Cause',
                variable_name: 'cause',
                value: paymentData.causeName
              }
            ]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Paystack initialization error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Payment initialization failed'
      }
    }
  }

  async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Paystack verification error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Payment verification failed'
      }
    }
  }
}

export const paystackService = new PaystackService()