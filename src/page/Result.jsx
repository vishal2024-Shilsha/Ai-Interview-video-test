
import userImg from '../assets/userImg.jpg'
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";

// export default function ProfilePage() {
//     const navigate = useNavigate();

//     return (
//         <>
//             <Header />
//             <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-8">
//                 <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                     className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-8 relative overflow-hidden"
//                 >
//                     {/* Decorative Background */}
//                     <div className="absolute top-0 left-0 w-60 h-60 rounded-full blur-3xl opacity-30 animate-pulse" />
//                     <div className="absolute bottom-0 right-0 w-60 h-60  rounded-full blur-3xl opacity-30 animate-pulse" />

//                     <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
//                         {/* Left Section: User Profile */}
//                         <div className="flex flex-col items-center md:items-start">
//                             <motion.img
//                                 src={userImg}
//                                 alt="Profile"
//                                 className="w-36 h-36 rounded-full border-2 border-[#dfe4e7] shadow-lg mb-4"
//                                 whileHover={{ scale: 1.05 }}
//                             />
//                             <h2 className="text-3xl font-bold text-[#286a94] mb-1">
//                                 Abhishek Yadav
//                             </h2>
//                             <p className="text-gray-600 mb-4">
//                                 MERN Stack Developer | 2+ years experience
//                             </p>

//                             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 shadow-inner w-full">
//                                 <h3 className="text-[#286a94] font-semibold mb-2">
//                                     Profile Details
//                                 </h3>
//                                 <ul className="space-y-1">
//                                     <li><strong>Email:</strong> abhishek@example.com</li>
//                                     <li><strong>Phone:</strong> +91 9876543210</li>
//                                     <li><strong>City:</strong> Delhi, India</li>
//                                     <li><strong>Member Since:</strong> March 2023</li>
//                                 </ul>
//                             </div>
//                         </div>

//                         {/* Right Section: Test Description */}
//                         <div className="flex flex-col justify-center space-y-4">
//                             <motion.h2
//                                 className="text-2xl font-bold text-[#286a94]"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.2 }}
//                             >
//                                 🧩 Introduction Test Overview
//                             </motion.h2>
//                             <p className="text-gray-700 leading-relaxed">
//                                 In this test, you’ll record a short video introducing yourself.
//                                 Talk about your background, skills, and interests. This helps us
//                                 understand your communication style and personality better.
//                             </p>

//                             <div className="grid grid-cols-2 gap-4 text-sm">
//                                 <div className="bg-gray-50 border rounded-xl p-4">
//                                     <h4 className="text-[#286a94] font-semibold mb-1">📋 Duration</h4>
//                                     <p>60 seconds</p>
//                                 </div>
//                                 <div className="bg-gray-50 border rounded-xl p-4">
//                                     <h4 className="text-[#286a94] font-semibold mb-1">🎯 Objective</h4>
//                                     <p>Self Introduction</p>
//                                 </div>
//                                 <div className="bg-gray-50 border rounded-xl p-4">
//                                     <h4 className="text-[#286a94] font-semibold mb-1">🎥 Camera</h4>
//                                     <p>Required (Video + Audio)</p>
//                                 </div>
//                                 <div className="bg-gray-50 border rounded-xl p-4">
//                                     <h4 className="text-[#286a94] font-semibold mb-1">💾 Format</h4>
//                                     <p>MP4 Upload</p>
//                                 </div>
//                             </div>

//                             <motion.button
//                                 onClick={() => navigate("/record")}
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="bg-[#286a94] hover:bg-[#5992b6] text-white font-semibold py-3 px-6 rounded-xl shadow-lg mt-6"
//                             >
//                                 🚀 Start Your Introduction
//                             </motion.button>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </>

//     );
// }

