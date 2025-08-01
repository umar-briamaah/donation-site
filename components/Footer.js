import { Heart } from 'lucide-react'
import { Linden_Hill } from 'next/font/google'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="font-bold text-lg">DonateApp</span>
            </div>
            <p className="text-gray-300">
              Making a difference, one donation at a time. Join our community of generous hearts.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><a href="/causes" className="text-gray-300 hover:text-white">Browse Causes</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <p className="text-gray-300 mb-2">Email: info@donateapp.com</p>
            <p className="text-gray-300 mb-2">Phone: +1 (555) 123-4567</p>
            <p className="text-gray-300">Address: 123 Charity St, Good City, GC 12345</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} DonateApp. All rights reserved. Built with ❤️ for a better world.
          </p>
        </div>
      </div>
    </footer>
  )
}