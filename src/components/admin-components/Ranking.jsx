

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaSchool, FaRegQuestionCircle } from "react-icons/fa";
// import { RiLiveLine } from "react-icons/ri";
// import { FaUserGraduate } from "react-icons/fa6";
// import { CiSearch } from "react-icons/ci";

// const Dashboard = () => {
//   const [students, setStudents] = useState([]);
//   const [schools, setSchools] = useState([]);

//   // TOP CARDS STATS
//   const [stats, setStats] = useState({
//     totalSchools: 0,
//     questionsAsked: 0,
//     activeMatches: 0,
//     activeStudents: 0,
//   });

//   const [selectedSchool, setSelectedSchool] = useState(
//     localStorage.getItem("schoolId") || ""
//   );

//   const [gradeLevel, setGradeLevel] = useState("");
//   const [activeTab, setActiveTab] = useState("All");
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");

//   const authToken = localStorage.getItem("adminToken");
//   const baseUrl = "https://bql-production.up.railway.app";

//   /** ------------------------
//    * FETCH SCHOOLS
//    ------------------------ **/
//   const fetchSchools = async () => {
//     try {
//       const { data } = await axios.get(`${baseUrl}/schools`, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });

//       setSchools(data);
//       setStats((prev) => ({ ...prev, totalSchools: data.length }));
//     } catch (err) {
//       console.log("Error fetching schools:", err);
//     }
//   };

//   /** ------------------------
//    * FETCH STATS
//    ------------------------ **/
//   const fetchStats = async () => {
//     try {
//       const { data } = await axios.get(`${baseUrl}/students/all`, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });

//       setStats((prev) => ({
//         ...prev,
//         activeStudents: data.length,
//         questionsAsked: data.length * 10,
//         activeMatches: Math.floor(data.length / 5),
//       }));
//     } catch (err) {
//       console.log("Error fetching stats:", err);
//     }
//   };

//   /** ------------------------
//    * FETCH STUDENTS
//    ------------------------ **/
//   const fetchStudents = async () => {
//     setLoading(true);

//     try {
//       let url = `${baseUrl}/students/all`;

//       if (activeTab === "By School" && selectedSchool) {
//         url = `${baseUrl}/students?schoolId=${selectedSchool}`;
//       }

//       if (activeTab === "By Grade" && selectedSchool && gradeLevel) {
//         url = `${baseUrl}/students?schoolId=${selectedSchool}&gradeLevel=${gradeLevel}`;
//       }

//       const { data } = await axios.get(url, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });

//       setStudents(data);
//     } catch (err) {
//       console.log("Error fetching students:", err);
//     }

//     setLoading(false);
//   };

//   /** ------------------------
//    * FETCH COUNT
//    ------------------------ **/
//   const fetchStudentCount = async () => {
//     if (!selectedSchool) return;
//     setLoading(true);

//     try {
//       const { data } = await axios.get(
//         `${baseUrl}/students/school/${selectedSchool}/count`,
//         { headers: { Authorization: `Bearer ${authToken}` } }
//       );

//       setStudents([{ count: data.count }]);
//     } catch (err) {
//       console.log("Error fetching count:", err);
//     }

//     setLoading(false);
//   };

//   /** ------------------------
//    * USE EFFECTS
//    ------------------------ **/
//   useEffect(() => {
//     fetchSchools();
//     fetchStats();
//   }, []);

//   useEffect(() => {
//     if (activeTab === "Count") {
//       fetchStudentCount();
//     } else {
//       fetchStudents();
//     }
//   }, [activeTab, selectedSchool, gradeLevel]);

//   /** ------------------------
//    * SEARCH FILTER
//    ------------------------ **/
//   const filteredStudents =
//     activeTab === "Count"
//       ? students
//       : students.filter((s) =>
//           s.name?.toLowerCase().includes(search.toLowerCase())
//         );

