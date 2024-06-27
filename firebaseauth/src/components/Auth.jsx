import React, { useState } from "react";
import { auth } from "../firebase"; // Adjust the path if necessary
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function Auth() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      // Pass the auth instance explicitly to RecaptchaVerifier
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            handlePhoneLogin();
          },
        },
        auth, // Pass the auth instance
      );
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login result:", result);
      console.log("Logged in user details:", result.user);
      toast.success("Logged in with Google", { position: "top-center" });
      navigate("/profile");
    } catch (error) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  const handlePhoneLogin = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier,
      );
      setVerificationId(confirmationResult.verificationId);
      toast.success("OTP sent to phone", { position: "top-center" });
    } catch (error) {
      console.error("Error during phone login:", error);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  const verifyOtp = async () => {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    try {
      const result = await signInWithCredential(auth, credential);
      console.log("Phone login result:", result);
      console.log("Logged in user details:", result.user);
      toast.success("Logged in with phone", { position: "top-center" });
      navigate("/profile");
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <button onClick={handleGoogleLogin} className="btn btn-primary">
        Login with Google
      </button>
      <div>
        <PhoneInput
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={setPhoneNumber}
          defaultCountry="IN"
        />
        <button onClick={handlePhoneLogin} className="btn btn-primary">
          Send OTP
        </button>
      </div>
      <div id="recaptcha-container"></div>
      {verificationId && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} className="btn btn-primary">
            Verify OTP
          </button>
        </div>
      )}
    </div>
  );
}

export default Auth;
