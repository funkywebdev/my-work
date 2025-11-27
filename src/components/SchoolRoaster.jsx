// import React, { useState } from "react";
// import { Plus } from "lucide-react";
// import removebg from "../assets/images/removebg.png";

// const SchoolRoaster = () => {
//   const [students, setStudents] = useState([
//     { name: "", gradeLevel: "", stemStrength: "" },
//     { name: "", gradeLevel: "", stemStrength: "" },
//     { name: "", gradeLevel: "", stemStrength: "" },
//     { name: "", gradeLevel: "", stemStrength: "" },
//   ]);

//   const handleChange = (index, field, value) => {
//     const updated = [...students];
//     updated[index][field] = value;
//     setStudents(updated);
//   };

//   const addStudent = () =>
//     setStudents([
//       ...students,
//       { name: "", gradeLevel: "", stemStrength: "" },
//     ]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data:", students);
//     alert("Form submitted! Check console for data.");
//   };

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav className="bg-[#001489] p-4 flex items-center gap-4 shadow-md">
//         <img
//           src={removebg}
//           alt="Bolo Quiz League Logo"
//           className="w-16 sm:w-24 md:w-28 h-auto object-contain"
//         />
//         <p className="text-white font-bold text-lg sm:text-2xl md:text-3xl">
//           School Roster Management
//         </p>
//       </nav>

//       {/* FORM */}
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-8 px-4 sm:px-8 md:px-16 mt-10 max-w-6xl mx-auto"
//       >
//         {/* HEADER */}
//         <div>
//           <h1 className="text-2xl font-semibold text-[#001489]">
//             Team Details
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Enter your team members and coach details
//           </p>
//         </div>

//         {/* STUDENTS */}
//         {students.map((student, index) => (
//           <div
//             key={index}
//             className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm space-y-4"
//           >
//             <h2 className="font-semibold text-[#001489]">
//               Student {index + 1}
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {/* Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Student Name
//                 </label>
//                 <input
//                   type="text"
//                   value={student.name}
//                   onChange={(e) =>
//                     handleChange(index, "name", e.target.value)
//                   }
//                   placeholder="Enter full name"
//                   className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
//                 />
//               </div>

//               {/* Grade */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Grade/Level
//                 </label>
//                 <input
//                   type="text"
//                   value={student.gradeLevel}
//                   onChange={(e) =>
//                     handleChange(index, "gradeLevel", e.target.value)
//                   }
//                   placeholder="e.g. SS2, JSS3"
//                   className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
//                 />
//               </div>

//               {/* STEM Strength */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   STEM Strength
//                 </label>
//                 <input
//                   type="text"
//                   value={student.stemStrength}
//                   onChange={(e) =>
//                     handleChange(index, "stemStrength", e.target.value)
//                   }
//                   placeholder="e.g. Chemistry, Maths"
//                   className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* ADD BUTTON */}
//         <button
//           type="button"
//           onClick={addStudent}
//           className="flex items-center justify-center w-full bg-[#8193FE4A] hover:bg-[#8193FE70] transition text-[#001489] font-medium p-2 rounded-md"
//         >
//           <Plus size={16} className="mr-2" />
//           Add Student
//         </button>

//         {/* CONTINUE BUTTON */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="px-6 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489d8] transition"
//           >
//             Continue
//           </button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default SchoolRoaster;


import React, { useState } from "react";
import { Plus } from "lucide-react";
import removebg from "../assets/images/removebg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const baseUrl = "https://bql-production.up.railway.app";

const SchoolRoaster = () => {
  const [students, setStudents] = useState([
    { name: "", gradeLevel: "", stemStrength: "" },
    { name: "", gradeLevel: "", stemStrength: "" },
    { name: "", gradeLevel: "", stemStrength: "" },
    { name: "", gradeLevel: "", stemStrength: "" },
  ]);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const schoolId = localStorage.getItem("schoolId");

  const handleChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const addStudent = () => {
    setStudents([
      ...students,
      { name: "", gradeLevel: "", stemStrength: "" },
    ]);
  };

  // VALIDATION
  const validate = () => {
    const newErrors = [];

    students.forEach((student, index) => {
      let studentError = {};

      if (!student.name.trim()) studentError.name = "Student name is required";
      if (!student.gradeLevel.trim())
        studentError.gradeLevel = "Grade level is required";
      if (!student.stemStrength.trim())
        studentError.stemStrength = "STEM strength is required";

      newErrors[index] = studentError;
    });

    setErrors(newErrors);

    const hasError = newErrors.some((err) => Object.keys(err).length > 0);

    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!token || !schoolId) {
      toast.error("Missing authentication details!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/students/bulk`,
        { schoolId, students },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Students added successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-[#001489] p-4 flex items-center gap-4 shadow-md">
        <img
          src={removebg}
          alt="Bolo Quiz League Logo"
          className="w-16 sm:w-24 md:w-28 h-auto object-contain"
        />
        <p className="text-white font-bold text-lg sm:text-2xl md:text-3xl">
          School Roster Management
        </p>
      </nav>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 px-4 sm:px-8 md:px-16 mt-10 max-w-6xl mx-auto"
      >
        <div>
          <h1 className="text-2xl font-semibold text-[#001489]">
            Team Details
          </h1>
          <p className="text-gray-600 mt-1">
            Enter your team members and coach details
          </p>
        </div>

        {/* STUDENT INPUTS */}
        {students.map((student, index) => (
          <div
            key={index}
            className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm space-y-4"
          >
            <h2 className="font-semibold text-[#001489]">
              Student {index + 1}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student Name
                </label>
                <input
                  type="text"
                  value={student.name}
                  onChange={(e) =>
                    handleChange(index, "name", e.target.value)
                  }
                  placeholder="Enter full name"
                  className={`w-full px-3 py-2 mt-1 border rounded-md ${
                    errors[index]?.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors[index]?.name && (
                  <p className="text-red-500 text-sm">
                    {errors[index].name}
                  </p>
                )}
              </div>

              {/* GRADE */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grade/Level
                </label>
                <input
                  type="text"
                  value={student.gradeLevel}
                  onChange={(e) =>
                    handleChange(index, "gradeLevel", e.target.value)
                  }
                  placeholder="e.g. SS2, JSS3"
                  className={`w-full px-3 py-2 mt-1 border rounded-md ${
                    errors[index]?.gradeLevel
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors[index]?.gradeLevel && (
                  <p className="text-red-500 text-sm">
                    {errors[index].gradeLevel}
                  </p>
                )}
              </div>

              {/* STEM STRENGTH */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  STEM Strength
                </label>
                <input
                  type="text"
                  value={student.stemStrength}
                  onChange={(e) =>
                    handleChange(index, "stemStrength", e.target.value)
                  }
                  placeholder="e.g. Chemistry, Maths"
                  className={`w-full px-3 py-2 mt-1 border rounded-md ${
                    errors[index]?.stemStrength
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors[index]?.stemStrength && (
                  <p className="text-red-500 text-sm">
                    {errors[index].stemStrength}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ADD BUTTON */}
        <button
          type="button"
          onClick={addStudent}
          className="flex items-center justify-center w-full bg-[#8193FE4A] hover:bg-[#8193FE70] transition text-[#001489] font-medium p-2 rounded-md"
        >
          <Plus size={16} className="mr-2" />
          Add Student
        </button>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489d8] transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </>
  );
};

export default SchoolRoaster;
