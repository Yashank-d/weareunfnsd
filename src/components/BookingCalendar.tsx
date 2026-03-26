"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyPayment } from "@/app/actions";

// Define the shape of the slot data coming from your database
type Slot = {
  id: string;
  date: Date;
  startTime: string;
  isBooked: boolean;
};

// Helper functions for calendar logic
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const MONTH_NAMES = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

// Razorpay Script Loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingCalendar({ 
  enquiryId, 
  availableSlots 
}: { 
  enquiryId: string, 
  availableSlots: Slot[] 
}) {
  const router = useRouter();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // --- DYNAMIC DATA FILTERING ---
  
  // 1. Find which days in the currently viewed month actually have open slots
  const daysWithSlots = availableSlots
    .filter(slot => {
      const d = new Date(slot.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .map(slot => new Date(slot.date).getDate());

  // Remove duplicates so we just have an array of valid day numbers (e.g., [14, 22])
  const activeDays = Array.from(new Set(daysWithSlots));

  // 2. When a user clicks a specific date, get the exact times you are available that day
  const timeSlotsForSelectedDate = availableSlots
    .filter(slot => {
      const d = new Date(slot.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDate;
    })
    .map(slot => slot.startTime);

  // --- HANDLERS ---

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateClick = (day: number) => {
    if (activeDays.includes(day)) {
      setSelectedDate(day);
      setSelectedTime(null); // Reset time selection when switching dates
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      setIsProcessing(false);
      return;
    }

    const orderData = await createRazorpayOrder(3500, enquiryId);
    
    if (orderData.error || !orderData.orderId) {
      alert("Could not initialize payment. Please try again.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      amount: orderData.amount,
      currency: "INR",
      name: "Yashank D.",
      description: "Photography Session Booking",
      order_id: orderData.orderId,
      
      handler: async function (response: any) {
        console.log("Payment received by Razorpay, verifying on backend...");
        
        const result = await verifyPayment(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature,
          enquiryId,
          selectedDate as number,
          selectedTime as string
        );

        if (result.success) {
          router.push("/booking/success");
        } else {
          alert("Payment verification failed: " + result.error);
        }
      },
      theme: {
        color: "#C6FF00",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    
    setIsProcessing(false); 
  };

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-border-glass pb-4">
        <span className="font-mono text-xs tracking-widest text-text-primary">
          {MONTH_NAMES[month]} {year}
        </span>
        <div className="flex gap-4 font-mono text-text-muted">
          <button onClick={handlePrevMonth} className="hover:text-accent transition-colors">&larr;</button>
          <button onClick={handleNextMonth} className="hover:text-accent transition-colors">&rarr;</button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-y-4 text-center">
        {DAYS.map(day => (
          <div key={day} className="font-mono text-[10px] text-text-muted mb-2">{day}</div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isAvailable = activeDays.includes(day); // Dynamic check
          const isSelected = selectedDate === day;

          return (
            <div key={day} className="flex justify-center items-center h-10">
              <button
                disabled={!isAvailable}
                onClick={() => handleDateClick(day)}
                className={`
                  relative w-8 h-8 flex justify-center items-center font-mono text-xs transition-all duration-300
                  ${!isAvailable ? 'text-text-muted/30 cursor-not-allowed line-through' : 'text-text-primary hover:bg-white/5'}
                  ${isSelected ? 'bg-accent text-black hover:bg-accent' : ''}
                `}
              >
                {day}
                {isAvailable && !isSelected && <span className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full"></span>}
              </button>
            </div>
          );
        })}
      </div>

      {/* TIME SLOTS */}
      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col gap-4 border-t border-border-glass pt-6 mt-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Select a Time</span>
          <div className="flex flex-wrap gap-3">
            {timeSlotsForSelectedDate.length > 0 ? (
              timeSlotsForSelectedDate.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    font-mono text-[11px] px-4 py-2 transition-colors border
                    ${selectedTime === time ? 'bg-accent text-black border-accent' : 'border-border-glass text-text-primary hover:border-accent/50'}
                  `}
                >
                  {time}
                </button>
              ))
            ) : (
              <span className="font-mono text-[10px] text-text-muted">No slots available on this date.</span>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT BUTTON */}
      <div className="mt-8">
        <button 
          onClick={handlePayment}
          disabled={!selectedDate || !selectedTime || isProcessing}
          className={`
            w-full py-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300 border
            ${selectedDate && selectedTime 
              ? 'border-accent text-accent hover:bg-accent hover:text-black' 
              : 'border-border-glass text-text-muted opacity-50 cursor-not-allowed'}
          `}
        >
          {isProcessing ? 'PROCESSING...' : (selectedDate && selectedTime ? 'PROCEED TO PAYMENT' : 'SELECT DATE & TIME')}
        </button>
      </div>

    </div>
  );
}