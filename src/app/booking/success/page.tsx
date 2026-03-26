"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const type = searchParams.get("type") || "advance"; // fallback to advance
  
  // Format the amount with a fallback to "?" if missing
  const parsedAmount = amount ? parseInt(amount, 10) : 0;
  const formattedAmount = parsedAmount > 0 
    ? parsedAmount.toLocaleString('en-IN') 
    : (type === "full" ? "Final Balance" : "30% Advance");

  const isFullPayment = type === "full";

  return (
    <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
      
      {/* Success Indicator */}
      <div className="w-12 h-12 rounded-full border border-success flex items-center justify-center mb-8 text-success shadow-[0_0_30px_rgba(74,158,107,0.2)]">
        ✓
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-success mb-4">
        Payment Confirmed
      </p>
      
      <h1 className="font-display text-5xl md:text-6xl italic font-light mb-6">
        {isFullPayment ? "Gallery Unlocked." : "You're booked."}
      </h1>
      
      <p className="font-body text-text-muted text-lg mb-12 max-w-md">
        {isFullPayment 
          ? "Your final payment has been processed. You can now access your high-resolution gallery."
          : "Your session is locked in. I've sent a detailed confirmation and preparation guide to your email."
        }
      </p>

      <div className="w-full border-t border-border-glass pt-8 flex flex-col gap-4">
        <div className="flex justify-between font-mono text-xs">
          <span className="text-text-muted uppercase tracking-widest">Status</span>
          <span className="text-white">
            {isFullPayment ? "FULLY PAID" : "ADVANCE PAID"} (₹{formattedAmount})
          </span>
        </div>
        <div className="flex justify-between font-mono text-xs">
          <span className="text-text-muted uppercase tracking-widest">Next Step</span>
          <span className="text-white">
            {isFullPayment ? "View your gallery" : "Check your inbox"}
          </span>
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
  );
}

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-[800px] h-[800px] border rounded-full border-white"></div>
        <div className="absolute w-[600px] h-[600px] border rounded-full border-white"></div>
      </div>

      <Suspense fallback={<div className="font-mono text-xs text-text-muted">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}