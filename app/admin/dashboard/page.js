import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import AdminSidebar from '../../../components/AdminSidebar'
import { DollarSign, Users, Heart, TrendingUp, Calendar } from 'lucide-react'

async function getAdminStats() {
  try {
    const [
      totalUsers,
      totalCauses,
      totalDonations,
      totalRaised,
      recentDonations,
      topCauses
    ] = await Promise.all([
      prisma.user.count(),
      prisma.cause.count({ where: { isActive: true } }),
      prisma.donation.count({ where: { status: 'COMPLETED' } }),
      prisma.donation.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),
      prisma.donation.findMany({
        where: { status: 'COMPLETED' },
        include: {
          cause: { select: { title: true } },
          user: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.cause.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          raised: true,
          goal: true,
          _count: {
            select: {
              donations: {
                where: { status: 'COMPLETED' }
              }
            }
          }
        },
        orderBy: { raised: 'desc' },
        take: 5
      })
    ])

    return {
      totalUsers,
      totalCauses,
      totalDonations,
      totalRaised: totalRaised._sum.amount || 0,
      recentDonations,
      topCauses
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalUsers: 0,
      totalCauses: 0,
      totalDonations: 0,
      totalRaised: 0,
      recentDonations: [],
      topCauses: []
    }
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here&pos;s an overview of your platform&pos;s performance.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    ${stats.totalRaised.toLocaleString()}
                  </h3>
                  <p className="text-gray-600">Total Raised</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stats.totalDonations.toLocaleString()}
                  </h3>
                  <p className="text-gray-600">Total Donations</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stats.totalCauses}
                  </h3>
                  <p className="text-gray-600">Active Causes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stats.totalUsers.toLocaleString()}
                  </h3>
                  <p className="text-gray-600">Total Users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Donations */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Recent Donations</h2>
              </div>
              <div className="p-6">
                {stats.recentDonations.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentDonations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {donation.isAnonymous ? 'Anonymous' : donation.user?.name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600">{donation.cause.title}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            ${donation.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">{donation.paymentMethod}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent donations</p>
                )}
              </div>
            </div>

            {/* Top Performing Causes */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Top Performing Causes</h2>
              </div>
              <div className="p-6">
                {stats.topCauses.length > 0 ? (
                  <div className="space-y-4">
                    {stats.topCauses.map((cause, index) => {
                      const progressPercentage = Math.min((cause.raised / cause.goal) * 100, 100)
                      return (
                        <div key={cause.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-500 mr-2">
                                #{index + 1}
                              </span>
                              <p className="font-medium text-gray-800 truncate">
                                {cause.title}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-800">
                                ${cause.raised.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {cause._count.donations} donations
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{progressPercentage.toFixed(1)}% of goal</span>
                            <span>Goal: ${cause.goal.toLocaleString()}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No causes found</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/causes/new"
                className="bg-primary-600 text-white p-4 rounded-lg text-center hover:bg-primary-700 transition-colors"
              >
                <Heart className="h-6 w-6 mx-auto mb-2" />
                <span className="font-medium">Create New Cause</span>
              </a>
              <a
                href="/admin/causes"
                className="bg-gray-600 text-white p-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
              >
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <span className="font-medium">Manage Causes</span>
              </a>
              <a
                href="/admin/users"
                className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
              >
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="font-medium">View Users</span>
              </a>
              <a
                href="/admin/reports"
                className="bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700 transition-colors"
              >
                <DollarSign className="h-6 w-6 mx-auto mb-2" />
                <span className="font-medium">View Reports</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}