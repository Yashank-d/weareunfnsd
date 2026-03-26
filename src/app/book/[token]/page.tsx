import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingCalendar from "@/components/BookingCalendar";

export default async function BookingPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = await params;

  // 1. Authenticate the enquiry via token
  const enquiry = await prisma.enquiry.findUnique({
    where: { bookingToken: resolvedParams.token },
    include: { client: true }
  });

  if (!enquiry || enquiry.status !== "APPROVED") {
    notFound(); 
  }

  // 2. Fetch all future open slots from the database
  const availableSlots = await prisma.availability.findMany({
    where: { 
      isBooked: false,
      date: { gte: new Date() } // Only get dates from today onwards
    },
    orderBy: { date: 'asc' }
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-2xl bg-bg-surface border border-border-glass p-8 md:p-16 relative">
        
        <div className="absolute top-8 left-8 w-2 h-2 bg-accent rounded-full"></div>

        <div className="mb-12 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
            Secure Booking Portal
          </p>
          <h1 className="font-display text-4xl md:text-5xl italic font-light mb-2">
            Hi {enquiry.client.name.split(' ')[0]},
          </h1>
          <p className="font-body text-text-muted text-lg">
            Let's lock in your session.
          </p>
        </div>

        <div className="flex justify-between items-center border-y border-border-glass py-6 mb-12">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Project Type</span>
            <span className="font-mono text-xs uppercase tracking-wider text-white">{enquiry.projectType}</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">30% Advance</span>
            <span className="font-mono text-xs uppercase tracking-wider text-white">
              ₹{((enquiry.quoteAmount || 350000) * 0.3).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 3. Pass the fetched slots directly into the Calendar component */}
        <BookingCalendar 
          enquiryId={enquiry.id} 
          availableSlots={availableSlots} 
          quoteAmount={enquiry.quoteAmount || 350000} 
        />

      </div>
    </main>
  );
}