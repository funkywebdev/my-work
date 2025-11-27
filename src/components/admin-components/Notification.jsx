import React, { useState } from "react";
import { FiChevronDown, FiBell } from "react-icons/fi";

const Notification = () => {
  const [audience, setAudience] = useState("All participants");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const options = ["All participants", "Group A", "Group B", "Staff"];

  const handleSelect = (option) => {
    setAudience(option);
    setIsDropdownOpen(false);
  };

  const announcements = [
    {
      message: "Round of 16 matches will begin at 2PM EST",
      time: "Just now",
    },
    {
      message: "Quarter-final schedule has been updated",
      time: "10 minutes ago",
    },
    {
      message: "Team registrations have been successfully closed",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <p className="text-2xl font-semibold text-[#001489]">Notifications & Announcements</p>
        <p className="text-gray-600">Broadcast messages to participants</p>
      </div>

      {/* Form Card */}
      <div className="shadow-md border border-gray-200 rounded-md p-4 space-y-4 bg-white">
        <p className="text-[#001489] font-semibold text-xl">Compose Announcement</p>

        {/* Audience Selector */}
        <div className="space-y-1">
          <p className="font-medium text-gray-700">Audience</p>
          <div
            className="border border-gray-300 rounded-md px-3 py-2 flex justify-between items-center cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{audience}</span>
            <FiChevronDown className="text-gray-500" />
          </div>

          {isDropdownOpen && (
            <div className="border border-gray-300 rounded-md mt-1 bg-white shadow-md">
              {options.map((option, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="space-y-1">
          <p className="font-medium text-gray-700">Message</p>
          <textarea
            rows={3}
            placeholder="Type your announcement here"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#001489] resize-none"
          />
        </div>

        {/* Send Button */}
        <div>
          <button className="w-full px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-blue-700">
            Send Now
          </button>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="space-y-4">
        <p className="text-[#001489] font-semibold text-lg">Recent Announcements</p>
        {announcements.map((item, index) => (
          <div
            key={index}
            className="space-y-3 p-4 border border-gray-200 rounded-md shadow-sm"
          >
            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
              {/* Bell Icon */}
              <FiBell className="text-[#001489] text-xl mt-1" />

              {/* Announcement Text */}
              <div className="flex flex-col">
                <p className="text-gray-800 font-medium">{item.message}</p>
                <p className="text-gray-500 text-sm">{item.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
