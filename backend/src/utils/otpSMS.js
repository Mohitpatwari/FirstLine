// // feature for otp in sms

// import { ApiError } from "./ApiError.js";
// import axios from "axios";

// export const sendOTPSMS = async (phone, otp) => {
//   try {
//     if (!phone) throw new ApiError(400, "Phone number required");
//     if (!otp) throw new ApiError(400, "OTP required");

//     const cleanPhone = phone.toString().replace(/\D/g, "");

//     if (cleanPhone.length !== 10) {
//       throw new ApiError(400, "Phone must be 10 digits");
//     }

//     // -------------------------------------------------------------
//     // 📲 DEV MODE: PRINT OTP IN TERMINAL (FAST2SMS BYPASS)
//     // -------------------------------------------------------------
//     console.log("\n=================================");
//     console.log("📲 OTP GENERATED (DEV MODE)");
//     console.log("Phone:", cleanPhone);
//     console.log("OTP:", otp);
//     console.log("=================================\n");

//     return true;

//     // -------------------------------------------------------------
//     // 🚀 PRODUCTION MODE: FAST2SMS INTEGRATION (DISABLED FOR DEV)
//     // -------------------------------------------------------------
//     /*
//     const apiKey = process.env.FAST2SMS_API_KEY;
//     if (!apiKey) {
//       throw new ApiError(500, "FAST2SMS_API_KEY missing");
//     }

//     const message = `Your OTP is ${otp}. Valid for 5 minutes.`;

//     const response = await axios.post(
//       "https://www.fast2sms.com/dev/bulkV2",
//       {
//         route: "q",
//         message: message,
//         language: "english",
//         numbers: cleanPhone
//       },
//       {
//         headers: {
//           authorization: apiKey,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     if (!response.data.return) {
//       throw new ApiError(500, response.data.message || "SMS failed");
//     }

//     return true;
//     */

//   } catch (error) {
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(500, error.message || "OTP process failed");
//   }
// };



// // feature for otp in console

// // import { ApiError } from "./ApiError.js";

// // export const sendOTPSMS = async (phone, otp) => {
// //   try {
// //     if (!phone) throw new ApiError(400, "Phone number required");
// //     if (!otp) throw new ApiError(400, "OTP required");

// //     const cleanPhone = phone.toString().replace(/\D/g, "");

// //     if (cleanPhone.length !== 10) {
// //       throw new ApiError(400, "Phone must be 10 digits");
// //     }

// //     // 🔥 DEV PURPOSE ONLY — PRINT OTP IN TERMINAL
// //     console.log("\n===============================");
// //     console.log("📲 OTP GENERATED (DEV MODE)");
// //     console.log("Phone:", cleanPhone);
// //     console.log("OTP:", otp);
// //     console.log("===============================\n");

// //     // pretend SMS sent successfully
// //     return true;

// //   } catch (error) {
// //     if (error instanceof ApiError) throw error;
// //     throw new ApiError(500, error.message || "OTP generation failed");
// //   }
// // };





import { ApiError } from "./ApiError.js";

export const sendOTPSMS = async (email, otp) => {
  try {
    if (!email) throw new ApiError(400, "Email address required");
    if (!otp) throw new ApiError(400, "OTP required");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email address format");
    }

    // Send email via Brevo HTTP API (Bypasses Render's port block)
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { 
          name: "FirstLine Platform", 
          email: process.env.EMAIL_USER // This MUST match the Gmail you verified on Brevo
        },
        to: [{ email: email }],
        subject: "Your FirstLine Verification Code",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
            <h2 style="color: #e53e3e; margin-top: 0;">🚨 FirstLine Authentication</h2>
            <p style="color: #4a5568; font-size: 15px;">Use the following 6-digit verification code to complete your login:</p>
            <div style="background-color: #edf2f7; padding: 16px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2d3748; border-radius: 6px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #718096; font-size: 13px; margin-bottom: 0;">This code is valid for 5 minutes. Do not share it with anyone.</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error:", errorData);
      throw new ApiError(500, "Failed to send verification email");
    }

    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Email service error:", error);
    throw new ApiError(500, error.message || "Failed to send verification email");
  }
};