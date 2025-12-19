
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = "https://bql-production.up.railway.app";

const SchoolAdminDashboard = () => {
  const adminToken = localStorage.getItem("adminToken");
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState({});
  const [filter, setFilter] = useState("all");

  const fetchSchools = async () => {
    if (!adminToken) return toast.error("Admin token not found. Please log in.");
    setLoading(true);
    try {
      let url = `${baseUrl}/schools`;
      switch (filter) {
        case "all": url = `${baseUrl}/schools/all`; break;
        case "approved": url = `${baseUrl}/schools/approved`; break;
        case "pending": url = `${baseUrl}/schools/pending`; break;
        case "disabled": url = `${baseUrl}/schools/disabled`; break;
      }
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${adminToken}` } });
      setSchools(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) fetchSchools();
  }, [adminToken, filter]);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleAction = async (schoolId, action) => {
    if (!adminToken) return toast.error("Please log in first");
    setLoadingAction(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], [action]: true } }));

    try {
      let url = `${baseUrl}/schools/${schoolId}`;
      if (action === "approve") url += "/approve";
      else if (action === "disable") url += "/disable";
      else if (action === "enable") url += "/enable";
      else if (action === "delete") {
        if (!window.confirm("Are you sure you want to delete this school?")) return;
        const res = await axios.delete(url, { headers: { Authorization: `Bearer ${adminToken}` } });
        if (res.status === 200) fetchSchools();
        return;
      }

      const res = await axios.patch(url, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
      if (res.status === 200) fetchSchools();
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setLoadingAction(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], [action]: false } }));
    }
  };

  const filteredSchools = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderActionButtons = (school) => (
    <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
      {["approve", "disable", "enable", "delete"].map((action) => (
        <button
          key={action}
          onClick={() => handleAction(school.id, action)}
          disabled={loadingAction[school.id]?.[action]}
          className={`w-full sm:w-auto px-1 sm:px-2 py-1 text-[9px] sm:text-xs rounded border hover:bg-gray-100 
            ${action === "delete" ? "border-red-500 text-red-500 hover:bg-red-50" :
            action === "approve" ? "border-green-500 text-green-500 hover:bg-green-50" :
            action === "disable" ? "border-yellow-500 text-yellow-500 hover:bg-yellow-50" :
            "border-gray-300 text-gray-700"}`}
        >
          {loadingAction[school.id]?.[action] ? "..." : action.charAt(0).toUpperCase() + action.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-2 sm:p-3 lg:p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-3">
        <h1 className="font-bold text-[12px] sm:text-sm lg:text-[25px]">School Management</h1>
        <p className="text-[9px] sm:text-xs lg:text-[16px] text-gray-600 mt-1">Manage registration, rosters and approvals</p>
      </div>

      {/* Filters + Search */}
      <div className="p-2 sm:p-3 lg:p-4 rounded-md">
        {/* Filters */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          {["all", "approved", "pending", "disabled"].map((f) => (
            <button
              key={f}
              className={`py-1 sm:py-2 text-[9px] sm:text-xs border rounded-full 
                ${filter === f ? "bg-[#001489] text-white" : "border-gray-300"}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-2 flex items-center text-gray-400 text-[9px] sm:text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search schools"
            value={search}
            onChange={handleSearch}
            className="w-full pl-5 sm:pl-6 pr-2 py-1 sm:py-2 text-[9px] sm:text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
        <table className="min-w-full table-fixed text-[9px] sm:text-xs lg:text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-1/2 px-1 py-1 sm:px-2 sm:py-1">School Name</th>
              <th className="w-1/4 px-1 py-1 sm:px-2 sm:py-1">Contact</th>
              <th className="w-1/4 px-1 py-1 sm:px-2 sm:py-1">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-1 text-center text-gray-500">Loading schools...</td>
              </tr>
            ) : filteredSchools.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-1 text-center text-gray-500">No schools found</td>
              </tr>
            ) : (
              filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-1 py-2 sm:px-2 sm:py-2 truncate">{school.name}</td>
                  <td className="px-1 py-2 sm:px-2 sm:py-2 truncate">{school.contactPhone || "-"}</td>
                  <td className="px-1 py-2 sm:px-2 sm:py-2">{filter === "all" ? renderActionButtons(school) : <span>-</span>}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
