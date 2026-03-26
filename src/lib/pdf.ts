import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Booking, Client, Enquiry, Availability } from '@prisma/client';

type BookingWithIncludes = Booking & {
  client: Client;
  enquiry: Enquiry;
  slot: Availability;
};

export async function generateInvoicePDF(booking: BookingWithIncludes) {
  // Color definitions
  const colors = {
    bg: rgb(0.05, 0.05, 0.05),      // #0D0D0D
    text: rgb(0.93, 0.93, 0.93),    // #EDEDED
    muted: rgb(0.42, 0.40, 0.38),   // #6B6560
    accent: rgb(0.776, 1, 0),       // #C6FF00
    danger: rgb(0.88, 0.35, 0.29),  // #E05A4A
    border: rgb(0.12, 0.12, 0.12),  // White/0.07-ish glass look
  };

  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  
  // Add a blank page to the document
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  // Fill background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: colors.bg,
  });

  // Embed standard fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const margin = 50;
  
  // 1. HEADER SECTION
  page.drawText('INVOICE', {
    x: margin,
    y: height - margin,
    size: 10,
    font: helveticaBold,
    color: colors.accent,
  });

  page.drawText('Yashank D. Photography', {
    x: margin,
    y: height - margin - 35,
    size: 28,
    font: helveticaItalic,
    color: colors.text,
  });

  page.drawText('Portrait & Street Photography | Bengaluru, IN', {
    x: margin,
    y: height - margin - 60,
    size: 8,
    font: helveticaFont,
    color: colors.muted,
  });
  
  // Divider
  page.drawLine({
    start: { x: margin, y: height - margin - 85 },
    end: { x: width - margin, y: height - margin - 85 },
    thickness: 1,
    color: colors.border,
  });

  // Invoice Details
  page.drawText('Invoice Date:', { x: width - margin - 140, y: height - margin - 110, size: 8, font: helveticaBold, color: colors.muted });
  page.drawText(new Date().toLocaleDateString('en-IN'), { x: width - margin - 75, y: height - margin - 110, size: 8, font: helveticaFont, color: colors.text });

  page.drawText('Booking ID:', { x: width - margin - 140, y: height - margin - 125, size: 8, font: helveticaBold, color: colors.muted });
  page.drawText(booking.id.split('-')[0].toUpperCase(), { x: width - margin - 75, y: height - margin - 125, size: 8, font: helveticaFont, color: colors.text });

  // 2. CLIENT SECTION
  page.drawText('BILLED TO', { x: margin, y: height - margin - 110, size: 8, font: helveticaBold, color: colors.muted });
  page.drawText(booking.client.name, { x: margin, y: height - margin - 130, size: 14, font: helveticaFont, color: colors.text });
  page.drawText(booking.client.email.toLowerCase(), { x: margin, y: height - margin - 142, size: 9, font: helveticaFont, color: colors.muted });

  // 3. TABLE HEADER
  page.drawLine({
    start: { x: margin, y: height - 250 },
    end: { x: width - margin, y: height - 250 },
    thickness: 1,
    color: colors.border,
  });

  page.drawText('DESCRIPTION', { x: margin, y: height - 270, size: 8, font: helveticaBold, color: colors.muted });
  page.drawText('AMOUNT (INR)', { x: width - margin - 70, y: height - 270, size: 8, font: helveticaBold, color: colors.muted });

  page.drawLine({
    start: { x: margin, y: height - 280 },
    end: { x: width - margin, y: height - 280 },
    thickness: 1,
    color: colors.border,
  });

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // 4. ITEMS
  let currentY = height - 310;
  
  page.drawText(`Photography Session (${booking.enquiry.projectType})`, { x: margin, y: currentY, size: 10, font: helveticaFont, color: colors.text });
  page.drawText(formatCurrency(booking.amount), { x: width - margin - 70, y: currentY, size: 10, font: helveticaFont, color: colors.text });

  currentY -= 30;
  page.drawText('Advance Received (30%)', { x: margin, y: currentY, size: 10, font: helveticaFont, color: colors.muted });
  page.drawText(`- ${formatCurrency(booking.amount * 0.3)}`, { x: width - margin - 70, y: currentY, size: 10, font: helveticaFont, color: colors.accent });

  const isFullyPaid = booking.paymentStatus === 'FULLY_PAID';

  if (isFullyPaid) {
    currentY -= 20;
    page.drawText('Final Payment (70%)', { x: margin, y: currentY, size: 10, font: helveticaFont, color: colors.muted });
    page.drawText(`- ${formatCurrency(booking.amount * 0.7)}`, { x: width - margin - 70, y: currentY, size: 10, font: helveticaFont, color: colors.accent });
  }

  currentY -= 40;
  page.drawLine({ start: { x: width - margin - 150, y: currentY + 15 }, end: { x: width - margin, y: currentY + 15 }, thickness: 1, color: colors.border });

  // 5. SUMMARY
  if (isFullyPaid) {
    page.drawText('TOTAL PAID', { x: width - margin - 150, y: currentY, size: 10, font: helveticaBold, color: colors.muted });
    page.drawText(`INR ${formatCurrency(booking.amount)}`, { x: width - margin - 80, y: currentY, size: 14, font: helveticaBold, color: colors.accent });
    
    currentY -= 25;
    page.drawText('OUTSTANDING', { x: width - margin - 150, y: currentY, size: 8, font: helveticaBold, color: colors.muted });
    page.drawText('INR 0.00', { x: width - margin - 80, y: currentY, size: 8, font: helveticaFont, color: colors.text });
  } else {
    page.drawText('BALANCE DUE', { x: width - margin - 150, y: currentY, size: 10, font: helveticaBold, color: colors.muted });
    page.drawText(`INR ${formatCurrency(booking.amount * 0.7)}`, { x: width - margin - 80, y: currentY, size: 14, font: helveticaBold, color: colors.accent });
  }

  // 6. STATUS STAMP
  const stampY = 100;
  page.drawRectangle({
    x: margin,
    y: stampY - 10,
    width: 120,
    height: 30,
    borderColor: isFullyPaid ? colors.accent : colors.muted,
    borderWidth: 1,
  });
  
  page.drawText(isFullyPaid ? 'PAID IN FULL' : 'PAYMENT PENDING', {
    x: margin + 15,
    y: stampY + 2,
    size: 8,
    font: helveticaBold,
    color: isFullyPaid ? colors.accent : colors.muted,
  });

  // Footer
  page.drawText('Thank you for choosing weareunfnsd studio. For support, reply to this invoice.', {
    x: margin,
    y: 50,
    size: 7,
    font: helveticaFont,
    color: colors.muted,
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  return await pdfDoc.save();
}
