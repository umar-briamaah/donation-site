import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '../../../lib/prisma'
import DonationForm from '../../../components/DonationForm'
import { Heart, Target, Calendar, User } from 'lucide-react'

async function getCause(causeId) {
  try {
    const cause = await prisma.cause.findUnique({
      where: {
        id: causeId,
        isActive: true
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        },
        donations: {
          where: {
            status: 'COMPLETED'
          },
          select: {
            amount: true,
            donorName: true,
            isAnonymous: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    })

    return cause
  } catch (error) {
    console.error('Error fetching cause:', error)
    return null
  }
}

export default async function DonatePage({ params }) {
  const cause = await getCause(params.causeId)

  if (!cause) {
    notFound()
  }

  const progressPercentage = Math.min((cause.raised / cause.goal) * 100, 100)
  const remainingAmount = Math.max(cause.goal - cause.raised, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cause Header */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              {cause.image && (
                <div className="relative h-64 w-full">
                  <Image
                    src={cause.image}
                    alt={cause.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {cause.title}
                </h1>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span>Created by {cause.creator.name}</span>
                  <Calendar className="h-4 w-4 ml-4 mr-1" />
                  <span>{new Date(cause.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      ${cause.raised.toLocaleString()} raised
                    </span>
                    <span className="text-sm text-gray-500">
                      {progressPercentage.toFixed(1)}% of goal
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Goal: ${cause.goal.toLocaleString()}
                    </span>
                    <span className="text-gray-600">
                      ${remainingAmount.toLocaleString()} remaining
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">About this cause</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {cause.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                Recent Donations
              </h2>
              
              {cause.donations.length > 0 ? (
                <div className="space-y-4">
                  {cause.donations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="bg-primary-100 p-2 rounded-full mr-3">
                          <Heart className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {donation.isAnonymous ? 'Anonymous' : donation.donorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary-600">
                        ${donation.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Be the first to donate to this cause!</p>
                </div>
              )}
            </div>
          </div>

          {/* Donation Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <DonationForm cause={cause} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}