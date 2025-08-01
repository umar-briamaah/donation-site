import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../../../lib/auth'
import { prisma } from '../../../../../../lib/prisma'
import { generateDonationReceipt } from '../../../../../../lib/pdf'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get donation with cause details
    const donation = await prisma.donation.findUnique({
      where: {
        id: params.donationId,
        userId: session.user.id,
        status: 'COMPLETED'
      },
      include: {
        cause: {
          select: {
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

    if (!donation) {
      return new NextResponse('Donation not found', { status: 404 })
    }

    // Generate PDF
    const pdfBytes = await generateDonationReceipt(donation)

    // Return PDF response
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="donation-receipt-${donation.id}.pdf"`
      }
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return new NextResponse('PDF generation failed', { status: 500 })
  }
}