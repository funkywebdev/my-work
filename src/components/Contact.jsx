import React, { useRef, useState } from "react";
import { FiMail, FiPhone, FiSend } from "react-icons/fi";
import emailjs from "emailjs-com";

import facebook from "../assets/images/facebook.png";
import tiktok from "../assets/images/tiktok.png";
import Group from "../assets/images/Group.png";
import linkedin from "../assets/images/linkedin.png";

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState(""); 
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(form.current);
  formData.forEach((value, key) => {
    console.log(key, value); 
  });

    emailjs
      .sendForm(
        "service_qzclyh8", // replace with EmailJS service ID
        "template_hn3545z", // replace with EmailJS template ID
        form.current,
        "W8LUTAQCleCNI4f1q" // replace with EmailJS public key
      )
      .then(
        (result) => {
          setStatus("success");
          setLoading(false);
          e.target.reset();
          setTimeout(() => setStatus(""), 5000); // Hide message after 5 sec
        },
        (error) => {
          console.log(error.text);
          setStatus("error");
          setLoading(false);
          setTimeout(() => setStatus(""), 5000); // Hide message after 5 sec
        }
      );
  };

  return (
    <section id="Contact" className="px-6 md:px-32 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Have questions? Get in touch via email, phone, or social media, and we’ll respond promptly.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Contact Form */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="md:col-span-2 flex flex-col gap-4"
        >
          <label className="font-medium">School Name</label>
          <input
            type="text"
            name="school_name"
            placeholder="Enter school name"
            required
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />

          <label className="font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            required
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />

          <label className="font-medium">Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="Select a subject"
            required
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />

          <label className="font-medium">Message</label>
          <textarea
            name="message"
            rows={5}
            placeholder="Type your message here"
            required
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#001489]"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-[#001489] text-white flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition w-full md:w-auto mt-2 hover:bg-[#0025c5] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <>
                <FiSend className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>

          {/* Status Message */}
          {status === "success" && (
            <p className="text-green-500 mt-2 font-medium">
              Message sent successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-500 mt-2 font-medium">
              Failed to send message. Please try again.
            </p>
          )}
        </form>

        {/* Contact Info Card */}
        <div className="bg-[#001489] text-white rounded-xl p-8 flex flex-col gap-4 w-full md:w-auto mx-auto md:mx-0">
          <h2 className="text-2xl font-semibold">Contact Information</h2>

          <p className="flex items-center gap-2 mt-3 text-lg">
            <FiMail className="w-5 h-5" />
            boloquiz626@gmail.com
          </p>

          <p className="flex items-center gap-2 mt-2 text-lg">
            <FiPhone className="w-5 h-5" />
            +234 801 234 5678
          </p>
    <div className="flex flex-wrap items-center gap-4 mt-4">
  {[
    {
      icon: facebook,
      url: "https://www.facebook.com/share/1A6MuerPbL/",
      name: "Facebook",
    },
    {
      icon: tiktok,
      url: "https://www.tiktok.com/@boloql?_r=1&_t=ZS-932QM9wcuUK",
      name: "TikTok",
    },
    {
      icon: Group,
      url: "#", 
      name: "Website",
    },
    {
      icon: linkedin,
      url: "#", 
      name: "LinkedIn",
    },
  ].map((item, idx) => (
    <a
      key={idx}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.name}
    >
      <img
        src={item.icon}
        alt={item.name}
        className="w-6 h-6 cursor-pointer transition-all hover:opacity-80 hover:scale-110"
      />
    </a>
  ))}
</div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
