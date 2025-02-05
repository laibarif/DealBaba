import React, { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_DEALBABA_URL;

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    countryCode: "+1", // Default country code
    password: "",
    role: "",
    userId: null,
  });
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);

  const countryCodes = [
    { code: "+1", label: "🇺🇸 USA (+1)" },
    { code: "+44", label: "🇬🇧 UK (+44)" },
    { code: "+91", label: "🇮🇳 India (+91)" },
    { code: "+61", label: "🇦🇺 Australia (+61)" },
    { code: "+81", label: "🇯🇵 Japan (+81)" },
    { code: "+971", label: "🇦🇪 UAE (+971)" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const phoneWithCode = `${formData.countryCode}${formData.phoneNumber}`;
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, {
        ...formData,
        phoneNumber: phoneWithCode, // Send concatenated phone number
      });

      const userId = response.data.userId;
      if (userId) {
        setFormData((prev) => ({ ...prev, userId }));
        setOtpSent(true);
        setStep(2);
        alert("Signup successful. Verify your email and phone.");
      } else {
        alert("Signup successful, but no userId received.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      console.error("Signup error:", errorMessage);
      alert(errorMessage);
    }
  };

  const handleVerifyOtp = async (e, type) => {
    e.preventDefault();
    const otp = type === "email" ? otpEmail : otpPhone;
    try {
      const userId = formData.userId;

      await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        otp,
        userId,
        type,
      });

      alert(
        `${type === "email" ? "Email" : "Phone"} OTP Verified Successfully`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during OTP verification.";
      console.error(`Error verifying OTP for ${type}:`, errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div>
      <h2>Signup Form</h2>

      {step === 1 && (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              style={{ padding: "5px" }}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Signup</button>
        </form>
      )}

      {step === 2 && otpSent && (
        <div>
          <h3>Verify OTP</h3>

          <form onSubmit={(e) => handleVerifyOtp(e, "email")}>
            <input
              type="text"
              placeholder="Enter Email OTP"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
            />
            <button type="submit">Verify Email OTP</button>
          </form>

          <form onSubmit={(e) => handleVerifyOtp(e, "phone")}>
            <input
              type="text"
              placeholder="Enter Phone OTP"
              value={otpPhone}
              onChange={(e) => setOtpPhone(e.target.value)}
            />
            <button type="submit">Verify Phone OTP</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignupForm;