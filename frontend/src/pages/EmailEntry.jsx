// import { useState } from "react";
// import { axiosInstance } from "../api/axios.js";
// import { Phone, ArrowRight, UserPlus } from "lucide-react";

// const phoneRegex = /^[0-9]{10}$/; // 10-digit phone number

// function PhoneEntry({ onContinue, onCreateAccount }) {
//   const [phone, setPhone] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handlePhoneChange = (event) => {
//     const value = event.target.value.replace(/\D/g, "").slice(0, 10);
//     setPhone(value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");

//     if (!phoneRegex.test(phone)) {
//       setError("Please enter a valid 10-digit phone number.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Request OTP from backend
//       const response = await axiosInstance.post("/users/send-otp", {
//         phone: `+91${phone}`, // Add country code
//       });

//       if (response.status === 200) {
//         // Pass phone to parent component for OTP verification step
//         onContinue(phone);
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Failed to send OTP. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="auth-body">
//       <form className="auth-card" onSubmit={handleSubmit}>
//         <div className="auth-card-icon">
//           <Phone size={28} />
//         </div>
//         <h2><strong>Login or Create Account</strong></h2>
//         <p className="subtitle"><strong>Enter your phone number</strong> to proceed</p>

//         <div className="phone-input-wrap">
//           <span className="country-code"><strong>+91</strong></span>
//           <input
//             type="tel"
//             value={phone}
//             onChange={handlePhoneChange}
//             placeholder="Enter 10-digit number"
//             autoComplete="tel"
//             maxLength="10"
//           />
//         </div>

//         {error && <p className="form-error"><strong>{error}</strong></p>}

//         <button
//           type="submit"
//           className="primary-btn"
//           disabled={!phoneRegex.test(phone) || loading}
//         >
//           <strong>{loading ? "Sending OTP..." : "Continue"}</strong>
//           {!loading && <ArrowRight size={16} style={{ marginLeft: 6 }} />}
//         </button>

//         <p className="terms-text">
//           By continuing, I agree to the <a href="#"><strong>Terms of Service</strong></a>
//         </p>

//         <div className="auth-secondary-actions">
//           <button type="button" className="link-btn" onClick={onCreateAccount}>
//             <UserPlus size={14} style={{ marginRight: 4 }} />
//             <strong>Create New Account</strong>
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// }

// export default PhoneEntry;

import { useState } from "react";
import { axiosInstance } from "../api/axios.js";
import { Mail, ArrowRight, UserPlus } from "lucide-react"; // Changed Phone icon to Mail

// Standard email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailEntry({ onContinue, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event) => {
    // Keep it lowercase and remove accidental spaces
    setEmail(event.target.value.trim().toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // Request OTP from backend using email
      const response = await axiosInstance.post("/users/send-otp", {
        email: email, 
      });

      if (response.status === 200) {
        // Pass email to parent component (Login.jsx) for OTP verification step
        onContinue(email);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-body">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-card-icon">
          <Mail size={28} />
        </div>
        <h2><strong>Login or Create Account</strong></h2>
        <p className="subtitle"><strong>Enter your email address</strong> to proceed</p>

        {/* Removed phone-input-wrap and +91 country code */}
        <input
          className="text-input"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email address"
          autoComplete="email"
        />

        {error && <p className="form-error"><strong>{error}</strong></p>}

        <button
          type="submit"
          className="primary-btn"
          disabled={!emailRegex.test(email) || loading}
        >
          <strong>{loading ? "Sending OTP..." : "Continue"}</strong>
          {!loading && <ArrowRight size={16} style={{ marginLeft: 6 }} />}
        </button>

        <p className="terms-text">
          By continuing, I agree to the <a href="#"><strong>Terms of Service</strong></a>
        </p>

        <div className="auth-secondary-actions">
          <button type="button" className="link-btn" onClick={onCreateAccount}>
            <UserPlus size={14} style={{ marginRight: 4 }} />
            <strong>Create New Account</strong>
          </button>
        </div>
      </form>
    </section>
  );
}

export default EmailEntry;