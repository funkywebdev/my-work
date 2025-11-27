import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Frame66 from "../assets/images/Frame66.png";

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const newPassword = watch("newPassword");
  const navigate = useNavigate();
  const baseUrl = "https://bql-production.up.railway.app";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/reset-password`, {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      toast.success(response.data.message);
      localStorage.setItem("email", data.email);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="py-8 bg-gray-50 px-4 flex justify-center">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
        {/* IMAGE */}
        <div className="order-2 md:order-1 flex items-center justify-center bg-[#001489]/10 p-6">
          <img
            src={Frame66}
            alt="Password Reset"
            className="w-full max-w-[350px] md:max-w-[400px] object-contain"
          />
        </div>

        {/* FORM */}
        <div className="order-1 md:order-2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#001489] mb-6 text-center">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#001489]"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* OTP */}
            <div>
              <label className="text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                {...register("otp", { required: "OTP is required" })}
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#001489]"
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  className="w-full mt-1 mb-1 p-3 pr-12 border rounded-lg outline-none focus:ring-2 focus:ring-[#001489]"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === newPassword || "Passwords do not match",
                  })}
                  className="w-full mt-1 mb-1 p-3 pr-12 border rounded-lg outline-none focus:ring-2 focus:ring-[#001489]"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#001489] text-white py-3 rounded-lg font-semibold hover:bg-[#0025c5] transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
    
  );
};

export default ResetPassword;
