import prisma from "@/lib/prisma";
import DeliveryModal from "@/components/DeliveryModal";

export default async function AdminBookings() {
  // Fetch all bookings that have been PAID, along with client and slot info
  const bookings = await prisma.booking.findMany({
    where: { paymentStatus: "PAID" },
    include: { 
      client: true,
      enquiry: true,
      slot: true 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted border-b border-border-glass pb-4">
          Confirmed Bookings & Deliveries
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left font-body text-sm">
          <thead>
            <tr className="border-b border-border-glass font-mono text-[10px] uppercase tracking-widest text-text-muted">
              <th className="pb-4 font-normal">Client</th>
              <th className="pb-4 font-normal">Session Type</th>
              <th className="pb-4 font-normal">Shoot Date</th>
              <th className="pb-4 font-normal">Amount</th>
              <th className="pb-4 font-normal">Delivery Status</th>
              <th className="pb-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                
                <td className="py-6 pr-4">
                  <div className="font-medium text-white">{booking.client.name}</div>
                  <div className="font-mono text-[10px] text-text-muted mt-1">{booking.client.email}</div>
                </td>
                
                <td className="py-6 pr-4 font-mono text-xs text-white/80 uppercase tracking-wider">
                  {booking.enquiry.projectType}
                </td>
                
                <td className="py-6 pr-4">
                  <div className="text-white">{new Date(booking.slot.date).toLocaleDateString()}</div>
                  <div className="font-mono text-[10px] text-text-muted mt-1">{booking.slot.startTime}</div>
                </td>
                
                <td className="py-6 pr-4 font-mono text-xs text-white/80">
                  ₹{(booking.amount / 100).toLocaleString('en-IN')}
                </td>
                
                <td className="py-6 pr-4">
                  {booking.galleryLink ? (
                     <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 border rounded-sm bg-success/10 text-success border-success/20">
                       DELIVERED
                     </span>
                  ) : (
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 border rounded-sm bg-[#E09F4A]/10 text-[#E09F4A] border-[#E09F4A]/20">
                      PENDING EDIT
                    </span>
                  )}
                </td>
                
                <td className="py-6 text-right">
                  {!booking.galleryLink ? (
                    <DeliveryModal bookingId={booking.id} clientName={booking.client.name} />
                  ) : (
                    <a href={booking.galleryLink} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-text-muted hover:text-white underline uppercase tracking-widest">
                      View Gallery
                    </a>
                  )}
                </td>
                
              </tr>
            ))}
            
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center font-mono text-xs text-text-muted uppercase tracking-widest">
                  No confirmed bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}