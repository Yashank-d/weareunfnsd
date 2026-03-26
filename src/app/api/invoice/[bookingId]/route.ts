import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/pdf';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const resolvedParams = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: resolvedParams.bookingId },
      include: { client: true, enquiry: true, slot: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Use shared utility to generate PDF bytes
    const pdfBytes = await generateInvoicePDF(booking as any);

    // Return the PDF directly as a file download
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${booking.id.split('-')[0]}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
