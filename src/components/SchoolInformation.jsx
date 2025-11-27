import React, { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import OTPInput from "../components/OTPInput";
import { Eye, EyeOff, Download } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/errorHandler";
import removebg from "../assets/images/removebg.png";

const SchoolInformation = () => {
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [otploading, setOTPLoading] = useState(false);
  const [postData, setPostData] = useState(null);
  const [countdown, setCountdown] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const baseUrl = "https://bql-production.up.railway.app";

  // COUNTDOWN EFFECT
  useEffect(() => {
    if (!postData) return;

    setCountdown(600);
    setCanResend(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [postData]);

  // SUBMIT FORM
  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();
    for (const key in data) formData.append(key, data[key]);

    axios
      .post(`${baseUrl}/auth/register`, formData)
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          toast.success(response.data.message);
          setPostData(data);
          modalRef.current?.showModal();
        }
      })
      .catch((err) => {
        console.log(err);
        handleAxiosError(err);
      })
      .finally(() => setLoading(false));
  };

  // VERIFY OTP
  const handleOtp = (otp) => {
    const data = { email: postData?.adminEmail, otp };
    setOTPLoading(true);

    axios
      .post(`${baseUrl}/auth/verify-otp`, data)
      .then((response) => {
        toast.success(response.data.message);
        modalRef.current?.close();
        navigate("/Login");
      })
      .catch(handleAxiosError)
      .finally(() => setOTPLoading(false));
  };

  // RESEND OTP
  const handleResendOTP = () => {
    if (!canResend || !postData?.adminEmail) return;

    setOTPLoading(true);

    axios
      .post(`${baseUrl}/auth/resend-verification-otp`, {
        email: postData.adminEmail,
      })
      .then((response) => {
        toast.success(response.data.message);
        setCountdown(600);
        setCanResend(false);
      })
      .catch(handleAxiosError)
      .finally(() => setOTPLoading(false));
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-[#001489] p-4 flex items-center gap-4 shadow-md">
        <img src={removebg} alt="Logo" className="w-24 h-auto object-contain" />
        <p className="text-white font-bold sm:text-2xl text-center sm:mx-auto">
          School Registration
        </p>
      </nav>

      {/* MAIN FORM */}
      <div className="flex justify-center px-4 sm:px-6 mt-4 sm:mt-8">
        <div className="w-full bg-white shadow-lg rounded-xl p-6 sm:p-10 sm:max-w-[1200px]">
          <h2 className="text-2xl font-bold mb-2">School Information</h2>
          <p className="text-gray-500 mb-6">Tell us about your school</p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 sm:grid-cols-2"
          >
            {/* SCHOOL NAME */}
            <div className="sm:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                {...register("schoolName", {
                  required: "School name is required",
                })}
                placeholder="Enter your school name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#001489] focus:border-[#001489] outline-none transition"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolName?.message}
              </p>
            </div>

            {/* SCHOOL ADDRESS */}
            <div className="sm:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">
                School Address
              </label>
              <input
                {...register("schoolAddress", {
                  required: "School address is required",
                })}
                placeholder="Enter school address"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#001489] focus:border-[#001489] outline-none transition"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolAddress?.message}
              </p>
            </div>

            {/* ADMIN FIRST & LAST NAME */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Admin Firstname
              </label>
              <input
                {...register("adminFirstName", {
                  required: "First name is required",
                })}
                placeholder="John"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#001489] focus:border-[#001489] outline-none transition"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.adminFirstName?.message}
              </p>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Admin Lastname
              </label>
              <input
                {...register("adminLastName", {
                  required: "Last name is required",
                })}
                placeholder="Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#001489] focus:border-[#001489] outline-none transition"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.adminLastName?.message}
              </p>
            </div>

            {/* SCHOOL EMAIL */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                School Email
              </label>
              <input
                {...register("schoolContactEmail", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                })}
                type="email"
                placeholder="school@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#001489] focus:border-[#001489] outline-none transition"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolContactEmail?.message}
              </p>
            </div>

            {/* SCHOOL PHONE */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                School Phone
              </label>
              <input
                {...register("schoolContactPhone", {
                  required: "Phone number is required",
                })}
                placeholder="+234 801 234 5678"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#001489] focus:border-[#001489] outline-none transition"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.schoolContactPhone?.message}
              </p>
            </div>

            {/* ADMIN EMAIL + PASSWORD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:col-span-2">
              {/* ADMIN EMAIL */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  {...register("adminEmail", {
                    required: "Admin email is required",
                    pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                  })}
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#001489] focus:border-[#001489] outline-none transition"
                />
                <p className="text-red-500 text-sm mt-1">
                  {errors.adminEmail?.message}
                </p>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("adminPassword", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-[#001489] focus:border-[#001489] outline-none transition"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
                <p className="text-red-500 text-sm mt-1">
                  {errors.adminPassword?.message}
                </p>
              </div>
            </div>

            {/* LOGO UPLOAD */}
            <div className="sm:col-span-2 p-6 text-center border border-dashed border-gray-400 rounded-lg">
              <Download className="mx-auto mb-3" size={28} />
              <p className="font-semibold mb-3">Upload School Logo</p>

              <input
                type="file"
                accept="image/*"
                {...register("logo", { required: "School logo is required" })}
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setValue("logo", file);
                  trigger("logo");
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-6 py-2 bg-[#001489] text-white rounded"
              >
                Browse File
              </button>

              {watch("logo") && (
                <p className="mt-2 text-green-600">{watch("logo").name}</p>
              )}
              <p className="text-red-500 text-sm">{errors.logo?.message}</p>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="sm:col-span-2 text-right">
              <button
                type="submit"
                className="px-6 py-2 bg-[#001489] text-white rounded-lg hover:bg-[#001489]/90 transition"
              >
                {loading ? "Submitting..." : "Continue"}
              </button>
            </div>
          </form>

          {/* OTP MODAL */}
          <Modal modalRef={modalRef}>
            <h2 className="text-2xl font-bold text-[#001489] mb-2">
              Enter OTP
            </h2>
            <p className="text-gray-600 mb-4">
              OTP sent to <b>{postData?.adminEmail}</b>
            </p>

            {otploading ? (
              <Spinner />
            ) : (
              <OTPInput length={6} onComplete={handleOtp} />
            )}

            <p
              className={`mt-4 text-[#001489] font-medium ${
                canResend ? "cursor-pointer underline" : "opacity-50"
              }`}
              onClick={canResend ? handleResendOTP : undefined}
            >
              {canResend
                ? "Click here to resend OTP"
                : `Resend available in ${Math.floor(countdown / 60)}:${String(
                    countdown % 60
                  ).padStart(2, "0")}`}
            </p>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default SchoolInformation;
