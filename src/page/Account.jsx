import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import logo from '../assets/logo_white2.png'
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";


export default function CreateAccount() {
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("candidate"); // default role

  const handleRoleToggle = (selectedRole) => {
    setRole(selectedRole);
  };
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target?.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/result')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main content container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Section */}
        <motion.div
          className="flex-1 flex flex-col pt-32 px-10 bg-[#286a94] min-h-full"
        >
          <img src={logo} alt="eBench Logo" className="w-60 text-white mb-6" />
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
        <motion.div className="flex-1 flex flex-col justify-center px-10 py-12 bg-[#f0f0f0] min-h-full">
          <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-2xl p-8 mt-10">
            <h2 className="text-3xl text-[#286a94] font-semibold text-center mb-6">
              Welcome to eBench
            </h2>

            {/* Role Toggle */}
            <div className="flex justify-center mb-6 space-x-4">
              <button
                type="button"
                onClick={() => handleRoleToggle("vendor")}
                className={`px-4 py-2 rounded-lg font-medium ${role === "vendor" ? "bg-[#286a94] text-white" : "bg-gray-200"}`}
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle("candidate")}
                className={`px-4 py-2 rounded-lg font-medium ${role === "candidate" ? "bg-[#286a94] text-white" : "bg-gray-200"}`}
              >
                Candidate
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {role === "vendor" ? (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Your Name"
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
                        <p className="text-sm text-gray-500">Upload Photo (Optional)</p>
                      )}
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-[#286a94] text-white font-medium py-2 rounded-lg transition"
              >
                Login as {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>

              <p className="text-center text-gray-600 text-sm">
                Don't have a vendor account?{" "}
                <Link to='/vendor-signup' className="text-blue-600 hover:underline">
                  Signup
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>

  );
}
