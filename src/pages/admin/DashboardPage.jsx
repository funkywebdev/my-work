import React, { useState } from "react";
import Sidebar from "../../components/admin-components/Sidebar";
import Header from "../../components/admin-components/Header";
import Dashboard from "../../components/admin-components/Dashboard"


const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  return (
    <div className="flex min-h-screen overflow-x-hidden ">
      
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} selectedTab={selectedTab}
        setSelectedTab={setSelectedTab} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${sidebarOpen ? "ml-60" : "ml-16"} md:ml-2 h-screen overflow-y-auto p-4
        `}
      >
        {/* Header */}
         <Header />

        {/* Dynamic content */}
         <div className="w-full overflow-x-auto">
        <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
