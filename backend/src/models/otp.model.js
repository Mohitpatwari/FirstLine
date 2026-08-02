// import mongoose from "mongoose";

// const otpSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   otp: {
//     type: String,
//     required: true
//   },
//   attempts: {
//     type: Number,
//     default: 0
//   },
//   expiresAt: {
//     type: Date,
//     required: true,
//     index: { expires: 0 } // auto delete when expired
//   }
// }, { timestamps: true });

// export const OTP = mongoose.model("OTP", otpSchema);


import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // OTP automatically expires in 5 minutes (300 seconds)
    },
  },
  { timestamps: true }
);

export const OTP = mongoose.model("OTP", otpSchema);