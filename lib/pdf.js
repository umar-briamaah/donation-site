import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function generateDonationReceipt(donationData) {
  try {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const fontSize = 12
    const titleFontSize = 20

    // Header
    page.drawText('DONATION RECEIPT', {
      x: width / 2 - 100,
      y: height - 50,
      size: titleFontSize,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    })

    // Receipt Details
    const startY = height - 120
    const lineHeight = 25

    const receiptInfo = [
      { label: 'Receipt #:', value: donationData.id },
      { label: 'Date:', value: new Date(donationData.createdAt).toLocaleDateString() },
      { label: 'Donor Name:', value: donationData.donorName || 'Anonymous' },
      { label: 'Email:', value: donationData.donorEmail || 'N/A' },
      { label: 'Cause:', value: donationData.cause.title },
      { label: 'Amount:', value: `$${donationData.amount.toFixed(2)}` },
      { label: 'Payment Method:', value: donationData.paymentMethod },
      { label: 'Payment ID:', value: donationData.paymentId },
      { label: 'Status:', value: donationData.status }
    ]

    receiptInfo.forEach((info, index) => {
      const y = startY - (index * lineHeight)
      
      page.drawText(info.label, {
        x: 50,
        y: y,
        size: fontSize,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      })
      
      page.drawText(info.value, {
        x: 200,
        y: y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      })
    })

    // Footer
    page.drawText('Thank you for your generous donation!', {
      x: width / 2 - 120,
      y: 100,
      size: 14,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    })

    page.drawText('This receipt is for your records.', {
      x: width / 2 - 90,
      y: 80,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error('Failed to generate PDF receipt')
  }
}