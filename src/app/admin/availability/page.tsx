import prisma from "@/lib/prisma";
import { createAvailabilitySlot, deleteAvailabilitySlot } from "@/app/actions";

export default async function AdminAvailability() {
  // Fetch all slots that haven't been booked yet, sorted by closest date
  const openSlots = await prisma.availability.findMany({
    where: { isBooked: false },
    orderBy: { date: "asc" },
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
      
      {/* LEFT COLUMN: The Add Slot Form */}
      <div className="w-full md:w-1/3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted border-b border-border-glass pb-4 mb-8">
          Add Open Slot
        </h2>
        
        <form action={async (formData) => { "use server"; await createAvailabilitySlot(formData); }} className="flex flex-col gap-8 bg-bg-surface p-6 border border-border-glass">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Select Date</label>
            <input 
              type="date" 
              name="date" 
              required 
              className="w-full bg-transparent border-b border-border-glass py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Start Time</label>
            <select name="startTime" required defaultValue="" className="w-full bg-transparent border-b border-border-glass py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent appearance-none rounded-none">
              <option value="" disabled className="text-black">Select a time...</option>
              <option value="08:00 AM" className="text-black">08:00 AM</option>
              <option value="10:00 AM" className="text-black">10:00 AM</option>
              <option value="01:00 PM" className="text-black">01:00 PM</option>
              <option value="04:00 PM" className="text-black">04:00 PM</option>
              <option value="06:00 PM" className="text-black">06:00 PM</option>
            </select>
          </div>

          <button type="submit" className="border border-accent text-accent py-3 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all">
            ADD TO CALENDAR
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: The Existing Slots */}
      <div className="w-full md:w-2/3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted border-b border-border-glass pb-4 mb-8">
          Current Availability
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {openSlots.map((slot) => (
            <div key={slot.id} className="border border-border-glass p-4 flex justify-between items-center group hover:border-white/20 transition-colors">
              <div>
                <div className="font-medium text-white mb-1">
                  {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="font-mono text-[10px] text-accent tracking-widest">
                  {slot.startTime}
                </div>
              </div>
              
              <form action={async () => { "use server"; await deleteAvailabilitySlot(slot.id); }}>
                <button className="text-text-muted hover:text-danger font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  [X]
                </button>
              </form>
            </div>
          ))}

          {openSlots.length === 0 && (
            <div className="col-span-full py-12 text-center font-mono text-xs text-text-muted uppercase tracking-widest border border-dashed border-border-glass">
              Your calendar is completely booked/empty.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}