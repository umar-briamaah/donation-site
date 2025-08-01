import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../../lib/auth'
import { prisma } from '../../lib/prisma'
import DonationHistory from '../../components/DonationHistory'
import { User, Heart, DollarSign, Calendar } from 'lucide-react'

async function getUserDonations(userId) {
  try {
    const donations = await prisma.donation.findMany({
      where: {
        userId,
        status: 'COMPLETED'
      },
      include: {
        cause: {
          select: {
            id: true,
            title: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return donations
  } catch (error) {
    console.error('Error fetching user donations:', error)
    return []
  }
}

async function getUserStats(userId) {
  try {
    const stats = await prisma.donation.aggregate({
      where: {
        userId,
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    })

    const causesSupported = await prisma.donation.findMany({
      where: {
        userId,
        status: 'COMPLETED'
      },
      select: {
        causeId: true
      },
      distinct: ['causeId']
    })

    return {
      totalDonated: stats._sum.amount || 0,
      totalDonations: stats._count.id || 0,
      causesSupported: causesSupported.length
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      totalDonated: 0,
      totalDonations: 0,
      causesSupported: 0
    }
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  const [donations, stats] = await Promise.all([
    getUserDonations(session.user.id),
    getUserStats(session.user.id)
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <User className="h-12 w-12 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {session.user.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-600">{session.user.email}</p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Member since {new Date(session.user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  ${stats.totalDonated.toLocaleString()}
                </h3>
                <p className="text-gray-600">Total Donated</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalDonations}
                </h3>
                <p className="text-gray-600">Donations Made</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.causesSupported}
                </h3>
                <p className="text-gray-600">Causes Supported</p>
              </div>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Heart className="h-6 w-6 text-red-500 mr-2" />
              Donation History
            </h2>
            {donations.length > 0 && (
              <div className="text-sm text-gray-500">
                {donations.length} donation{donations.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>

          <DonationHistory donations={donations} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/causes"
              className="bg-primary-600 text-white p-4 rounded-lg text-center hover:bg-primary-700 transition-colors"
            >
              <Heart className="h-6 w-6 mx-auto mb-2" />
              <span className="font-medium">Browse Causes</span>
            </a>
            <a
              href="/profile/settings"
              className="bg-gray-600 text-white p-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
            >
              <User className="h-6 w-6 mx-auto mb-2" />
              <span className="font-medium">Account Settings</span>
            </a>
            <a
              href="/causes/new"
              className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
            >
              <DollarSign className="h-6 w-6 mx-auto mb-2" />
              <span className="font-medium">Create Cause</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}