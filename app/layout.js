import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'
import SessionProvider from '../components/SessionProvider'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Donation System',
  description: 'A platform for managing donations and causes',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}