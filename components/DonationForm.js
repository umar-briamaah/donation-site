'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { Heart, CreditCard, Smartphone } from 'lucide-react'
import PaymentOptionSelect from './PaymentOptionSelect'

export default function DonationForm({ cause }) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('FLUTTERWAVE')
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      amount: '',
      donorName: session?.user?.name || '',
      donorEmail: session?.user?.email || '',
      isAnonymous: false
    }
  })

  const watchAmount = watch('amount')
  const watchIsAnonymous = watch('isAnonymous')

  const predefinedAmounts = [10, 25, 50, 100, 250, 500]

  const handleAmountClick = (amount) => {
    document.getElementById('amount').value = amount
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          causeId: cause.id,
          paymentMethod: selectedPaymentMethod,
          causeName: cause.title
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to payment gateway
        window.location.href = result.paymentUrl
      } else {
        alert('Payment initialization failed: ' + result.error)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred while processing your donation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          Make a Donation
        </h2>
        <p className="text-gray-600">
          Your contribution will help support: <span className="font-semibold">{cause.title}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount ($)
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountClick(amount)}
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                ${amount}
              </button>
            ))}
          </div>
          <input
            {...register('amount', {
              required: 'Donation amount is required',
              min: { value: 1, message: 'Minimum donation is $1' },
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: 'Please enter a valid amount'
              }
            })}
            id="amount"
            type="number"
            step="0.01"
            min="1"
            placeholder="Enter custom amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <PaymentOptionSelect
            selectedMethod={selectedPaymentMethod}
            onMethodChange={setSelectedPaymentMethod}
          />
        </div>

        {/* Donor Information */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              {...register('isAnonymous')}
              id="isAnonymous"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
              Make this donation anonymous
            </label>
          </div>

          {!watchIsAnonymous && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  {...register('donorName', {
                    required: !watchIsAnonymous ? 'Name is required for non-anonymous donations' : false
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.donorName && (
                  <p className="mt-1 text-sm text-red-600">{errors.donorName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  {...register('donorEmail', {
                    required: !watchIsAnonymous ? 'Email is required for non-anonymous donations' : false,
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
                {errors.donorEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.donorEmail.message}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Donation Summary */}
        {watchAmount && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Donation Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Donation Amount:</span>
              <span className="font-semibold text-gray-800">${parseFloat(watchAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="text-gray-600">Covered by platform</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center font-semibold">
              <span className="text-gray-800">Total:</span>
              <span className="text-primary-600">${parseFloat(watchAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !watchAmount}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" />
              <span>Donate ${parseFloat(watchAmount || 0).toFixed(2)}</span>
            </>
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <div className="flex">
          <CreditCard className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Secure Payment</p>
            <p>Your payment information is encrypted and secure. We never store your payment details.</p>
          </div>
        </div>
      </div>
    </div>
  )
}