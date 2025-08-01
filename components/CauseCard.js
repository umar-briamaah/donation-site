import Link from 'next/link'
import Image from 'next/image'
import { Heart, Target } from 'lucide-react'

export default function CauseCard({ cause }) {
  const progressPercentage = Math.min((cause.raised / cause.goal) * 100, 100)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {cause.image ? (
          <Image
            src={cause.image}
            alt={cause.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <Heart className="h-16 w-16 text-primary-500" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {cause.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {cause.description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Raised: <span className="font-medium text-gray-700">${cause.raised.toLocaleString()}</span>
            </span>
            <span className="text-gray-500 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              ${cause.goal.toLocaleString()}
            </span>
          </div>
        </div>
        
        <Link
          href={`/donate/${cause.id}`}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md text-center font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Heart className="h-4 w-4" />
          <span>Donate Now</span>
        </Link>
      </div>
    </div>
  )
}