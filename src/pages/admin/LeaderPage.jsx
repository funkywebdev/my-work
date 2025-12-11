

import React, { useState } from "react";
import Sidebar from "../../components/admin-components/Sidebar";
import Header from "../../components/admin-components/Header";
import LeaderBoard from "../../components/admin-components/LeaderBoard";

const LeaderBoardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${sidebarOpen ? "ml-60" : "ml-16"} md:ml-2 h-screen overflow-y-auto p-4`}
      >
        {/* Header */}
        <Header title={selectedTab} subtitle="Here’s an overview of your dashboard" />

        {/* Dynamic content */}
        <div className="w-full overflow-x-auto">
          <LeaderBoard />
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardPage;