// new code

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useVerifyOtpMutation } from "../redux/services/authApi";
import Header from "./Header";
import { useCookiesGenerateQuery,useUploadTestMutation, useLazyGetProfileQuery, useVerifyUserOtpMutation } from '../redux/services/userApi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const candidate_id = searchParams.get("candidate_id");  // read ?name=...
    const token = searchParams.get("token");
    const [loading, setLoading] = useState(true);

    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [verifyOtp] = useVerifyUserOtpMutation();
    // console.log("verify",verifyOtp);

    const { data: cookieData, isSuccess: cookieReady,isError } =
        useCookiesGenerateQuery({ candidate_id, token });

    const [fetchCandidate, { data: candidateData, isLoading }] = useLazyGetProfileQuery();

    const handleVerify = async () => {
        // console.log("first", otp.length<6);
        if (otp.length<6) {
            toast.warning("Enter valid 6 digit OTP")
            return;
        }
        const form = new FormData();
        form.append('candidate_id',candidate_id)
        form.append('otp',otp)
        try {
            const res = await verifyOtp(form).unwrap();
            if (res?.status) {
                toast.success("Authentication Successully")
                setIsOtpOpen(false);
                setTimeout(() => {
                navigate("/record",{state:{data:token}}); // move to test page
                },1000)
            } else {
                setOtp("")
            }
        } catch (err) {
            console.log("err",err)
            toast.error(err?.data?.detail??"Something went wrong")
        }
    };
    // console.log("hello oops",isError)

    useEffect(() => {
        if (!cookieReady) return;

        fetchCandidate({
            id: candidate_id,
            token: cookieData?.token
        }).unwrap()
            .then(res => console.log("Candidate Data Loaded", res))
            .catch(err => console.error(err));
        
        
    }, [cookieReady, candidate_id]);
    
    if (isLoading) {
        return <FullScreenLoader />
    }

    if(isError){
        return <Unauthorized />
    }


    return (
        <>
            <Header />
            {/* Main Profile UI (unchanged) */}
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-60 h-60 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full blur-3xl opacity-30 animate-pulse" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Left Profile Section */}
                        <div className="flex flex-col items-center md:items-start">
                            <motion.img
                                src={userImg}
                                alt="Profile"
                                className="w-36 h-36 rounded-full border-2 border-[#dfe4e7] shadow-lg mb-4"
                                whileHover={{ scale: 1.05 }}
                            />
                            <h2 className="text-3xl font-bold text-[#286a94] mb-3">{candidateData?.candidate?.first_name + " "+ candidateData?.candidate?.last_name}</h2>
                                                    {/* Left Profile Section
                                                    */}
                            {/* <p className="text-gray-600 mb-4">MERN Stack Developer | 2+ years experience</p>                                                     */}

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 shadow-inner w-full">
                                <h3 className="text-[#286a94] font-semibold mb-2">Profile Details</h3>
                                <ul className="space-y-1">
                                    <li><strong>Email:</strong> {candidateData?.candidate?.candidate_email??"N/A"}</li>
                                    <li><strong>Phone:</strong> {candidateData?.candidate?.mobile??"N/A" }</li>
                                    <li><strong>Nationality:</strong> {candidateData?.candidate?.nationality??"N/A"} </li>
                                    <li><strong>Country of Residence:</strong> {candidateData?.candidate?.country_of_residence??"N/A" } </li>
                                    <li><strong>Birth Country:</strong> {candidateData?.candidate?.birth_country??"N/A" } </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Test Section */}
                        <div className="flex flex-col justify-center space-y-4">
                            <motion.h2
                                className="text-2xl font-bold text-[#286a94]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                🧩 Introduction Test Overview
                            </motion.h2>

                            <p className="text-gray-700 leading-relaxed">
                                In this test, you’ll record a short video introducing yourself.
                                Talk about your background, skills, and interests.
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 border rounded-xl p-4">
                                    <h4 className="text-[#286a94] font-semibold mb-1">📋 Duration</h4>
                                    <p>60 seconds</p>
                                </div>
                                <div className="bg-gray-50 border rounded-xl p-4">
                                    <h4 className="text-[#286a94] font-semibold mb-1">🎯 Objective</h4>
                                    <p>Self Introduction</p>
                                </div>
                                <div className="bg-gray-50 border rounded-xl p-4">
                                    <h4 className="text-[#286a94] font-semibold mb-1">🎥 Camera</h4>
                                    <p>Required</p>
                                </div>
                                <div className="bg-gray-50 border rounded-xl p-4">
                                    <h4 className="text-[#286a94] font-semibold mb-1">💾 Format</h4>
                                    <p>MP4 Upload</p>
                                </div>
                            </div>

                            {/* Start Test → open OTP popup */}
                            <motion.button
                                onClick={() => setIsOtpOpen(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#286a94] hover:bg-[#5992b6] text-white font-semibold py-3 px-6 rounded-xl shadow-lg mt-6"
                            >
                                🚀 Start Your Introduction
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* OTP Popup Over Same UI */}
            {isOtpOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
                    >
                        <h2 className="text-xl font-semibold text-[#286a94] text-center mb-4">
                            🔐 Verify OTP
                        </h2>

                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6 digit OTP"
                            className="w-full border px-4 py-2 rounded-lg text-center text-lg tracking-widest"
                        />

                        <button
                            onClick={handleVerify}
                            className="w-full mt-4 bg-[#286a94] text-white font-semibold py-2 rounded-lg hover:bg-[#3b7aa7]"
                        >
                            Verify OTP
                        </button>

                        <button
                            onClick={() => [setIsOtpOpen(false),setOtp("")]}
                            className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm"
                        >
                            Cancel
                        </button>
                    </motion.div>
                </div>
            )}
        </>
    );
}



const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-[9999]">
            <div className="w-14 h-14 border-4 border-[#286a94] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};


function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md w-full">
        
        <div className="text-red-500 text-7xl font-bold">401</div>

        <h1 className="text-2xl font-semibold text-gray-800 mt-4">
          Unauthorized Access
        </h1>

        <p className="text-gray-500 mt-2">
          Your access link has expired or you do not have permission to view this page.
        </p>

        <p className="text-gray-400 text-sm mt-6">
          Please contact support if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
}
