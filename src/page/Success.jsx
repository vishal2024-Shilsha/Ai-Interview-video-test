import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { BadgeCheck } from 'lucide-react';

export default function SuccessPage() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-green-50 to-white text-center p-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white p-10 rounded-3xl shadow-2xl max-w-md"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <span className=" mx-auto">
                            <BadgeCheck className="mx-auto font-extrabold text-green-700 size-16 text-5xl" />
                        </span>
                    </motion.div>
                    <h1 className="text-2xl font-bold text-green-700 mt-4">
                        Upload Successful!
                    </h1>
                    <p className="text-gray-600 mt-2 mb-6">
                        Your introduction video has been uploaded successfully. Great job!
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-[#286a94] hover:bg-[#3e85b1] text-white px-6 py-2 rounded-xl shadow-lg"
                    >
                        Go Back to Profile
                    </button>
                </motion.div>
            </div>
        </>

    );
}
