"use client";

import { useState } from "react";

export default function CopyLink({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`
        font-mono text-[9px] uppercase tracking-widest px-2 py-1 border transition-all duration-300
        ${copied 
          ? 'bg-success/20 text-success border-success/40' 
          : 'bg-white/5 text-[#E09F4A] border-white/10 hover:border-[#E09F4A]/50 hover:bg-[#E09F4A]/10'}
      `}
      title={value}
    >
      {copied ? "COPIED" : "PAY LINK"}
    </button>
  );
}
