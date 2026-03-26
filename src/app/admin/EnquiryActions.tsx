"use client";

import { useState } from "react";
import { updateEnquiryStatus } from "@/app/actions";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface EnquiryActionsProps {
  enquiryId: string;
  clientName: string;
}

export default function EnquiryActions({ enquiryId, clientName }: EnquiryActionsProps) {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");

  const handleReject = async () => {
    setIsProcessing(true);
    await updateEnquiryStatus(enquiryId, "REJECTED");
    setIsRejectModalOpen(false);
    setIsProcessing(false);
    // Refresh triggered via revalidatePath in the action
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const amount = quoteAmount ? parseInt(quoteAmount, 10) : undefined;
    await updateEnquiryStatus(enquiryId, "APPROVED", amount);
    setIsProcessing(false);
  };

  return (
    <div className="flex items-center justify-end gap-3">
      {/* Reject Button */}
      <button 
        onClick={() => setIsRejectModalOpen(true)}
        disabled={isProcessing}
        className="font-mono text-[10px] text-danger hover:underline uppercase tracking-widest disabled:opacity-50"
      >
        Reject
      </button>

      {/* Approve Form */}
      <form onSubmit={handleApprove} className="flex items-center gap-3">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-white/50 font-mono text-xs">₹</span>
          <input 
            type="number" 
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            placeholder="Amount" 
            className="w-32 bg-black/40 border border-white/20 text-sm font-mono pl-7 pr-3 py-2 text-white outline-none focus:border-accent focus:bg-white/5 transition-all hide-arrows" 
            required 
          />
        </div>
        <button 
          type="submit" 
          disabled={isProcessing}
          className="font-mono text-xs text-accent border border-accent px-4 py-2 hover:bg-accent hover:text-black transition-colors uppercase tracking-widest disabled:opacity-50"
        >
          {isProcessing ? "..." : "Approve"}
        </button>
      </form>

      {/* Confirm Reject Modal */}
      <ConfirmModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReject}
        title="Reject Enquiry"
        message={`Are you sure you want to reject the enquiry from ${clientName}? This action cannot be undone.`}
        confirmLabel="Reject Enquiry"
        isDanger={true}
      />
    </div>
  );
}
