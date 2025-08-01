import { getServerSession } from 'next-auth/next'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'
import { generateDonationReceipt } from '../../../../lib/pdf'
import { Download, Heart, Check } from 'lucide-react'

async function getDonation(donationId, userId) {
  try {
    const donation = await prisma.donation.findUnique({
      where: {
        id: donationId,
        userId,
        status: 'COMPLETED'
      },
      include: {
        cause: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return donation
  } catch (error) {
    console.error('Error fetching donation:', error)
    return null
  }
}

export default async function ReceiptPage({ params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const donation = await getDonation(params.donationId, session.user.id)

  if (!donation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-green-800">
                Thank you for your donation!
              </h1>
              <p className="text-green-700 mt-1">
                Your generous contribution helps make a real difference.
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  <Heart className="h-6 w-6 mr-2" />
                  Donation Receipt
                </h2>
                <p className="text-primary-100 mt-1">
                  Receipt #{donation.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-primary-100">Date</p>
                <p className="text-xl font-semibold">
                  {new Date(donation.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Donor Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Donor Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">
                      {donation.isAnonymous ? 'Anonymous' : (donation.donorName || donation.user?.name)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">
                      {donation.isAnonymous ? 'Hidden' : (donation.donorEmail || donation.user?.email)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="ml-2 font-medium">{donation.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="ml-2 font-mono text-sm">{donation.paymentId}</span>
                  </div>
                </div>
              </div>

              {/* Donation Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Donation Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Cause:</span>
                    <span className="ml-2 font-medium">{donation.cause.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <span className="ml-2 text-2xl font-bold text-primary-600">
                      ${donation.amount.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {donation.status}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="ml-2 font-medium">Covered by platform</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cause Description */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">About this cause:</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {donation.cause.description}
              </p>
            </div>

            {/* Summary */}
            <div className="mt-8 p-6 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-primary-800">Total Donation</h4>
                  <p className="text-primary-600 text-sm">
                    Thank you for supporting {donation.cause.title}
                  </p>
                </div>
                <div className="text-3xl font-bold text-primary-600">
                  ${donation.amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href={`/api/donations/receipt/${donation.id}/pdf`}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Receipt
              </a>
              <a
                href={`/donate/${donation.cause.id}`}
                className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center justify-center"
              >
                <Heart className="h-4 w-4 mr-2" />
                Donate Again
              </a>
              <a
                href="/profile"
                className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Back to Dashboard
              </a>
            </div>

            {/* Footer Note */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Tax Information:</strong> This receipt serves as proof of your donation. 
                Please consult with a tax professional regarding the deductibility of this donation 
                according to your local tax laws.
              </p>
            </div>
          </div>
        </div>

        {/* Related Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Want to keep track of all your donations?
          </p>
          <a
            href="/profile"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View Your Donation History →
          </a>
        </div>
      </div>
    </div>
  )
}
