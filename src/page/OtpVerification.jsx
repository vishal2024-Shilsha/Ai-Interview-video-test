import React, { useState } from "react";
import Header from "./Header";

const OtpVerification = () => {
    const [otp, setOtp] = useState(["", "", "", "","",""]);

    // Handle OTP input change
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to next input automatically
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        console.log("Entered OTP:", enteredOtp);
        // You can send enteredOtp to your backend for verification
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
                    <h2 className="text-2xl font-bold text-center text-[#286a94] mb-4">
                        OTP Verification
                    </h2>
                    <p className="text-gray-600 text-center mb-6">
                        Enter the 6-digit code sent to your email 
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex gap-5 justify-center">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onFocus={(e) => e.target.select()}
                                    className="w-14 h-14 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-96 flex justify-center mx-auto bg-[#286a94] text-white font-semibold py-2 rounded-lg hover:bg-[#3080b3] transition duration-200"
                        >
                            Verify OTP
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Didn’t receive the code?{" "}
                        <button
                            type="button"
                            className="text-[#286a94] font-medium hover:underline"
                            onClick={() => console.log("Resend OTP")}
                        >
                            Resend OTP
                        </button>
                    </p>
                </div>
            </div>
        </>

    );
};

export default OtpVerification;
