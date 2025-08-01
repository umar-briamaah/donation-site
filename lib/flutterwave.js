import axios from 'axios'

const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3'

export class FlutterwaveService {
  constructor() {
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY
    this.publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY
  }

  async initializePayment(paymentData) {
    try {
      const response = await axios.post(
        `${FLUTTERWAVE_BASE_URL}/payments`,
        {
          tx_ref: paymentData.txRef,
          amount: paymentData.amount,
          currency: 'GHS',
          redirect_url: paymentData.redirectUrl,
          customer: {
            email: paymentData.email,
            name: paymentData.name,
          },
          customizations: {
            title: 'Donation Payment',
            description: `Donation to ${paymentData.causeName}`,
            logo: paymentData.logo
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
      console.error('Flutterwave initialization error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Payment initialization failed'
      }
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await axios.get(
        `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
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
      console.error('Flutterwave verification error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Payment verification failed'
      }
    }
  }
}

export const flutterwaveService = new FlutterwaveService()