//   /** ------------------------
//    * UI
//    ------------------------ **/
//   return (
//     <div className="w-full">
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-[#1115CB] text-white p-4 rounded-xl shadow flex flex-col items-start">
//           <FaSchool size={26} className="mb-2" />
//           <p className="text-sm font-medium">Total Schools</p>
//           <p className="text-2xl font-bold">{stats.totalSchools}</p>
//         </div>

//         <div className="bg-black text-white p-4 rounded-xl shadow flex flex-col items-start">
//           <FaRegQuestionCircle size={26} className="mb-2" />
//           <p className="text-sm font-medium">Questions Asked</p>
//           <p className="text-2xl font-bold">{stats.questionsAsked}</p>
//         </div>

//         <div className="bg-[#C837AB] text-white p-4 rounded-xl shadow flex flex-col items-start">
//           <RiLiveLine size={26} className="mb-2" />
//           <p className="text-sm font-medium">Active Matches</p>
//           <p className="text-2xl font-bold">{stats.activeMatches}</p>
//         </div>

//         <div className="bg-[#641408] text-white p-4 rounded-xl shadow flex flex-col items-start">
//           <FaUserGraduate size={26} className="mb-2" />
//           <p className="text-sm font-medium">Active Students</p>
//           <p className="text-2xl font-bold">{stats.activeStudents}</p>
//         </div>
//       </div>

      

//       {/* TABS */}
//       <div className=" gap-2 mb-4 overflow-x-auto grid grid-cols-2 sm:grid-cols-4">
//         {["All", "By School", "By Grade", "Count"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-full text-sm font-medium ${
//               activeTab === tab
//                 ? "bg-[#001489] text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* SEARCH BAR ALWAYS VISIBLE */}
//       <div className="relative w-full mb-4">
//         <CiSearch className="absolute left-3 top-3 text-gray-500" size={20} />
//         <input
//           type="text"
//           placeholder="Search student by name"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-10 pr-3 py-2 border rounded text-sm"
//         />
//       </div>

//       {/* FILTERS VISIBLE IN BY SCHOOL + BY GRADE + COUNT*/}
//       {(activeTab === "By School" ||
//         activeTab === "By Grade" ||
//         activeTab === "Count") && (
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <select
//             value={selectedSchool}
//             onChange={(e) => setSelectedSchool(e.target.value)}
//             className="border px-3 py-2 rounded text-sm"
//           >
//             <option value="">Select School</option>
//             {schools.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </select>

//           {activeTab === "By Grade" && (
//             <select
//               value={gradeLevel}
//               onChange={(e) => setGradeLevel(e.target.value)}
//               className="border px-3 py-2 rounded text-sm"
//             >
//               <option value="">Select Grade</option>
//               <option value="jss1">JSS1</option>
//               <option value="jss2">JSS2</option>
//               <option value="jss3">JSS3</option>
//               <option value="ss1">SS1</option>
//               <option value="ss2">SS2</option>
//               <option value="ss3">SS3</option>
//             </select>
//           )}
//         </div>
//       )}


//   <div className="bg-white shadow rounded-lg overflow-x-auto">
//   {loading ? (
//     <p className="p-4 text-gray-500">Loading...</p>
//   ) : filteredStudents.length === 0 ? (
//     <p className="p-4 text-gray-500">No records found</p>
//   ) : (
//     <div className="min-w-full">
//       <table className="w-full table-auto border-collapse text-sm">
//         <thead className="bg-gray-100 sticky top-0 z-10">
//           <tr>
//             <th className="px-4 py-2 text-left border-b">#</th>
//             {activeTab === "Count" ? (
//               <th className="px-4 py-2 text-left border-b">Total Students</th>
//             ) : (
//               <>
//                 <th className="px-4 py-2 text-left border-b">Name</th>
//                 <th className="px-4 py-2 text-left border-b">School</th>
//                 <th className="px-4 py-2 text-left border-b">Grade</th>
//                 <th className="px-4 py-2 text-left border-b">STEM Strength</th>
//               </>
//             )}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredStudents.map((st, index) => (
//             <tr key={index} className="hover:bg-gray-50 border-b">
//               <td className="px-4 py-2">{index + 1}</td>

//               {activeTab === "Count" ? (
//                 <td className="px-4 py-2 font-semibold">{st.count}</td>
//               ) : (
//                 <>
//                   <td className="px-4 py-2">{st.name}</td>
//                   <td className="px-4 py-2">{st.schoolName}</td>
//                   <td className="px-4 py-2">{st.gradeLevel?.toUpperCase()}</td>
//                   <td className="px-4 py-2">{st.stemStrength || "-"}</td>
//                 </>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )}
// </div>

//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSchool, FaRegQuestionCircle } from "react-icons/fa";
import { RiLiveLine } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(
    localStorage.getItem("schoolId") || ""
  );
  const [gradeLevel, setGradeLevel] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [stats, setStats] = useState({
    totalSchools: 0,
    questionsAsked: 0,
    activeMatches: 0,
    activeStudents: 0,
  });

  const authToken = localStorage.getItem("adminToken");
  const baseUrl = "https://bql-production.up.railway.app";



  /** Fetch schools */
  const fetchSchools = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/schools`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      

      setSchools(data);
      setStats((prev) => ({ ...prev, totalSchools: data.length }));
    } catch (err) {
      console.log("Error fetching schools:", err);
    }
  };



  /** Fetch stats */
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/students/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setStats((prev) => ({
        ...prev,
        activeStudents: data.length,
        questionsAsked: data.length * 10,
        activeMatches: Math.floor(data.length / 5),
      }));
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  };

  /** Fetch students */
  const fetchStudents = async () => {
    setLoading(true);
    try {
      let url = `${baseUrl}/students/all`;

      if (activeTab === "By School" && selectedSchool) {
        url = `${baseUrl}/students?schoolId=${selectedSchool}`;
      }

      if (activeTab === "By Grade" && selectedSchool && gradeLevel) {
        url = `${baseUrl}/students?schoolId=${selectedSchool}&gradeLevel=${gradeLevel}`;
      }

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setStudents(data);
    } catch (err) {
      console.log("Error fetching students:", err);
    }
    setLoading(false);
  };

  /** Fetch student count */
  const fetchStudentCount = async () => {
    if (!selectedSchool) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseUrl}/students/school/${selectedSchool}/count`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setStudents([{ count: data.count }]);
    } catch (err) {
      console.log("Error fetching count:", err);
    }
    setLoading(false);
  };

  /** Effects */
  useEffect(() => {
    fetchSchools();
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "Count") fetchStudentCount();
    else fetchStudents();
  }, [activeTab, selectedSchool, gradeLevel]);

  /** Filtered students for search */
  const filteredStudents =
    activeTab === "Count"
      ? students
      : students.filter((s) => {
          const searchText = search.toLowerCase();
          return (
            s.name?.toLowerCase().includes(searchText) ||
            s.schoolName?.toLowerCase().includes(searchText) ||
            s.gradeLevel?.toLowerCase().includes(searchText) ||
            s.stemStrength?.toLowerCase().includes(searchText)
          );
        });

  return (
    <div className="w-full p-4 md:p-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1115CB] text-white p-4 rounded-xl shadow flex flex-col items-start">
          <FaSchool size={26} className="mb-2" />
          <p className="text-sm font-medium">Total Schools</p>
          <p className="text-2xl font-bold">{stats.totalSchools}</p>
        </div>

        <div className="bg-black text-white p-4 rounded-xl shadow flex flex-col items-start">
          <FaRegQuestionCircle size={26} className="mb-2" />
          <p className="text-sm font-medium">Questions Asked</p>
          <p className="text-2xl font-bold">{stats.questionsAsked}</p>
        </div>

        <div className="bg-[#C837AB] text-white p-4 rounded-xl shadow flex flex-col items-start">
          <RiLiveLine size={26} className="mb-2" />
          <p className="text-sm font-medium">Active Matches</p>
          <p className="text-2xl font-bold">{stats.activeMatches}</p>
        </div>

        <div className="bg-[#641408] text-white p-4 rounded-xl shadow flex flex-col items-start">
          <FaUserGraduate size={26} className="mb-2" />
          <p className="text-sm font-medium">Active Students</p>
          <p className="text-2xl font-bold">{stats.activeStudents}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["All", "By School", "By Grade", "Count"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#001489] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      {(activeTab === "By School" ||
        activeTab === "By Grade" ||
        activeTab === "Count") && (
        <div className="flex flex-wrap gap-3 mb-4 w-full">
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded text-sm"
          >
            <option value="">Select School</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {activeTab === "By Grade" && (
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded text-sm"
            >
              <option value="">Select Grade</option>
              <option value="jss1">JSS1</option>
              <option value="jss2">JSS2</option>
              <option value="jss3">JSS3</option>
              <option value="ss1">SS1</option>
              <option value="ss2">SS2</option>
              <option value="ss3">SS3</option>
            </select>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative w-full mb-4">
        <CiSearch className="absolute left-3 top-3 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by Name, School, Grade, STEM"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded text-sm"
        />
      </div>
 
      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="p-4 text-gray-500">No records found</p>
        ) : (
          <table className="w-full table-auto text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left border-b">#</th>
                {activeTab === "Count" ? (
                  <th className="px-4 py-2 text-left border-b">Total Students</th>
                ) : (
                  <>
                    <th className="px-4 py-2 text-left border-b">Name</th>
                    <th className="px-4 py-2 text-left border-b">Grade</th>
                    <th className="px-4 py-2 text-left border-b">STEM Strength</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st, idx) => (
                <tr key={idx} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2">{idx + 1}</td>
                  {activeTab === "Count" ? (
                    <td className="px-4 py-2 font-semibold">{st.count}</td>
                  ) : (
                    <>
                      <td className="px-4 py-2">{st.name}</td>
                      <td className="px-4 py-2">{st.gradeLevel?.toUpperCase()}</td>
                      <td className="px-4 py-2">{st.stemStrength || "-"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
