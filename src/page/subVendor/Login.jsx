import React, { useState } from "react";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEmployeeLoginMutation, useGetOrganisationDetailQuery, useSubVendorResetPasswordMutation } from "../../redux/services/subvendorApi";
import Loader from "../../libs/Loader";
import ErrorPage from "../../libs/ErrorPage";
import toast from "react-hot-toast";

const SubVendorLogin = () => {

  const { data: organisationData, isLoading: organisationLoading, isError: organisationError } = useGetOrganisationDetailQuery()

  const [employeeLogin, { isLoading: subVendorLoading }] = useEmployeeLoginMutation()
  const [employeeResetPassword, { isLoading: resetLoading }] = useSubVendorResetPasswordMutation();

  const [email, setEmail] = useState(null)
  const schema = Yup.object({
    company_id: Yup.string().required("Organisation is required"),
    email: Yup.string().email("Enter valid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await employeeLogin(data).unwrap();
      console.log("eres", result);
      // debugger;
      if (result?.status && result?.first_login) {
        setTimeout(() => {
          setEmail(result?.email ?? null)
          setShowModal(!showModal)
        }, 500)
      }
      if (result?.status && (!result?.first_login)) {
        const { access_token, name, role, sub_vendor_id, vendor_id,email } = result
        localStorage.setItem('token', access_token)
        localStorage.setItem('name', name)
        localStorage.setItem('role', role)
        localStorage.setItem('subvendorId', sub_vendor_id)
        localStorage.setItem('vendorId', vendor_id)
        localStorage.setItem('email',email)
        toast.success("Subvendor Login Successfully")
        setTimeout(() => {
          navigate('/subvendor/dashboard')
        }, 500)
      }
    } catch (err) {
      console.log("err", err);
      toast.error(err?.data?.detail ?? "Internal Server Error")
    }

  };

  const navigate = useNavigate()

  const handleConfirmFirstLogin = async () => {
    const formdata = new FormData();
    formdata.append('email', email);

    try {
      const result = await employeeResetPassword(formdata);
      if (result?.data?.status) {
        toast.success(result?.data?.message);
        setTimeout(() => {
          navigate(`/reset-password/subvendor?email=${result?.data?.email}`)
        }, 1000)
      }
    } catch (err) {

      toast.error(err?.data?.message ?? "Internal Server Error");
    }
  };

  if (organisationLoading) {
    return <Loader />
  }

  if (organisationError) {
    return <ErrorPage />
  }
  
  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE BRAND PANEL */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-[#0f3c55] to-[#286a94] text-white flex-col justify-center px-16">

        <h1 className="text-4xl font-bold mb-6 leading-tight">
          eCampus Partner Portal
        </h1>

        <p className="text-lg opacity-90 mb-8">
          Manage student enrollments, assessments, and recruitment workflows
          in one unified platform.
        </p>

        <div className="space-y-3 text-sm opacity-90">
          <p>✔ Vendor onboarding</p>
          <p>✔ Student test management</p>
          <p>✔ Hiring workflow tracking</p>
          <p>✔ Analytics dashboard</p>
        </div>

        <div className="mt-12 text-xs opacity-70">
          © {new Date().getFullYear()} eCampus. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100">

        <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Team Member Login
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Access your organisation workspace
          </p>


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Organisation */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Organisation
              </label>
              <select
                {...register("company_id")}
                className="w-full mt-1 border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#286a94] outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Select organisation
                </option>

                {organisationData?.organizations?.length > 0 ? (
                  organisationData.organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No data found
                  </option>
                )}
              </select>
              {errors.company_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.company_id.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Work Email
              </label>
              <input
                type="email"
                autoComplete="work email"
                {...register("email")}
                placeholder="name@organisation.com"
                className="w-full mt-1 border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#286a94] outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                {...register("password")}
                placeholder="Enter password"
                className="w-full mt-1 border rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#286a94] outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={organisationLoading}
              className="w-full bg-[#286a94] hover:bg-[#1f5575] text-white font-semibold py-2.5 rounded-xl transition"
            >
              {subVendorLoading ? "Signing in..." : "Login to Workspace"}
            </button>

          </form>

          {/* footer */}
          <div className="text-xs text-gray-400 mt-6 text-center">
            Need access? Contact your organisation admin.
          </div>
        </div>
      </div>


      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Card */}
            <motion.div
              initial={{ scale: 0.7, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative w-full max-w-md mx-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-7 relative overflow-hidden">

                {/* Gradient highlight */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50 opacity-70" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 mx-auto mb-4"
                  >
                    <svg
                      className="w-7 h-7 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 11c0-3 2-5 5-5s5 2 5 5v4a5 5 0 01-10 0v-4z" />
                      <path d="M4 11a8 8 0 0116 0v4a8 8 0 01-16 0v-4z" />
                    </svg>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-center mb-2">
                    First Time Login
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
                    For security reasons, we’ll send a verification OTP to your registered
                    email so you can create a new password.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={handleConfirmFirstLogin}
                      className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"

                    >
                      {!resetLoading ? 'Send OTP' : 'Loading..'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubVendorLogin;
