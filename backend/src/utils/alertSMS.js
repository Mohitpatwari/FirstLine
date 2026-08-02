// import axios from "axios";
// import { ApiError } from "./ApiError.js";

// const normalizePhone = (phone) => String(phone ?? "").replace(/\D/g, "").slice(-10);

// export const sendEmergencySMS = async ({ phones = [], message }) => {
//   const normalizedPhones = [...new Set(phones.map(normalizePhone).filter((item) => item.length === 10))];

//   if (!normalizedPhones.length) {
//     throw new ApiError(400, "No valid phone numbers to notify");
//   }

//   if (!message || !String(message).trim()) {
//     throw new ApiError(400, "SMS message is required");
//   }

//   const fastSmsApiKey = process.env.FAST2SMS_API_KEY;

//   if (!fastSmsApiKey) {
//     if (process.env.NODE_ENV !== "production") {
//       console.log(`[DEV ALERT SMS] ${normalizedPhones.join(",")}: ${message}`);
//       return {
//         success: true,
//         sentTo: normalizedPhones,
//         provider: "dev-log",
//       };
//     }

//     throw new ApiError(500, "Fast2SMS API key is not configured");
//   }

//   const payload = {
//     route: process.env.FAST2SMS_ROUTE || "q",
//     language: "english",
//     numbers: normalizedPhones.join(","),
//     message: String(message).slice(0, 159),
//   };

//   const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", payload, {
//     headers: {
//       authorization: fastSmsApiKey,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response?.data?.return) {
//     throw new ApiError(500, `Failed to send alert SMS: ${response?.data?.message || "Unknown error"}`);
//   }

//   return {
//     success: true,
//     sentTo: normalizedPhones,
//     provider: "fast2sms",
//     data: response.data,
//   };
// };


import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendSOSAlert = async (email, incidentData) => {
  try {
    if (!email) throw new ApiError(400, "Email address is required for SOS alert");

    const mailOptions = {
      from: `"FirstLine Emergency" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🚨 URGENT: SOS Alert Nearby!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 2px solid #e53e3e; border-radius: 8px; padding: 20px;">
          <h2 style="color: #e53e3e; text-align: center;">🚨 EMERGENCY NEAR YOUR LOCATION</h2>
          <p style="font-size: 16px; color: #333;">Someone nearby needs immediate assistance.</p>
          
          <div style="background-color: #fff5f5; padding: 15px; border-left: 4px solid #e53e3e; margin: 20px 0;">
            <p><strong>Incident Type:</strong> ${incidentData?.type || "Emergency"}</p>
            <p><strong>Description:</strong> ${incidentData?.description || "Immediate help requested."}</p>
          </div>
          
          <p style="text-align: center; font-size: 14px; color: #666;">
            Please open the FirstLine app immediately to view the exact location and respond to the SOS.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("SOS Email Error:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to send emergency email alert");
  }
};