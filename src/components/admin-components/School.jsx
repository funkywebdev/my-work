// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const baseUrl = "https://bql-production.up.railway.app";

// const SchoolAdminDashboard = () => {
//   const adminToken = localStorage.getItem("adminToken");
//   const [schools, setSchools] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loadingAction, setLoadingAction] = useState({}); // per school, per action
//   const [filter, setFilter] = useState("all");

//   // --- Fetch schools based on filter ---
//   const fetchSchools = async () => {
//     if (!adminToken) {
//       toast.error("Admin token not found. Please log in.");
//       return;
//     }

//     setLoading(true);
//     try {
//       let url = `${baseUrl}/schools`;
//       switch (filter) {
//         case "all":
//           url = `${baseUrl}/schools/all`;
//           break;
//         case "approved":
//           url = `${baseUrl}/schools/approved`;
//           break;
//         case "pending":
//           url = `${baseUrl}/schools/pending`;
//           break;
//         case "disabled":
//           url = `${baseUrl}/schools/disabled`;
//           break;
//       }

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${adminToken}` },
        
//       });

//       setSchools(res.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to fetch schools");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (adminToken) fetchSchools();
//   }, [adminToken, filter]);

//   const handleSearch = (e) => setSearch(e.target.value);

//   // --- Actions: approve, disable, enable, delete ---
//   const handleAction = async (schoolId, action) => {
//     if (!adminToken) return toast.error("Please log in first");

//     setLoadingAction(prev => ({
//       ...prev,
//       [schoolId]: { ...prev[schoolId], [action]: true },
//     }));

//     try {
//       let url = `${baseUrl}/schools/${schoolId}`;
//       if (action === "approve") url += "/approve";
//       else if (action === "disable") url += "/disable";
//       else if (action === "enable") url += "/enable";
//       else if (action === "delete") {
//         if (!window.confirm("Are you sure you want to delete this school?")) return;
//         const res = await axios.delete(url, {
//           headers: { Authorization: `Bearer ${adminToken}` },
//         });
//         if (res.status === 200) {
//           toast.success("School deleted successfully!");
//           fetchSchools();
//         }
//         return;
//       }

//       const res = await axios.patch(url, {}, { headers: { Authorization: `Bearer ${adminToken}` } });

//       if (res.status === 200) {
//         toast.success(`School ${action}d successfully!`);
//         fetchSchools();
//       } else {
//         toast.error(`Failed to ${action} school`);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || `Failed to ${action} school`);
//     } finally {
//       setLoadingAction(prev => ({
//         ...prev,
//         [schoolId]: { ...prev[schoolId], [action]: false },
//       }));
//     }
//   };

//   const filteredSchools = schools.filter((s) =>
//     s.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // --- Determine buttons per school status ---
//  const renderActionButtons = (school) => {
//   const status = (school.status || "").toLowerCase(); // default to empty string

//   return (
//     <div className="flex gap-1 justify-center">
//       {status !== "approved" && (
//         <button
//           className="px-2  bg-green-600 text-white rounded hover:bg-green-700 text-xs flex-1"
//           onClick={() => handleAction(school.id, "approve")}
//           disabled={loadingAction[school.id]?.approve}
//         >
//           {loadingAction[school.id]?.approve ? "..." : "Approve"}
//         </button>
//       )}
//       {status !== "disabled" && (
//         <button
//           className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs flex-1"
//           onClick={() => handleAction(school.id, "disable")}
//           disabled={loadingAction[school.id]?.disable}
//         >
//           {loadingAction[school.id]?.disable ? "..." : "Disable"}
//         </button>
//       )}
//       {status === "disabled" && (
//         <button
//           className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs flex-1"
//           onClick={() => handleAction(school.id, "enable")}
//           disabled={loadingAction[school.id]?.enable}
//         >
//           {loadingAction[school.id]?.enable ? "..." : "Enable"}
//         </button>
//       )}
//       <button
//         className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs flex-1"
//         onClick={() => handleAction(school.id, "delete")}
//         disabled={loadingAction[school.id]?.delete}
//       >
//         {loadingAction[school.id]?.delete ? "Deleting..." : "Delete"}
//       </button>
//     </div>
//   );
// };

//   return (
//     <div className="p-2 sm:p-4">
//       <h1 className="font-bold text-2xl mb-5">School Management</h1>

//       {/* Filters */}
//       <div className="flex gap-2 mb-3 flex-wrap">
//         {["all", "approved", "pending", "disabled"].map((f) => {
//           const bg =
//             filter === f
//               ? f === "all"
//                 ? "bg-blue-600 text-white"
//                 : f === "approved"
//                 ? "bg-green-600 text-white"
//                 : f === "pending"
//                 ? "bg-orange-600 text-white"
//                 : "bg-red-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300";
//           return (
//             <button
//               key={f}
//               className={`px-3 py-1 rounded-lg text-sm font-semibold ${bg}`}
//               onClick={() => setFilter(f)}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)} Schools
//             </button>
//           );
//         })}
//       </div>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search schools"
//           className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//           value={search}
//           onChange={handleSearch}
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg shadow-md">
//         <div className="min-w-[500px]">
//           <div className="grid grid-cols-3 bg-gray-100 font-semibold py-2 px-2 text-center text-sm rounded-t-lg">
//             <span className="text-left">School Name</span>
//             <span>Contact</span>
//             <span>Actions</span>
//           </div>

//           {loading ? (
//             <div className="p-4 text-center text-gray-500">Loading schools...</div>
//           ) : filteredSchools.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">No schools found</div>
//           ) : (
//             filteredSchools.map((school) => (
//               <div
//                 key={school.id}
//                 className="grid grid-cols-3 p-2 border-b border-gray-200 items-center text-center hover:bg-gray-50 text-sm"
//               >
//                 <span className="truncate text-left">{school.name}</span>
//                 <span>{school.contactPhone || "-"}</span>
//                 {filter === "all" ? renderActionButtons(school) : <span>-</span>}

//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default SchoolAdminDashboard;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const baseUrl = "https://bql-production.up.railway.app";

// const SchoolAdminDashboard = () => {
//   const adminToken = localStorage.getItem("adminToken");
//   const [schools, setSchools] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loadingAction, setLoadingAction] = useState({});
//   const [filter, setFilter] = useState("all");

//   // --- Fetch schools based on filter ---
//   const fetchSchools = async () => {
//     if (!adminToken) {
//       toast.error("Admin token not found. Please log in.");
//       return;
//     }

//     setLoading(true);
//     try {
//       let url = `${baseUrl}/schools`;
//       switch (filter) {
//         case "all": url = `${baseUrl}/schools/all`; break;
//         case "approved": url = `${baseUrl}/schools/approved`; break;
//         case "pending": url = `${baseUrl}/schools/pending`; break;
//         case "disabled": url = `${baseUrl}/schools/disabled`; break;
//       }

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       });

//       setSchools(res.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to fetch schools");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (adminToken) fetchSchools();
//   }, [adminToken, filter]);

//   const handleSearch = (e) => setSearch(e.target.value);

//   // --- Actions: approve, disable, enable, delete ---
//   const handleAction = async (schoolId, action) => {
//     if (!adminToken) return toast.error("Please log in first");

//     setLoadingAction(prev => ({
//       ...prev,
//       [schoolId]: { ...prev[schoolId], [action]: true },
//     }));

//     try {
//       let url = `${baseUrl}/schools/${schoolId}`;
//       if (action === "approve") url += "/approve";
//       else if (action === "disable") url += "/disable";
//       else if (action === "enable") url += "/enable";
//       else if (action === "delete") {
//         if (!window.confirm("Are you sure you want to delete this school?")) return;
//         const res = await axios.delete(url, {
//           headers: { Authorization: `Bearer ${adminToken}` },
//         });
//         if (res.status === 200) {
//           toast.success("School deleted successfully!");
//           fetchSchools();
//         }
//         return;
//       }

//       const res = await axios.patch(url, {}, { headers: { Authorization: `Bearer ${adminToken}` } });

//       if (res.status === 200) {
//         toast.success(`School ${action}d successfully!`);
//         fetchSchools();
//       } else {
//         toast.error(`Failed to ${action} school`);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || `Failed to ${action} school`);
//     } finally {
//       setLoadingAction(prev => ({
//         ...prev,
//         [schoolId]: { ...prev[schoolId], [action]: false },
//       }));
//     }
//   };

//   const filteredSchools = schools.filter((s) =>
//     s.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // --- Determine buttons per school status ---
//   const renderActionButtons = (school) => {
//     const status = (school.status || "").toLowerCase();
//     return (
//       <div className="flex flex-wrap gap-1 justify-center">
//         {status !== "approved" && (
//           <button
//             className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs sm:text-sm"
//             onClick={() => handleAction(school.id, "approve")}
//             disabled={loadingAction[school.id]?.approve}
//           >
//             {loadingAction[school.id]?.approve ? "..." : "Approve"}
//           </button>
//         )}
//         {status !== "disabled" && (
//           <button
//             className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-sm"
//             onClick={() => handleAction(school.id, "disable")}
//             disabled={loadingAction[school.id]?.disable}
//           >
//             {loadingAction[school.id]?.disable ? "..." : "Disable"}
//           </button>
//         )}
//         {status === "disabled" && (
//           <button
//             className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs sm:text-sm"
//             onClick={() => handleAction(school.id, "enable")}
//             disabled={loadingAction[school.id]?.enable}
//           >
//             {loadingAction[school.id]?.enable ? "..." : "Enable"}
//           </button>
//         )}
//         <button
//           className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm"
//           onClick={() => handleAction(school.id, "delete")}
//           disabled={loadingAction[school.id]?.delete}
//         >
//           {loadingAction[school.id]?.delete ? "Deleting..." : "Delete"}
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen p-2 sm:p-4">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h1 className="font-bold text-2xl mb-5">School Management</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 mb-4">
//         {["all", "approved", "pending", "disabled"].map((f) => {
//           const bg =
//             filter === f
//               ? f === "all"
//                 ? "bg-blue-600 text-white"
//                 : f === "approved"
//                 ? "bg-green-600 text-white"
//                 : f === "pending"
//                 ? "bg-orange-600 text-white"
//                 : "bg-red-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300";
//           return (
//             <button
//               key={f}
//               className={`px-3 py-1 rounded-lg text-sm font-semibold ${bg}`}
//               onClick={() => setFilter(f)}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)} Schools
//             </button>
//           );
//         })}
//       </div>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search schools"
//           className="border border-gray-300 rounded-lg px-3 py-2 w-full text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//           value={search}
//           onChange={handleSearch}
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg shadow-md bg-white">
//         <table className="min-w-full table-fixed divide-y divide-gray-200 text-xs sm:text-sm text-center">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="w-1/2 px-3 py-2 text-left">School Name</th>
//               <th className="w-1/4 px-3 py-2">Contact</th>
//               <th className="w-1/4 px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={3} className="p-4 text-center text-gray-500">
//                   Loading schools...
//                 </td>
//               </tr>
//             ) : filteredSchools.length === 0 ? (
//               <tr>
//                 <td colSpan={3} className="p-4 text-center text-gray-500">
//                   No schools found
//                 </td>
//               </tr>
//             ) : (
//               filteredSchools.map((school) => (
//                 <tr key={school.id} className="hover:bg-gray-50">
//                   <td className="px-3 py-2 text-left truncate">{school.name}</td>
//                   <td className="px-3 py-2 truncate">{school.contactPhone || "-"}</td>
//                   <td className="px-3 py-2">{filter === "all" ? renderActionButtons(school) : <span>-</span>}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SchoolAdminDashboard;


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

  console.log(schools);

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
    <div className="flex flex-wrap gap-1 justify-center">
      {["approve", "disable", "enable", "delete"].map((action) => (
        <button
          key={action}
          onClick={() => handleAction(school.id, action)}
          disabled={loadingAction[school.id]?.[action]}
          className={`px-2 py-1 text-[10px] sm:text-xs rounded border hover:bg-gray-100 
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
    <div className="min-h-screen p-3 sm:p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="mb-4">
        <h1 className="font-bold text-lg sm:text-xl mb-1">School Management</h1>
        <p className="text-sm text-gray-600">Manage registration, rosters and approvals</p>
      </div>

      {/* Filters + Search Container */}
      <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-md mb-4">
        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-3">
          {["all", "approved", "pending", "disabled"].map((f) => (
            <button
              key={f}
              className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border  rounded-full
                ${filter === f ? "bg-[#001489] text-white" : "border-gray-300"}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
  <div className="relative w-full">
  <span className="absolute inset-y-0 left-2 flex items-center text-gray-400">
    🔍
  </span>
    <input
    type="text"
    placeholder="Search schools"
    value={search}
    onChange={handleSearch}
    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
  />
      </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
        <table className="min-w-full table-fixed text-xs sm:text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-1/2 px-2 py-1 sm:py-2">School Name</th>
              <th className="w-1/4 px-2 py-1 sm:py-2">Contact</th>
              <th className="w-1/4 px-2 py-1 sm:py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-2 text-center text-gray-500">Loading schools...</td>
              </tr>
            ) : filteredSchools.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-2 text-center text-gray-500">No schools found</td>
              </tr>
            ) : (
              filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-2 py-1 sm:py-2 truncate">{school.name}</td>
                  <td className="px-2 py-1 sm:py-2 truncate">{school.contactPhone || "-"}</td>
                  <td className="px-2 py-1 sm:py-2">{filter === "all" ? renderActionButtons(school) : <span>-</span>}</td>
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
