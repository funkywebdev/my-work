import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Frame66 from "../../assets/images/Frame66.png";

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = "https://bql-production.up.railway.app";

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, data);

      const user = response.data.user;
      const token = response.data.access_token;

      console.log("ROLE:", user.role); // DEBUG CHECK

      // Save token based on role
      if (user.role === "platform_admin") {
        localStorage.setItem("adminToken", token);
        if (user.schools?.length > 0) {
          localStorage.setItem("schoolId", user.schools[0].id);
        }
        toast.success("Platform Admin Login successful!");
        navigate("/admindashboard"); // platform admin dashboard
      } 
      else if (user.role === "school_admin") {
        localStorage.setItem("schoolToken", token);
        if (user.schools?.length > 0) {
          localStorage.setItem("schoolId", user.schools[0].id);
        }
        toast.success("School Admin Login successful!");
        navigate("/dashboard"); // school admin dashboard
      } 
      else {
        toast.error("Access denied: Unauthorized role");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-8 md:py-14 min-h-screen">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">

        {/* Form */}
        <div className="order-1 md:order-2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#001489] mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full h-12 p-3 text-sm border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-[#001489]"
                {...register("email", { required: "Email is required" })}
              />
              <p className="text-red-500 text-xs">{errors.email?.message}</p>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full h-12 p-3 text-sm border rounded-lg outline-none border-gray-300 focus:ring-2 focus:ring-[#001489]"
                {...register("password", { required: "Password is required" })}
              />
              <p className="text-red-500 text-xs">{errors.password?.message}</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-[#001489] text-white py-3 rounded-lg font-semibold hover:bg-[#0025c5] transition
                ${loading ? "cursor-not-allowed opacity-70" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="order-2 md:order-1 flex items-center justify-center bg-[#001489]/10 p-6">
          <img src={Frame66} alt="Login graphic" className="w-full max-w-[350px] md:max-w-[400px] object-contain" />
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
