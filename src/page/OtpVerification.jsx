import React, { useState, useRef } from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { useVerifyOtpMutation, useResendOtpMutation, useResetAccessCodeMutation } from "../redux/services/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/ebench_logo.png";

const OtpVerification = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef([]);
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [resetCode, { isLoading: isResetting }] = useResetAccessCodeMutation();
    const [resendOtp] = useResendOtpMutation();
    // console.log("000000", resendOtp);
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email");

    // OTP Input Handler
    const handleChange = (e, index) => {
        const value = e.target.value;

        if (!/^[0-9]?$/.test(value)) return; // Allow only digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move forward
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }

        // Move backward when deleting
        if (!value && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            toast.error("Please enter all 6 digits.");
            return;
        }

        try {
            if (location?.state?.data) {
                const result = await resetCode({ email, otp: finalOtp }).unwrap();
                // console.log("ram", result);
                if (result?.status) {
                    toast.success("OTP Verified Successfully!");
                    setTimeout(() => navigate("/reset-password",{state:{email:result?.email,
                    reset_token:result?.reset_token}}), 800);
                }
            } else {
                const result = await verifyOtp({ email, otp: finalOtp }).unwrap();
                console.log("ram", result);
                if (result?.status) {
                    toast.success("OTP Verified Successfully!");
                    setTimeout(() => navigate("/"), 800);
                }
            }

        } catch (err) {
            toast.error("Invalid OTP, try again.");
        }
    };

    async function resendOtpHandler() {
        if (!email) {
            return toast.error("email is required...")
        }
        const form = new FormData();
        form.append('email', email);
        try {
            const result = await resendOtp(form).unwrap();
            console.log("resss,,", result);
            if (result?.status) {
                toast.success("OTP send successfully. Check your mail.")
            }
        } catch (err) {
            toast.error("Internal Server Error")
        }
    }

   
    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <Header />

            <div className="flex-1 flex flex-col md:flex-row">

                {/* LEFT PANEL – OTP CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col pt-28 px-10 bg-[#286a94] min-h-full"
                >
                    <h1 className="text-3xl font-bold text-white mb-4 leading-snug">
                        Verify Your Identity with{" "}
                        <span className="text-white font-extrabold">eBench</span>
                    </h1>

                    <p className="text-white leading-relaxed text-sm">
                        To secure your account, we’ve sent a One-Time Password (OTP) to your
                        registered email. Enter the 6-digit code below to complete your signup.
                    </p>

                    <p className="text-white mt-4 text-sm opacity-95">
                        This verification step ensures that only you have access to your
                        account—keeping your personal and vendor data completely secure.
                    </p>

                    <div className="mt-10">
                        <h3 className="text-white text-lg font-semibold mb-3">
                            Why OTP Verification?
                        </h3>

                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-blue-300 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Prevents unauthorized access to your vendor account.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-yellow-300 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Ensures secure onboarding with identity verification.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-purple-300 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Quick, safe, and required for activating your vendor privileges.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-green-300 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Helps maintain a trusted and secure marketplace.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-10">
                        <p className="text-white opacity-80 text-sm">
                            Didn’t receive an OTP? You can resend it after a few seconds.
                        </p>
                    </div>
                </motion.div>

                {/* RIGHT PANEL – OTP FORM */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex justify-center flex-col px-10 py-16 bg-[#f0f0f0] min-h-full"
                >
                    <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
                        <img src={logo} alt="eBench Logo" className="w-32 mx-auto mb-6" />

                        <h2 className="text-2xl font-bold text-center text-[#286a94] mb-4">
                            OTP Verification
                        </h2>

                        <p className="text-gray-600 text-center mb-6">
                            Enter the 6-digit code sent to <br />
                            <span className="font-medium text-[#286a94]">{email}</span>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-4 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        onChange={(e) => handleChange(e, index)}
                                        onFocus={(e) => e.target.select()}
                                        className="w-12 h-12 text-center text-xl border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#286a94] text-white font-semibold py-2 rounded-lg hover:bg-[#3080b3] transition duration-200"
                            >
                                {isVerifying ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Didn’t receive the code?{" "}
                            <button
                                type="button"
                                className="text-[#286a94] font-medium hover:underline"
                                onClick={resendOtpHandler}
                            >
                                Resend OTP
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OtpVerification;
