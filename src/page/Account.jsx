import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import logo from '../assets/logo_white2.png'
import { useNavigate } from "react-router-dom";


export default function CreateAccount() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target?.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  function handleSubmit(e){
    e.preventDefault();
    navigate('/result')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/* Left Section */}
      <motion.div
        className="flex-1 flex flex-col pt-32 px-10 bg-[#286a94]"
        // initial={{ opacity: 0, x: -40 }}
        // animate={{ opacity: 1, x: 0 }}
        // transition={{ duration: 0.6 }}
      >
        <img src={logo} alt="eBench Logo" className="w-60 text-white   mb-6" /> 
        <h1 className="text-3xl font-bold text-white mb-4">
          Empowering Your Career with <span className="text-white">eBench</span>
        </h1>
        <p className="text-white leading-relaxed">
          With eBench, upload your introduction video, receive AI-powered analysis feedback,
          and automatically forward your application to top companies. Build your professional
          profile, connect globally, and accelerate your hiring journey with intelligent insights.
        </p>

        <div className="mt-8">
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
              <span className="text-white">Global talent & vendor network</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
              <span className="text-white">Smart workflow automation tools</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
              <span className="text-white">Insightful analytics for better decisions</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
              <span className="text-white">Accelerate hiring with AI-driven insights</span>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="flex-1 flex bg-[#f0f0f0] flex-col justify-center px-10 py-12 "
        // initial={{ opacity: 0, x: 0 }}
        // animate={{ opacity: 1, x: 0 }}
        // transition={{ duration: 0.6 }}
      >
        <div 
        className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8"
        >
          <h2 className="text-3xl text-[#286a94] font-semibold text-center mb-8 ">
            Welcome to eBench
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="First Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
             <input
              type="text"
              placeholder="Last Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
             <input
              type="text"
              placeholder="Access Code"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
           

            {/* Upload Image */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition">
              <input
                type="file"
                accept="image/*"
                id="upload"
                className="hidden"
                onChange={handleImageChange}
              />
              <label htmlFor="upload" className="flex flex-col items-center space-y-2 cursor-pointer">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400" />
                    <p className="text-sm text-gray-500">Upload Photo (Optional)</p>
                  </>
                )}
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#286a94] text-white font-medium py-2 rounded-lg transition"
            >
              Start Test
            </button>

            {/* <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p> */}
          </form>
        </div>
      </motion.div>


      
    </div>
  );
}
