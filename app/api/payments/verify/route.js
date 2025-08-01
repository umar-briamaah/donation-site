import { NextResponse } from 'next/server'
import { flutterwaveService } from '../../../../lib/flutterwave'
import { paystackService } from '../../../../lib/paystack'
import { prisma } from '../../../../lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const txRef = searchParams.get('tx_ref') || searchParams.get('reference')
  const status = searchParams.get('status')
  const transactionId = searchParams.get('transaction_id')

  if (!txRef) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=missing_reference`)
  }

  try {
    // Find the donation record
    const donation = await prisma.donation.findUnique({
      where: { paymentId: txRef },
      include: { cause: true }
    })

    if (!donation) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=donation_not_found`)
    }

    // If already processed, redirect to success
    if (donation.status === 'COMPLETED') {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/profile/receipt/${donation.id}`)
    }

    let verificationResult

    try {
      // Verify payment based on method
      if (donation.paymentMethod === 'FLUTTERWAVE') {
        verificationResult = await flutterwaveService.verifyPayment(transactionId || txRef)
      } else if (donation.paymentMethod === 'PAYSTACK') {
        verificationResult = await paystackService.verifyPayment(txRef)
      } else {
        throw new Error('Invalid payment method')
      }

      if (!verificationResult.success) {
        console.error('Payment verification failed:', verificationResult.error)
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'FAILED' }
        })
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=verification_failed`)
      }

      const paymentData = verificationResult.data.data
      
      // Check if payment was successful
      const isSuccessful = donation.paymentMethod === 'FLUTTERWAVE' 
        ? paymentData.status === 'successful'
        : paymentData.status === 'success'

      if (isSuccessful) {
        // Update donation status
        const updatedDonation = await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'COMPLETED' }
        })

        // Update cause raised amount
        await prisma.cause.update({
          where: { id: donation.causeId },
          data: {
            raised: {
              increment: donation.amount
            }
          }
        })

        // Redirect to receipt page
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/profile/receipt/${updatedDonation.id}`)
      } else {
        // Payment failed
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'FAILED' }
        })
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=payment_failed`)
      }

    } catch (verificationError) {
      console.error('Payment verification error:', verificationError)
      await prisma.donation.update({
        where: { id: donation.id },
        data: { status: 'FAILED' }
      })
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=verification_error`)
    }

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=internal_error`)
  }
}

export async function POST(request) {
  // Handle webhook from payment providers
  try {
    const body = await request.json()
    const signature = request.headers.get('x-webhook-signature')
    
    // This is a simplified webhook handler
    // In production, you should verify the webhook signature
    
    console.log('Webhook received:', body)
    
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}