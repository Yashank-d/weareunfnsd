import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-[800px] h-[800px] border rounded-full border-white"></div>
        <div className="absolute w-[600px] h-[600px] border rounded-full border-white"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
        
        {/* Success Indicator */}
        <div className="w-12 h-12 rounded-full border border-success flex items-center justify-center mb-8 text-success shadow-[0_0_30px_rgba(74,158,107,0.2)]">
          ✓
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-success mb-4">
          Payment Confirmed
        </p>
        
        <h1 className="font-display text-5xl md:text-6xl italic font-light mb-6">
          You're booked.
        </h1>
        
        <p className="font-body text-text-muted text-lg mb-12 max-w-md">
          Your session is locked in. I've sent a detailed confirmation and preparation guide to your email.
        </p>

        <div className="w-full border-t border-border-glass pt-8 flex flex-col gap-4">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-text-muted uppercase tracking-widest">Status</span>
            <span className="text-white">PAID (₹3,500)</span>
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-text-muted uppercase tracking-widest">Next Step</span>
            <span className="text-white">Check your inbox</span>
          </div>
        </div>

        <Link 
          href="/"
          className="mt-16 group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-text-muted hover:text-white transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span>Return to Portfolio</span>
        </Link>
      </div>
    </main>
  );
}