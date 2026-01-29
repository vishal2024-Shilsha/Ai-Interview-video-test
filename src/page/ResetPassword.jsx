import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../assets/ebench_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useResetPasswordMutation } from "../redux/services/authApi";
// import { useResetPasswordMutation } from "../redux/services/authApi";  // If API exists

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();  // If API exists

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match!"); // password not
            return;
        }

        const data = {
            email: location?.state?.email,
            new_password: formData?.newPassword,
            confirm_password: formData?.confirmPassword,
            reset_token:location?.state?.reset_token
    }

        try {
            // -------- API CALL --------
            const result = await resetPassword(data).unwrap();
            // console.log("ress",result)
            setTimeout(() => {
                toast.success("Password reset successfully!");
            },1000)
            // navigate("/login");

            toast.success("Password reset successfully");
            navigate("/login");
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong!");
        }
    };
    return (
        <div className="flex-1 min-h-screen flex flex-col md:flex-row">
            <Header />

            {/* Left Section */}
            <motion.div className="flex-1 flex flex-col pt-28 px-10 bg-[#286a94] min-h-full">
                <h1 className="text-3xl font-bold text-white mb-4">
                    Reset Your Password with <span className="text-white">eBench</span>
                </h1>
                <p className="text-white leading-relaxed">
                    Secure your account quickly. Create a new password and continue
                    managing your vendor operations with confidence.
                </p>

                <div className="mt-8">
                    <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                            <span className="text-white">Protect your account</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                            <span className="text-white">Strong password encryption</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                            <span className="text-white">Seamless login experience</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
                            <span className="text-white">AI-enhanced security checks</span>
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* Right Section */}
            <motion.div className="flex-1 flex flex-col px-10 py-16 bg-[#f0f0f0] min-h-full">
                <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
                    <img src={logo} alt="eBench Logo" className="w-40 mx-auto mb-6" />

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* New Password */}
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Create new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={15} />
                                    ) : (
                                        <Eye size={15} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#286a94] text-white font-medium py-2 rounded-lg transition"
                        >
                            Reset Password
                        </button>

                        {/* Back to Login */}
                        <p className="text-center text-gray-600 text-sm">
                            Return to{" "}
                            <span
                                onClick={() => navigate("/")}
                                className="text-blue-600 hover:underline cursor-pointer"
                            >
                                login
                            </span>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
