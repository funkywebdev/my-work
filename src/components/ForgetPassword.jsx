import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Frame66 from "../assets/images/Frame66.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = "https://bql-production.up.railway.app";

  const onSubmit = async (data) => {
    if (loading) return;

    setLoading(true);

    // Store new password locally
    localStorage.setItem("email", data.email);

    try {
      const response = await axios.post(`${baseUrl}/auth/forgot-password`, {
        email: data.email,
      });

      toast.success(response.data.message);
      // Optionally redirect after a short delay
      setTimeout(() => navigate("/reset"), 2000);
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
            Forget Password
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="w-full mt-1 mb-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#001489]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#001489] text-white py-3 rounded-lg font-semibold hover:bg-[#0025c5] transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <span
              className="text-[#001489] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/reset")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
