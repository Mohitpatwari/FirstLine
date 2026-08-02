// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PhoneEntry from "./PhoneEntry";
// import OTPVerification from "./OTPVerification";
// import { ShieldAlert } from "lucide-react";

// function Login({ onAuthSuccess }) {
//   const navigate = useNavigate();
//   const [step, setStep] = useState("phone"); // phone or otp
//   const [phone, setPhone] = useState("");

//   const handlePhoneContinue = (enteredPhone) => {
//     setPhone(enteredPhone);
//     setStep("otp");
//   };

//   const handleOTPSuccess = (userType) => {
//     onAuthSuccess(userType);
//   };

//   const handleBackToPhone = () => {
//     setPhone("");
//     setStep("phone");
//   };

//   const handleCreateNewAccount = () => {
//     navigate("/register");
//   };

//   return (
//     <main className="auth-page">
//       <header className="auth-topbar">
//         <div className="auth-topbar-inner">
//           <div className="auth-logo-wrap">
//             <span className="auth-brand">
//               <ShieldAlert size={20} />
//               <strong>FirstLine</strong>
//             </span>
//           </div>
//         </div>
//       </header>

//       {step === "phone" && (
//         <PhoneEntry
//           onContinue={handlePhoneContinue}
//           onCreateAccount={handleCreateNewAccount}
//         />
//       )}

//       {step === "otp" && (
//         <OTPVerification
//           phone={phone}
//           onSuccess={handleOTPSuccess}
//           onBack={handleBackToPhone}
//         />
//       )}
//     </main>
//   );
// }

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailEntry from "./EmailEntry"; // Notice the name change
import OTPVerification from "./OTPVerification";
import { ShieldAlert } from "lucide-react";

function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // tracking email step
  const [email, setEmail] = useState("");

  const handleEmailContinue = (enteredEmail) => {
    setEmail(enteredEmail);
    setStep("otp");
  };

  const handleOTPSuccess = (userType) => {
    onAuthSuccess(userType);
  };

  const handleBackToEmail = () => {
    setEmail("");
    setStep("email");
  };

  const handleCreateNewAccount = () => {
    navigate("/register");
  };

  return (
    <main className="auth-page">
      <header className="auth-topbar">
        <div className="auth-topbar-inner">
          <div className="auth-logo-wrap">
            <span className="auth-brand">
              <ShieldAlert size={20} />
              <strong>FirstLine</strong>
            </span>
          </div>
        </div>
      </header>

      {step === "email" && (
        <EmailEntry
          onContinue={handleEmailContinue}
          onCreateAccount={handleCreateNewAccount}
        />
      )}

      {step === "otp" && (
        <OTPVerification
          email={email} // Passing email down as a prop
          onSuccess={handleOTPSuccess}
          onBack={handleBackToEmail}
        />
      )}
    </main>
  );
}

export default Login;