'use client'

import { CreditCard, Smartphone } from 'lucide-react'

export default function PaymentOptionSelect({ selectedMethod, onMethodChange }) {
  const paymentMethods = [
    {
      id: 'FLUTTERWAVE',
      name: 'Flutterwave',
      description: 'Credit/Debit Cards, Bank Transfer, Mobile Money',
      icon: CreditCard,
      popular: true
    },
    {
      id: 'PAYSTACK',
      name: 'Paystack',
      description: 'Cards, Bank Transfer, USSD',
      icon: Smartphone,
      popular: false
    }
  ]

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        const IconComponent = method.icon
        return (
          <div
            key={method.id}
            className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onMethodChange(method.id)}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onMethodChange(method.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {method.name}
                    </span>
                    {method.popular && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}