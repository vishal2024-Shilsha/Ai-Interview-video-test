import React, { useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/ebench_logo.png";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
// import { useForgotPasswordMutation } from "../redux/services/authApi"; // your forgot API
import { toast } from "react-hot-toast";
import { useForgotPasswordMutation } from "../redux/services/authApi";

export default function VendorForgotPassword() {
    const [email, setEmail] = useState("");
    const [forgotPassword,{isLoading}] = useForgotPasswordMutation();
    const navigate = useNavigate();

    //   const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            return toast.error("Email is required!");
        }
 
        try {
            const result = await forgotPassword({ email }).unwrap();
            console.log("rsss",result);
            toast.success(result?.message || "Reset link sent!");
            setTimeout(() => {
            navigate(`/otp-verify?email=${email}`,{state:{data:true}});
            },1500)
        } catch (err) {
            console.log("er",err);
            toast.error(err?.data?.detail || "Unable to send reset link");
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Main Layout */}
            <div className="flex-1 flex flex-col md:flex-row">

                <motion.div
                    // initial={{ opacity: 0, x: -40 }}
                    // animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col pt-28 px-10 bg-[#286a94] min-h-full"
                >
                    <h1 className="text-3xl font-bold text-white mb-4"> Reset Your Password with <span className="text-white">eBench</span> </h1>
                    {/* <p className="text-white leading-relaxed text-lg">
                        Forgot your password? It happens! With eBench, resetting your account is
                        simple, fast, and completely secure. Just enter your registered email,
                        and you’ll receive a secure link to create a new password in moments.
                    </p> */}

                    <p className="text-white mt-4 opacity-90">
                        Our system uses advanced encryption and verification methods to ensure your
                        account stays protected while giving you quick access whenever you need it.
                    </p>

                    <div className="mt-10">
                        <h3 className="text-white text-lg font-semibold mb-3">
                            Why Reset with eBench?
                        </h3>

                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Secure password recovery with encrypted reset links.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-purple-400 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Instant delivery of reset instructions directly to your inbox.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Hassle-free recovery without contacting support or waiting.
                                </span>
                            </li>

                            
                        </ul>
                    </div>

                    <div className="mt-10">
                        <p className="text-white opacity-80 text-sm">
                            Need additional assistance? Our support team is always available to help
                            you recover your account securely and quickly.
                        </p>
                    </div>
                </motion.div>

                {/* RIGHT SECTION */}
                <motion.div
                    // initial={{ opacity: 0, x: 40 }}
                    // animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex items-center justify-center flex-col px-10 py-16 bg-[#f0f0f0] min-h-full"
                >
                    <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
                        <img src={logo} alt="eBench Logo" className="w-40 mx-auto mb-6" />

                        <h2 className="text-xl font-semibold text-center mb-2">
                            Forgot Password
                        </h2>
                        <p className="text-gray-600 text-center text-sm mb-6">
                            Enter your registered email to receive a password reset link.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* EMAIL FIELD */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                className="w-full bg-[#286a94] text-white font-medium py-2 rounded-lg transition"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>

                            {/* BACK TO LOGIN */}
                            <p className="text-center text-gray-600 text-sm mt-1">
                                Remember password?{" "}
                                <span
                                    onClick={() => navigate("/")}
                                    className="text-blue-600 hover:underline cursor-pointer"
                                >
                                    Login
                                </span>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}