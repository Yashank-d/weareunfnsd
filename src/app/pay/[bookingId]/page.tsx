import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import FinalPaymentCheckout from "@/components/FinalPaymentCheckout";

export default async function FinalPaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = await params;

  // 1. Authenticate the booking via ID
  const booking = await prisma.booking.findUnique({
    where: { id: resolvedParams.bookingId },
    include: { client: true, enquiry: true, slot: true }
  });

  if (!booking) {
    notFound(); 
  }

  // If already fully paid
  if (booking.paymentStatus === "FULLY_PAID") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl bg-bg-surface border border-border-glass p-8 md:p-16 text-center">
          <h1 className="font-display text-3xl md:text-4xl italic font-light mb-4">Payment Complete</h1>
          <p className="font-body text-text-muted">Your final payment has already been made. Your gallery is ready for viewing!</p>
        </div>
      </main>
    );
  }

  // Calculate 70% remaining balance
  const remainingAmount = booking.amount * 0.7;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-2xl bg-bg-surface border border-border-glass p-8 md:p-16 relative">
        
        <div className="absolute top-8 left-8 w-2 h-2 bg-accent rounded-full"></div>

        <div className="mb-12 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
            Final Payment Portal
          </p>
          <h1 className="font-display text-4xl md:text-5xl italic font-light mb-2">
            Hi {booking.client.name.split(' ')[0]},
          </h1>
          <p className="font-body text-text-muted text-lg">
            Your gallery is almost ready.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-y border-border-glass py-6 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Project Type</span>
            <span className="font-mono text-xs uppercase tracking-wider text-white">{booking.enquiry.projectType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Shoot Date</span>
            <span className="font-mono text-xs uppercase tracking-wider text-white">{new Date(booking.slot.date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Total Quote</span>
            <span className="font-mono text-xs uppercase tracking-wider text-white">₹{booking.amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Advance Paid (30%)</span>
            <span className="font-mono text-xs uppercase tracking-wider text-success">₹{(booking.amount * 0.3).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center bg-white/5 p-4 mt-2">
            <span className="font-mono text-[12px] text-text-primary uppercase tracking-widest">Remaining Balance</span>
            <span className="font-mono text-sm uppercase tracking-wider text-accent font-bold">₹{remainingAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <FinalPaymentCheckout bookingId={booking.id} remainingAmount={remainingAmount} />

      </div>
    </main>
  );
}
