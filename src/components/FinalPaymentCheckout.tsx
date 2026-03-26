"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFinalPaymentOrder, verifyFinalPayment } from "@/app/actions";
import StatusModal from "./ui/StatusModal";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function FinalPaymentCheckout({ 
  bookingId, 
  remainingAmount 
}: { 
  bookingId: string, 
  remainingAmount: number 
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusModal, setStatusModal] = useState<{ open: boolean, type: "success" | "error", title: string, message: string }>({
    open: false,
    type: "success",
    title: "",
    message: ""
  });

  const handlePayment = async () => {
    setIsProcessing(true);

    const res = await loadRazorpayScript();
    if (!res) {
      setStatusModal({
        open: true,
        type: "error",
        title: "Connection Error",
        message: "Razorpay SDK failed to load. Please check your internet connection."
      });
      setIsProcessing(false);
      return;
    }

    const orderData = await createFinalPaymentOrder(remainingAmount, bookingId);
    
    if (orderData.error || !orderData.orderId) {
      setStatusModal({
        open: true,
        type: "error",
        title: "Order Failed",
        message: "Could not initialize payment. Please try again."
      });
      setIsProcessing(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount: orderData.amount,
      currency: "INR",
      name: "Yashank D.",
      description: "Final Project Payment",
      order_id: orderData.orderId,
      
      handler: async function (response: any) {
        const result = await verifyFinalPayment(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature,
          bookingId
        );

        if (result.success) {
          router.push(`/booking/success?type=full&amount=${Math.round(remainingAmount)}`);
        } else {
          setStatusModal({
            open: true,
            type: "error",
            title: "Verification Failed",
            message: "Payment was successful, but verification failed: " + result.error
          });
        }
      },
      theme: { color: "#C6FF00" },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    
    setIsProcessing(false); 
  };

  return (
    <>
      <button 
        onClick={handlePayment}
        disabled={isProcessing}
        className={`
          w-full py-4 mt-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300 border
          border-accent text-accent hover:bg-accent hover:text-black
        `}
      >
        {isProcessing ? 'PROCESSING...' : 'PROCESS FINAL PAYMENT'}
      </button>

      <StatusModal 
        isOpen={statusModal.open}
        onClose={() => setStatusModal(prev => ({ ...prev, open: false }))}
        status={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </>
  );
}
