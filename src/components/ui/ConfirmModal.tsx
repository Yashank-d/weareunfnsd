"use client";

import Modal from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Confirm", 
  isDanger = false 
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col text-left">
        <h3 className="font-display text-2xl italic mb-3 text-white">
          {title}
        </h3>
        
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onConfirm}
            className={`flex-1 py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
              isDanger 
                ? "bg-danger border-danger text-white hover:bg-transparent hover:text-danger" 
                : "bg-accent border-accent text-black hover:bg-transparent hover:text-accent"
            }`}
          >
            {confirmLabel}
          </button>
          
          <button 
            onClick={onClose}
            className="flex-1 border border-white/10 text-white/50 py-4 font-mono text-[10px] uppercase tracking-[0.2em] hover:text-white hover:border-white transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
