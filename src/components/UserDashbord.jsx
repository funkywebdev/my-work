
import React, { useState, useEffect } from "react";
import { FaUsers, FaCalendarCheck } from "react-icons/fa";
import { PiMedalBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { MdOutlineModeEdit } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const baseUrl = "https://bql-production.up.railway.app";

const UserDashboard = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [fetchingStudents, setFetchingStudents] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const token = localStorage.getItem("schoolToken");
  const schoolId = localStorage.getItem("schoolId");

  const STEM_OPTIONS = ["mathematics", "physics", "chemistry", "computer_science", "biology", "engineering"];

  // Map API grade codes to user-friendly labels
  const GRADE_OPTIONS = [
    { value: "jss1", label: "JSS 1" },
    { value: "jss2", label: "JSS 2" },
    { value: "jss3", label: "JSS 3" },
    { value: "ss1", label: "SS 1" },
    { value: "ss2", label: "SS 2" },
    { value: "ss3", label: "SS 3" },
  ];

  // Fetch grades, student count, and students on mount
  useEffect(() => {
    if (!token || !schoolId) return;
    fetchGrades();
    fetchStudentCount();
    fetchStudents();
  }, []);

  const fetchStudents = async (grade = selectedGrade) => {
    setFetchingStudents(true);
    try {
      const url = grade === "All"
        ? `${baseUrl}/students?schoolId=${schoolId}`
        : `${baseUrl}/students?schoolId=${schoolId}&gradeLevel=${grade}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setFetchingStudents(false);
    }
  };

  const fetchStudentCount = async () => {
    try {
      const response = await axios.get(`${baseUrl}/students/school/${schoolId}/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentCount(response.data.count || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get(`${baseUrl}/students/school/${schoolId}/grades`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const gradesArray = Array.isArray(response.data) ? response.data : [];
      setGrades(gradesArray);
    } catch (error) {
      console.error(error);
      setGrades([]);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    if (!token || !schoolId) {
      toast.error("Token or School ID missing");
      setLoading(false);
      return;
    }

    const payload = { ...data, schoolId };

    try {
      if (editingIndex !== null) {
        const student = students[editingIndex];
        const response = await axios.patch(`${baseUrl}/students/${student.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updated = [...students];
        updated[editingIndex] = response.data; // Use server response
        setStudents(updated);
        toast.success("Student updated successfully!");
      } else {
        const response = await axios.post(`${baseUrl}/students`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents([...students, response.data]); // Use server response
        toast.success("Student added successfully!");
      }
      reset();
      setShowModal(false);
      fetchStudentCount();
      fetchGrades(); // refresh grades in case new grade added
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const student = students[index];
    if (!student.id) return;
    if (!window.confirm(`Are you sure you want to delete ${student.name}?`)) return;

    try {
      await axios.delete(`${baseUrl}/students/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((_, i) => i !== index));
      toast.success("Student deleted successfully!");
      fetchStudentCount();
      fetchGrades();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete student");
    }
  };

  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setSelectedGrade(grade);
    fetchStudents(grade);
  };

  const handleLogout = () => {
    localStorage.removeItem("schoolToken");
    localStorage.removeItem("schoolId");
    window.location.href = "/login";
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <ToastContainer />

      {/* Header */}
      <div className="py-2">
        <h1 className="sm:text-3xl text-[20px] font-bold mb-2">Welcome</h1>
        <p className="text-gray-700 text-sm sm:text-base">Manage your team and track your competition progress.</p>
      </div>

      {/* Dashboard Cards */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
        <div className="flex-1 bg-[#B10586] text-white p-3 sm:p-4 rounded-xl flex flex-col items-start gap-1 sm:gap-2 shadow">
          <FaUsers size={25} />
          <p className="text-xl sm:text-2xl font-bold">{studentCount}</p>
          <p className="text-xs sm:text-sm text-center">Total Students</p>
        </div>
        <div className="flex-1 bg-black text-white p-3 sm:p-4 rounded-xl flex flex-col items-start gap-1 sm:gap-2 shadow">
          <FaCalendarCheck size={25} />
          <p className="text-xl sm:text-2xl font-bold">6</p>
          <p className="text-xs sm:text-sm text-center">Upcoming Events</p>
        </div>
        <div className="flex-1 bg-[#1115CB] text-white p-3 sm:p-4 rounded-xl flex flex-col items-start gap-1 sm:gap-4 shadow">
          <PiMedalBold size={25} />
          <p className="text-xl sm:text-2xl font-bold">6</p>
          <p className="text-xs sm:text-sm text-center">Competition</p>
        </div>
      </div>

      {/* Grade Filter and Add Student */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 border-b border-[#8F969A] py-2 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold">Recent Students</h2>
        <div className="flex gap-2 sm:w-auto flex-row">
          <select
            value={selectedGrade}
            onChange={handleGradeChange}
            disabled={fetchingStudents}
            className="border border-[#001489] px-2 py-1 rounded focus:outline-none focus:bg-[#001489] focus:text-white hover:bg-[#001489] hover:text-white text-sm sm:text-base"
          >
            <option value="All">All Grades</option>
            {GRADE_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>

          <button
            className="bg-[#001489] text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
            onClick={() => { reset(); setEditingIndex(null); setShowModal(true); }}
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto mt-2 relative">
        {fetchingStudents ? (
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin h-8 w-8 text-[#001489]"
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
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : students.length === 0 ? (
          <p className="text-center py-4 text-sm sm:text-base text-gray-500">
            {selectedGrade === "All"
              ? "No students found."
              : `No students found in ${GRADE_OPTIONS.find(g => g.value === selectedGrade)?.label}.`}
          </p>
        ) : (
          <div className="min-w-[600px] sm:min-w-full">
            <table className="min-w-full text-sm border-collapse">
              <thead className="font-semibold sm:text-[16px] bg-gray-100">
                <tr>
                  <th className="py-3 px-2 sm:px-3 text-left">Student Name</th>
                  <th className="py-3 px-2 sm:px-3 text-left">Grade/Class</th>
                  <th className="py-3 px-2 sm:px-3 text-left">STEM Strength</th>
                  <th className="py-3 px-2 sm:px-3 text-center">Edit</th>
                  <th className="py-3 px-2 sm:px-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student.id || index}
                    className={`border border-[#D9D9D9] hover:bg-gray-50 ${
                      fetchingStudents ? "opacity-50" : ""
                    }`}
                  >
                    <td className="py-2 px-2 sm:px-3 truncate max-w-[150px]">{student.name}</td>
                    <td className="py-2 px-2 sm:px-3 truncate max-w-[100px]">{student.gradeLevel}</td>
                    <td className="py-2 px-2 sm:px-3 truncate max-w-[120px]">{student.stemStrength}</td>
                    <td className="py-2 px-2 sm:px-3 text-center">
                      <button
                        className="text-[#001489] text-sm sm:text-base"
                        onClick={() => { setEditingIndex(index); reset(student); setShowModal(true); }}
                        disabled={fetchingStudents}
                      >
                        <MdOutlineModeEdit />
                      </button>
                    </td>
                    <td className="py-2 px-2 sm:px-3 text-center">
                      <button
                        className="text-[#FF0000] text-sm sm:text-base"
                        onClick={() => handleDelete(index)}
                        disabled={fetchingStudents}
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              {editingIndex !== null ? "Edit Student" : "Add Student"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm sm:text-base"
                  {...register("name", { required: "Student Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-xs sm:text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Grade/Class</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm sm:text-base"
                  {...register("gradeLevel", { required: "Grade is required" })}
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
                {errors.gradeLevel && <p className="text-red-500 text-xs sm:text-sm">{errors.gradeLevel.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">STEM Strength</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm sm:text-base"
                  {...register("stemStrength", { required: "STEM Strength is required" })}
                >
                  {STEM_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.stemStrength && <p className="text-red-500 text-xs sm:text-sm">{errors.stemStrength.message}</p>}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); reset(); setEditingIndex(null); }}
                  className="px-4 py-2 bg-gray-300 rounded text-sm sm:text-base w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#001489] text-white rounded text-sm sm:text-base w-full sm:w-auto"
                >
                  {loading ? "Saving..." : editingIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
