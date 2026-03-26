import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendBookingConfirmation(
  clientEmail: string, 
  clientName: string, 
  projectType: string,
  date: Date,
  time: string,
  amount: number
) {
  const formattedDate = date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const displayAmount = `₹${(amount / 100).toLocaleString('en-IN')}`; // Convert paise back to INR

  const mailOptions = {
    from: `"Yashank D." <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: `Booking Confirmed: ${projectType} Session with Yashank D.`,
    html: `
      <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; background-color: #0D0D0D; color: #EDEDED; padding: 40px; border: 1px solid #333;">
        
        <h1 style="font-family: Georgia, serif; font-style: italic; font-weight: 300; font-size: 32px; margin-bottom: 10px;">
          You're locked in, ${clientName.split(' ')[0]}.
        </h1>
        
        <p style="color: #6B6560; font-size: 14px; margin-bottom: 40px;">
          Your payment has been received and your session is officially on the calendar.
        </p>

        <div style="border-top: 1px solid #333; border-bottom: 1px solid #333; padding: 20px 0; margin-bottom: 40px;">
          <table style="width: 100%; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
            <tr>
              <td style="color: #6B6560; padding-bottom: 10px;">Project Type</td>
              <td style="text-align: right; padding-bottom: 10px;">${projectType}</td>
            </tr>
            <tr>
              <td style="color: #6B6560; padding-bottom: 10px;">Date</td>
              <td style="text-align: right; padding-bottom: 10px;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="color: #6B6560; padding-bottom: 10px;">Time</td>
              <td style="text-align: right; padding-bottom: 10px;">${time}</td>
            </tr>
            <tr>
              <td style="color: #6B6560;">Amount Paid</td>
              <td style="text-align: right; color: #C6FF00;">${displayAmount}</td>
            </tr>
          </table>
        </div>

        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #6B6560;">Preparation Notes</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #ccc;">
          I will reach out 48 hours before our shoot to finalize the exact location coordinates and moodboard. If you have any immediate questions, simply reply to this email.
        </p>

        <div style="margin-top: 60px; font-size: 10px; color: #6B6560; text-transform: uppercase; letter-spacing: 2px;">
          Yashank D. — Portrait & Street<br/>
          Bengaluru, IN
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to", clientEmail);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Failed to send email" };
  }
}

export async function sendGalleryDeliveryEmail(
  clientEmail: string,
  clientName: string,
  galleryLink: string,
  galleryPassword?: string
) {
  const mailOptions = {
    from: `"Yashank D." <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: `Your Gallery is Ready | Yashank D. Photography`,
    html: `
      <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; background-color: #0D0D0D; color: #EDEDED; padding: 40px; border: 1px solid #333;">
        
        <h1 style="font-family: Georgia, serif; font-style: italic; font-weight: 300; font-size: 32px; margin-bottom: 10px;">
          The wait is over, ${clientName.split(' ')[0]}.
        </h1>
        
        <p style="color: #6B6560; font-size: 14px; margin-bottom: 40px;">
          Your final, edited photographs are fully rendered and ready for viewing. 
        </p>

        <div style="text-align: center; margin: 50px 0;">
          <a href="${galleryLink}" style="background-color: #C6FF00; color: #000; padding: 15px 30px; text-decoration: none; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
            View Full Gallery
          </a>
        </div>

        ${galleryPassword ? `
        <div style="border-top: 1px solid #333; border-bottom: 1px solid #333; padding: 20px 0; margin-bottom: 40px; text-align: center;">
          <p style="color: #6B6560; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Access Password</p>
          <p style="font-size: 18px; color: #EDEDED; margin: 0; letter-spacing: 4px;">${galleryPassword}</p>
        </div>
        ` : ''}

        <p style="font-size: 14px; line-height: 1.6; color: #ccc;">
          It was an absolute pleasure working with you. If you share these on Instagram, I'd appreciate a tag <a href="https://instagram.com/weareunfnsd" style="color: #C6FF00; text-decoration: none;">@weareunfnsd</a>.
        </p>

        <div style="margin-top: 60px; font-size: 10px; color: #6B6560; text-transform: uppercase; letter-spacing: 2px;">
          Yashank D. — Portrait & Street<br/>
          Bengaluru, IN
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending delivery email:", error);
    return { error: "Failed to send email" };
  }
}