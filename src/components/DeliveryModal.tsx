"use client";

import { useState } from "react";
import { deliverGallery, requestFinalPaymentForGallery } from "@/app/actions";
import StatusModal from "./ui/StatusModal";

export default function DeliveryModal({ bookingId, clientName, paymentStatus }: { bookingId: string, clientName: string, paymentStatus: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState("");
  const [password, setPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusModal, setStatusModal] = useState<{ open: boolean, type: "success" | "error", title: string, message: string }>({
    open: false,
    type: "success",
    title: "",
    message: ""
  });

  const isAdvancePaid = paymentStatus !== "FULLY_PAID";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    let res;
    if (isAdvancePaid) {
      res = await requestFinalPaymentForGallery(bookingId, link, password);
    } else {
      res = await deliverGallery(bookingId, link, password);
    }
    
    setIsSending(false);
    if (res.success) {
      setStatusModal({
        open: true,
        type: "success",
        title: isAdvancePaid ? "Payment Requested" : "Gallery Delivered",
        message: isAdvancePaid 
          ? `A final payment request has been dispatched to ${clientName}.` 
          : `The secure gallery link has been sent to ${clientName}.`
      });
      setIsOpen(false);
    } else {
      setStatusModal({
        open: true,
        type: "error",
        title: "Action Failed",
        message: "We encountered an error while processing the request. Please check your connection and try again."
      });
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="font-mono text-[10px] text-accent border border-accent px-3 py-1 hover:bg-accent hover:text-black transition-colors uppercase tracking-widest"
      >
        {isAdvancePaid ? "Upload Images & Request Final Pay" : "Deliver Images"}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-border-glass p-8 w-full max-w-md relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-white font-mono text-xs">X</button>
        
        <h3 className="font-display text-2xl italic mb-2">
          {isAdvancePaid ? "Add Gallery Link" : "Deliver Gallery"}
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-6">
          {isAdvancePaid ? `This sends an email to ${clientName} to pay the remaining 70% to unlock these images.` : `To: ${clientName}`}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Gallery URL (Pixieset/Drive)</label>
            <input 
              type="url" required value={link} onChange={e => setLink(e.target.value)}
              className="w-full bg-transparent border-b border-border-glass py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent" 
              placeholder="https://"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Password (Optional)</label>
            <input 
              type="text" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-border-glass py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent" 
              placeholder="Leave blank if public"
            />
          </div>

          <button 
            type="submit" disabled={isSending}
            className="mt-4 w-full border border-accent text-accent py-3 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all duration-300 disabled:opacity-50"
          >
            {isSending ? "PROCESSING..." : (isAdvancePaid ? "SEND PAYMENT REQUEST" : "DISPATCH GALLERY")}
          </button>
        </form>
      </div>
      
      <StatusModal 
        isOpen={statusModal.open}
        onClose={() => setStatusModal(prev => ({ ...prev, open: false }))}
        status={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </div>
  );
}