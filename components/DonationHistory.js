import Link from 'next/link'
import Image from 'next/image'
import { Heart, Download, Eye, Calendar } from 'lucide-react'

export default function DonationHistory({ donations = [] }) {
  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No donations yet</h3>
        <p className="text-gray-500 mb-6">
          Start making a difference by supporting a cause you care about.
        </p>
        <Link
          href="/causes"
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center"
        >
          <Heart className="h-4 w-4 mr-2" />
          Browse Causes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <div
          key={donation.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Cause Image */}
              <div className="flex-shrink-0">
                {donation.cause.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={donation.cause.image}
                      alt={donation.cause.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary-600" />
                  </div>
                )}
              </div>

              {/* Donation Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {donation.cause.title}
                  </h3>
                  <span className="text-lg font-bold text-primary-600">
                    ${donation.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {donation.status}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400">Payment ID:</span>
                    <span className="ml-1 font-mono text-xs">
                      {donation.paymentId.slice(-8)}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {donation.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Link
                href={`/donate/${donation.cause.id}`}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="View Cause"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <Link
                href={`/profile/receipt/${donation.id}`}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Download Receipt"
              >
                <Download className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Additional Info for Anonymous Donations */}
          {donation.isAnonymous && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
              This donation was made anonymously
            </div>
          )}
        </div>
      ))}

      {/* Pagination could be added here for many donations */}
      {donations.length >= 10 && (
        <div className="text-center pt-6">
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Load More Donations
          </button>
        </div>
      )}
    </div>
  )
}