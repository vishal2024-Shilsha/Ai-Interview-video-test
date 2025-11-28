// import React, { useState } from "react";
// import Header from "./Header";
// import { useSignupMutation } from "../redux/services/authApi";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";


// const VendorSignup = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//     });
//     const [signup, { isLoading }] = useSignupMutation();
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Vendor Signup Data:", formData);
//         try {
//             const result = await signup(formData).unwrap();
//             console.log("Signup success:", result);
//             if(result?.status){
//                 toast.success("signup sucessfully..")
//                 setTimeout(() => {
//                 navigate(`/otp-verify?email=${result?.email}`)
//                 },1000)
//             }
//             // Navigate to OTP page if needed
//         } catch (err) {
//             console.error("Signup failed:", err);
//         }
//         // You can send formData to your backend API here
//     };

//     return (
//         <>
//             <Header />
//             <div className="min-h-screen flex items-center justify-center bg-gray-100">
//                 <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//                     <h2 className="text-2xl font-bold mb-6 text-center text-[#286a94]">
//                         Vendor Signup
//                     </h2>

//                     <form onSubmit={handleSubmit} className="space-y-5">
//                         {/* Name Field */}
//                         <div>
//                             <label className="block text-gray-700 mb-2" htmlFor="name">
//                                 Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 placeholder="Enter your name"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>

//                         {/* Email Field */}
//                         <div>
//                             <label className="block text-gray-700 mb-2" htmlFor="email">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 placeholder="Enter your email"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>

//                         {/* Password Field */}
//                         <div>
//                             <label className="block text-gray-700 mb-2" htmlFor="password">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 placeholder="Enter your password"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>

//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             className="w-full bg-[#286a94] text-white font-semibold py-2 rounded-lg hover:bg-[#4588b3] transition duration-200"
//                         >
//                            {isLoading ? 'Signing...' : 'Sign Up'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </>

//     );
// };

// export default VendorSignup;


//====================================

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSignupMutation } from "../redux/services/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "./Header";
import logo from "../assets/ebench_logo.png";

const VendorSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    
    const [showPassword,setShowPassword] = useState(false)
    const [signup, { isLoading }] = useSignupMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await signup(formData).unwrap();
            if (result?.status) {
                toast.success("Signup successfully!");
                setTimeout(() => {
                    navigate(`/otp-verify?email=${result?.email}`);
                }, 1000);
            }
        } catch (err) {
            console.error("Signup failed:", err);
            toast.error(err?.data?.detail || "Unable to signup");
        }
    };

    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <Header />

            <div className="flex-1 flex flex-col md:flex-row">

                {/* LEFT PANEL */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col pt-28 px-10 bg-[#286a94] min-h-full"
                >
                    <h1 className="text-3xl font-bold text-white mb-4 leading-snug">
                        Begin Your Vendor Journey with{" "}
                        <span className="text-white font-extrabold">eBench</span>
                    </h1>

                    <p className="text-white leading-relaxed text-">
                        Join eBench and expand your opportunities by connecting with global
                        clients, streamlining your workflow, and showcasing your services on a
                        powerful AI-driven platform designed for vendor growth.
                    </p>

                    {/* <p className="text-white mt-4 opacity-90">
            Create your vendor account in just a few steps and unlock access to 
            intelligent tools, automated processes, and real-time insights that 
            help you operate smarter.
          </p> */}

                    <div className="mt-10">
                        <h3 className="text-white text-lg font-semibold mb-3">
                            Why Join as a Vendor?
                        </h3>

                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Access to global clients and recruitment projects.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-purple-400 rounded-full"></span>
                                <span className="text-white text-sm">
                                    AI tools that automate repetitive vendor tasks.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Insightful dashboards to track performance and analytics.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Secure onboarding with fast verification and approval.
                                </span>
                            </li>

                            <li className="flex items-center space-x-3">
                                <span className="w-2.5 h-2.5 bg-pink-400 rounded-full"></span>
                                <span className="text-white text-sm">
                                    Exclusively designed for vendor success and workflow efficiency.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-10">
                        <p className="text-white opacity-80 text-sm">
                            Already registered? Continue where you left off by logging in to your account.
                        </p>
                    </div>
                </motion.div>

                {/* RIGHT PANEL (SIGNUP FORM) */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col px-10 justify-center bg-[#f0f0f0] min-h-full"
                >
                    <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
                        <img src={logo} alt="eBench Logo" className="w-40 mx-auto mb-6" />

                        <h2 className="text-2xl font-bold text-center text-[#286a94] mb-6">
                            Vendor Signup
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <label htmlFor="password" className="block text-gray-700 mb-1">
                                    Password
                                </label>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 pr-12"
                                    required
                                />

                                {/* Eye Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#286a94] text-white font-semibold py-2 rounded-lg transition"
                            >
                                {isLoading ? "Signing..." : "Create Account"}
                            </button>

                        </form>

                        <p className="text-center text-gray-600 text-sm mt-4">
                            Already have a vendor account?{" "}
                            <span
                                onClick={() => navigate("/")}
                                className="text-blue-600 hover:underline cursor-pointer"
                            >
                                Login
                            </span>
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default VendorSignup;
