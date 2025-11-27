
import React, { useState } from "react";
import Frame66 from "../assets/images/Frame66.png";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = "https://bql-production.up.railway.app";

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, data);

      
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("adminToken", response.data.access_token);
        localStorage.setItem("schoolId", response.data.user.schools[0].id)
        toast.success(response.data.message || "Login successful!");

        setTimeout(() => {
          navigate("/roaster");
        }, 1200);
      }
    } catch (error) {
    
      const msg = error.response?.data?.message || "Login failed!";
      toast.error(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-8 md:py-14">
      <ToastContainer />

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">

        {/* FORM */}
        <div className="order-1 md:order-2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#001489] mb-6 text-center">
            Login
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* EMAIL FIELD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className={`w-full h-12 p-3 text-sm border rounded-lg outline-none transition-all
                  ${
                    errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:ring-2 focus:ring-[#001489]"
                  }`}
                {...register("email", { required: "Email is required" })}
              />
              <p className="text-red-500 text-xs leading-4">
                {errors.email?.message}
              </p>
            </div>

            {/* PASSWORD FIELD */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className={`w-full h-12 p-3 text-sm border rounded-lg outline-none transition-all
                  ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:ring-2 focus:ring-[#001489]"
                  }`}
                {...register("password", { required: "Password is required" })}
              />
              <p className="text-red-500 text-xs leading-4">
                {errors.password?.message}
              </p>
            </div>

            {/* FORGOT PASSWORD LINK */}
            <p
              className="text-sm text-[#001489] font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/forget")}
            >
              Forgot Password?
            </p>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className={`w-full bg-[#001489] text-white py-3 rounded-lg font-semibold hover:bg-[#0025c5] transition ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>

        {/* IMAGE */}
        <div className="order-2 md:order-1 flex items-center justify-center bg-[#001489]/10 p-6">
          <img
            src={Frame66}
            alt="Login graphic"
            className="w-full max-w-[350px] md:max-w-[400px] object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default Login;
