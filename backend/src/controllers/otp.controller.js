// import { OTP } from "../models/otp.model.js";
// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// export const verifyOTP = asyncHandler(async (req, res) => {
//   const { phone, otp } = req.body;

//   if (!phone || !otp) {
//     throw new ApiError(400, "Phone and OTP required");
//   }

//   const cleanPhone = phone.replace(/\D/g, "");

//   const user = await User.findOne({ phone: cleanPhone });

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   const otpRecord = await OTP.findOne({ userId: user._id });
  
//   if (!otpRecord) {
//     throw new ApiError(400, "OTP not found. Please login again");
//   }

//   // check expiry
//   if (otpRecord.expiresAt < Date.now()) {
//     await OTP.deleteMany({ userId: user._id });
//     throw new ApiError(400, "OTP expired. Request new OTP");
//   }

//   // max attempts = 3
//   if (otpRecord.attempts >= 3) {
//     await OTP.deleteMany({ userId: user._id });
//     throw new ApiError(400, "Maximum attempts reached. Request new OTP");
//   }

//   // wrong OTP
//   if (otpRecord.otp !== otp) {
//     otpRecord.attempts += 1;
//     await otpRecord.save();

//     const left = 3 - otpRecord.attempts;

//     if (left <= 0) {
//       await OTP.deleteMany({ userId: user._id });
//       throw new ApiError(400, "Maximum attempts reached. Request new OTP");
//     }

//     throw new ApiError(400, `Invalid OTP. Attempts left: ${left}`);
//   }

//   // correct OTP → delete record
//   await OTP.deleteMany({ userId: user._id });

//   const loggedInUser = await User.findById(user._id).select("-refreshToken location");

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {loggedInUser},
//       "Logged in successfully"
//     )
//   );
// });



import { OTP } from "../models/otp.model.js";
import { sendOTPSMS } from "../utils/otpSMS.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Send / Resend Email OTP
export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "A valid email address is required");
  }

  const cleanEmail = email.trim().toLowerCase();

  // Generate 6-digit OTP
  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  // Delete any existing OTPs for this email to keep DB clean
  await OTP.deleteMany({ email: cleanEmail });

  // Save new OTP to database
  await OTP.create({
    email: cleanEmail,
    otp: generatedOTP,
  });

  // Send email via Nodemailer
  await sendOTPSMS(cleanEmail, generatedOTP);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: cleanEmail },
        "Verification code sent to your email successfully"
      )
    );
});

// Verify OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are both required");
  }

  const cleanEmail = email.trim().toLowerCase();

  // Find latest OTP entry
  const existingOTP = await OTP.findOne({ email: cleanEmail, otp });

  if (!existingOTP) {
    throw new ApiError(400, "Invalid or expired OTP code");
  }

  // Clear OTP once verified
  await OTP.deleteOne({ _id: existingOTP._id });

  return res
    .status(200)
    .json(new ApiResponse(200, { email: cleanEmail }, "OTP verified successfully"));
});