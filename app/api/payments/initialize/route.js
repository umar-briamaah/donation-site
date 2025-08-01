import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../lib/auth'
import { flutterwaveService } from '../../../../lib/flutterwave'
import { paystackService } from '../../../../lib/paystack'
import { prisma } from '../../../../lib/prisma'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const {
      amount,
      causeId,
      paymentMethod,
      donorName,
      donorEmail,
      isAnonymous,
      causeName
    } = body

    // Validate input
    if (!amount || !causeId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Amount, cause ID, and payment method are required' },
        { status: 400 }
      )
    }

    if (amount < 1) {
      return NextResponse.json(
        { error: 'Minimum donation amount is $1' },
        { status: 400 }
      )
    }

    // Verify cause exists and is active
    const cause = await prisma.cause.findUnique({
      where: { id: causeId, isActive: true }
    })

    if (!cause) {
      return NextResponse.json(
        { error: 'Cause not found or inactive' },
        { status: 404 }
      )
    }

    // Generate unique transaction reference
    const txRef = `donate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare payment data
    const paymentData = {
      amount: parseFloat(amount),
      email: donorEmail || session?.user?.email || 'anonymous@donation.com',
      name: donorName || session?.user?.name || 'Anonymous Donor',
      causeName: causeName || cause.title,
      txRef,
      reference: txRef,
      redirectUrl: `${process.env.NEXTAUTH_URL}/api/payments/verify?tx_ref=${txRef}`,
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/payments/verify?reference=${txRef}`
    }

    let paymentResult

    try {
      // Initialize payment based on selected method
      if (paymentMethod === 'FLUTTERWAVE') {
        paymentResult = await flutterwaveService.initializePayment(paymentData)
      } else if (paymentMethod === 'PAYSTACK') {
        paymentResult = await paystackService.initializePayment(paymentData)
      } else {
        return NextResponse.json(
          { error: 'Invalid payment method' },
          { status: 400 }
        )
      }

      if (!paymentResult.success) {
        console.error('Payment initialization failed:', paymentResult.error)
        return NextResponse.json(
          { error: paymentResult.error },
          { status: 500 }
        )
      }

      // Create pending donation record
      await prisma.donation.create({
        data: {
          amount: parseFloat(amount),
          paymentId: txRef,
          paymentMethod,
          status: 'PENDING',
          donorName: isAnonymous ? null : (donorName || session?.user?.name),
          donorEmail: isAnonymous ? null : (donorEmail || session?.user?.email),
          isAnonymous,
          userId: session?.user?.id || null,
          causeId
        }
      })

      // Return payment URL
      const paymentUrl = paymentMethod === 'FLUTTERWAVE' 
        ? paymentResult.data.data.link 
        : paymentResult.data.data.authorization_url

      return NextResponse.json({
        success: true,
        paymentUrl,
        reference: txRef
      })

    } catch (paymentError) {
      console.error('Payment service error:', paymentError)
      return NextResponse.json(
        { error: 'Payment initialization failed. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}