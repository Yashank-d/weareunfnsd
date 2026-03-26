"use client";

import Modal from "./Modal";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "error";
  title: string;
  message: string;
}

export default function StatusModal({ isOpen, onClose, status, title, message }: StatusModalProps) {
  const isSuccess = status === "success";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {/* Success Icon (Check) */}
        {isSuccess ? (
          <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          /* Error Icon (X) */
          <div className="w-16 h-16 rounded-full border-2 border-danger flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-danger shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        <h3 className="font-display text-2xl italic mb-2 text-white">
          {title}
        </h3>
        
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted mb-8 leading-relaxed max-w-[250px]">
          {message}
        </p>

        <button 
          onClick={onClose}
          className="w-full border border-white/10 text-white/70 py-3 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-300"
        >
          Dismiss
        </button>
      </div>
    </Modal>
  );
}
