import React, { useState } from "react";
import Sidebar from "../../components/admin-components/Sidebar";
import Header from "../../components/admin-components/Header";
import School from "../../components/admin-components/School";

const SchoolPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 p-4
          ${sidebarOpen ? "ml-60" : "ml-16"} md:ml-2
        `}
      >
        {/* Header */}
        <Header />

        {/* Dynamic content */}
        <div className="overflow-x-auto w-full">
          <School />
        </div>
      </div>
    </div>
  );
};

export default SchoolPage;
