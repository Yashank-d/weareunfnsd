"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import Razorpay from "razorpay";
import { sendEnquiryApprovedEmail, sendBookingConfirmation, sendGalleryDeliveryEmail, sendFinalPaymentRequestEmail } from "@/lib/mail";
import { generateInvoicePDF } from "@/lib/pdf";

// 1. Submit Enquiry (From the Public Portfolio)
export async function submitEnquiry(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const instagramId = formData.get("instagramId") as string;
  const projectType = formData.get("projectType") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !projectType) {
    return { error: "Missing required fields." };
  }

  try {
    const client = await prisma.client.upsert({
      where: { email },
      update: { name, instagramId },
      create: { name, email, instagramId },
    });

    await prisma.enquiry.create({
      data: {
        clientId: client.id,
        projectType,
        message: message || "No additional details provided.",
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to submit enquiry." };
  }
}

// 2. Approve/Reject & Generate Token (From the Admin Dashboard)
export async function updateEnquiryStatus(enquiryId: string, newStatus: "APPROVED" | "REJECTED", quoteAmount?: number) {
  try {
    let bookingToken = null;

    if (newStatus === "APPROVED") {
      bookingToken = crypto.randomBytes(16).toString("hex");
    }

    const updatedEnquiry = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { 
        status: newStatus, 
        bookingToken,
        quoteAmount: quoteAmount || null
      },
      include: { client: true }
    });
    
    if (newStatus === "APPROVED") {
      console.log(`\n🎉 SUCCESS! Send this link to ${updatedEnquiry.client.name}:`);
      console.log(`http://localhost:3000/book/${bookingToken}\n`);
      
      if (updatedEnquiry.quoteAmount && bookingToken) {
        await sendEnquiryApprovedEmail(
          updatedEnquiry.client.email,
          updatedEnquiry.client.name,
          updatedEnquiry.projectType,
          updatedEnquiry.quoteAmount,
          bookingToken
        );
      }
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { error: "Failed to update status." };
  }
}

// 3. Create Razorpay Order (From the Client Booking Portal)
export async function createRazorpayOrder(amount: number, enquiryId: string) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Math.round(amount * 100), // INR to PAISE (Must be integer)
      currency: "INR",
      receipt: `rcpt_${enquiryId.substring(0, 30)}`, 
    };

    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id, amount: order.amount };
  } catch (error) {
    console.error("Razorpay Error:", error);
    return { error: "Failed to create payment order." };
  }
}

export async function verifyPayment(
  paymentId: string,
  orderId: string,
  signature: string,
  enquiryId: string,
  selectedDate: number,
  selectedTime: string
) {
  try {
    // 1. Verify the cryptographic signature from Razorpay
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return { error: "Invalid payment signature. Payment rejected." };
    }

    // 2. Get the Enquiry details
    const enquiry = await prisma.enquiry.findUnique({ 
  where: { id: enquiryId },
  include: { client: true } // THIS IS THE MAGIC LINE
});
    if (!enquiry) return { error: "Enquiry not found" };

    // 3. Create a locked Availability Slot
    // (We use the current month/year for this example)
    const today = new Date();
    const sessionDate = new Date(today.getFullYear(), today.getMonth(), selectedDate);

    const slot = await prisma.availability.create({
      data: {
        date: sessionDate,
        startTime: selectedTime,
        endTime: "TBD", 
        isBooked: true // Lock it so no one else can book this!
      }
    });

    // 4. Create the official Booking Record
    const booking = await prisma.booking.create({
      data: {
        enquiryId: enquiry.id,
        clientId: enquiry.clientId,
        slotId: slot.id,
        amount: enquiry.quoteAmount || 350000, 
        paymentStatus: "ADVANCE_PAID",
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId
      },
      include: { client: true, enquiry: true, slot: true }
    });

    // Generate Invoice PDF
    const pdfBytes = await generateInvoicePDF(booking as any);

    // 5. SEND THE AUTOMATED EMAIL!
    await sendBookingConfirmation(
      enquiry.client.email,
      enquiry.client.name,
      enquiry.projectType,
      sessionDate,
      selectedTime,
      (enquiry.quoteAmount || 350000),
      [{
        filename: `Invoice-${booking.id.split('-')[0].toUpperCase()}.pdf`,
        content: Buffer.from(pdfBytes)
      }]
    );

    return { success: true };
  } catch (error) {
    console.error("Verification Error:", error);
    return { error: "Failed to verify and save booking." };
  }
}

// 4. Create Razorpay Order for Final 70% Payment
export async function createFinalPaymentOrder(amount: number, bookingId: string) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Math.round(amount * 100), // INR to PAISE (Must be integer)
      currency: "INR",
      receipt: `final_${bookingId.substring(0, 30)}`, 
    };

    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id, amount: order.amount };
  } catch (error) {
    console.error("Razorpay Error:", error);
    return { error: "Failed to create final payment order." };
  }
}

export async function verifyFinalPayment(
  paymentId: string,
  orderId: string,
  signature: string,
  bookingId: string
) {
  try {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return { error: "Invalid payment signature." };
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "FULLY_PAID",
        finalOrderId: orderId,
        finalPaymentId: paymentId
      },
      include: { client: true, enquiry: true, slot: true }
    });

    // Generate Fresh "Paid in Full" Invoice PDF
    const pdfBytes = await generateInvoicePDF(booking as any);

    if (booking.galleryLink) {
      await sendGalleryDeliveryEmail(
        booking.client.email,
        booking.client.name,
        booking.galleryLink,
        booking.galleryPassword || undefined,
        [{
          filename: `Invoice-Final-${booking.id.split('-')[0].toUpperCase()}.pdf`,
          content: Buffer.from(pdfBytes)
        }]
      );
    }

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Final Verification Error:", error);
    return { error: "Failed to verify final payment." };
  }
}

export async function requestFinalPaymentForGallery(bookingId: string, link: string, password?: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        galleryLink: link,
        galleryPassword: password || null,
      },
      include: { client: true }
    });

    await sendFinalPaymentRequestEmail(
      booking.client.email,
      booking.client.name,
      booking.id
    );

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Failed to request final payment:", error);
    return { error: "Failed to process gallery link." };
  }
}

export async function deliverGallery(bookingId: string, link: string, password?: string) {
  try {
    // 1. Update the booking with the links
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        galleryLink: link,
        galleryPassword: password || null,
      },
      include: { client: true }
    });

    // 2. Send the automated email
    await sendGalleryDeliveryEmail(
      booking.client.email,
      booking.client.name,
      link,
      password
    );

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error) {
    console.error("Failed to deliver gallery:", error);
    return { error: "Failed to deliver gallery." };
  }
}

// --- AVAILABILITY ACTIONS ---

export async function createAvailabilitySlot(formData: FormData) {
  const dateStr = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;

  if (!dateStr || !startTime) return { error: "Missing fields" };

  try {
    // Force the date to be interpreted at noon to avoid timezone shift issues
    const [year, month, day] = dateStr.split('-');
    const sessionDate = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);

    await prisma.availability.create({
      data: {
        date: sessionDate,
        startTime,
        endTime: "TBD", // Per our schema
        isBooked: false,
      },
    });

    revalidatePath("/admin/availability");
    return { success: true };
  } catch (error) {
    console.error("Failed to create slot:", error);
    return { error: "Failed to create availability slot." };
  }
}

export async function deleteAvailabilitySlot(id: string) {
  try {
    await prisma.availability.delete({ where: { id } });
    revalidatePath("/admin/availability");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete slot." };
  }
}