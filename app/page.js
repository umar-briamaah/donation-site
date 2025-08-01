import { prisma } from '../lib/prisma'
import CauseCard from '../components/CauseCard'
import { Heart, Users, DollarSign, Target } from 'lucide-react'

async function getCauses() {
  try {
    const causes = await prisma.cause.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    })
    return causes
  } catch (error) {
    console.error('Error fetching causes:', error)
    return []
  }
}

async function getStats() {
  try {
    const [totalDonations, totalCauses, totalUsers, totalRaised] = await Promise.all([
      prisma.donation.count({ where: { status: 'COMPLETED' } }),
      prisma.cause.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.donation.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      })
    ])

    return {
      totalDonations,
      totalCauses,
      totalUsers,
      totalRaised: totalRaised._sum.amount || 0
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalDonations: 0,
      totalCauses: 0,
      totalUsers: 0,
      totalRaised: 0
    }
  }
}

export default async function HomePage() {
  const [causes, stats] = await Promise.all([getCauses(), getStats()])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Make a Difference Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join thousands of generous hearts in supporting causes that matter. 
            Every donation, no matter the size, creates ripples of positive change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/causes"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Causes
            </a>
            <a
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                ${stats.totalRaised.toLocaleString()}
              </h3>
              <p className="text-gray-600">Total Raised</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {stats.totalDonations.toLocaleString()}
              </h3>
              <p className="text-gray-600">Donations Made</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {stats.totalCauses}
              </h3>
              <p className="text-gray-600">Active Causes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {stats.totalUsers.toLocaleString()}
              </h3>
              <p className="text-gray-600">Community Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Causes Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Causes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover meaningful causes that are making a real impact in communities around the world.
            </p>
          </div>
          
          {causes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {causes.map((cause) => (
                <CauseCard key={cause.id} cause={cause} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No causes available</h3>
              <p className="text-gray-500">Check back soon for new causes to support!</p>
            </div>
          )}
          
          {causes.length > 0 && (
            <div className="text-center mt-12">
              <a
                href="/causes"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block"
              >
                View All Causes
              </a>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Making a donation is simple and secure. Here&apos;s how you can start making a difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose a Cause</h3>
              <p className="text-gray-600">
                Browse through our vetted causes and find one that resonates with your values and passion.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Make Your Donation</h3>
              <p className="text-gray-600">
                Enter your donation amount and complete the secure payment process using your preferred method.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Your Impact</h3>
              <p className="text-gray-600">
                Receive updates on how your donation is being used and see the positive impact you&spos;re creating.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}