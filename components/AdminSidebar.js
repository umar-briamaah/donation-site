'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Heart, 
  Users, 
  Settings, 
  BarChart3, 
  FileText,
  Home
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      href: '/admin/causes',
      label: 'Manage Causes',
      icon: Heart
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users
    },
    {
      href: '/admin/reports',
      label: 'Reports',
      icon: BarChart3
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings
    }
  ]

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-6 mb-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">← Back to Site</span>
          </Link>
        </div>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white border-r-2 border-primary-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Admin Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700 bg-gray-800">
        <div className="text-xs text-gray-400">
          <p>Admin Dashboard</p>
          <p>DonateApp v1.0</p>
        </div>
      </div>
    </div>
  )
}