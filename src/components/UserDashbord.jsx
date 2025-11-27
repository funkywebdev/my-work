

import React, { useState, useEffect } from "react";
import { FaUsers, FaCalendarAlt, FaTrophy, FaEdit, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const token = localStorage.getItem("adminToken");
  const schoolId = localStorage.getItem("schoolId");

  // Fetch students on mount
  useEffect(() => {
    if (!token || !schoolId) return;
    fetchStudents();
    fetchStudentCount();
    fetchGrades();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/students?schoolId=${schoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch students");
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
      console.log("Grades response:", response.data);
      setGrades(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Add/Edit student
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
        await axios.patch(`${baseUrl}/students/${student.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updated = [...students];
        updated[editingIndex] = payload;
        setStudents(updated);
        toast.success("Student updated successfully!");
      } else {
        const response = await axios.post(`${baseUrl}/students`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents([...students, response.data]);
        toast.success("Student added successfully!");
      }
      reset();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      fetchStudentCount();
    }
  };

  // Delete student
  const handleDelete = async (index) => {
    const student = students[index];
    if (!student.id) return;

    try {
      await axios.delete(`${baseUrl}/students/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((_, i) => i !== index));
      toast.success("Student deleted successfully!");
      fetchStudentCount();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete student");
    }
  };

  

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <ToastContainer />

      <div className="p-4 sm:p-6 rounded-lg">
        <h1 className="sm:text-3xl text-[20px] font-bold mb-2">Welcome</h1>
        <p className="text-gray-700">Manage your team and track your competition progress.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <div className="flex-1 bg-[#B10586] text-white p-4 rounded-xl flex flex-col items-center gap-2 shadow">
          <FaUsers size={30} />
          <p className="text-2xl font-bold">{studentCount}</p>
          <p>Total Students</p>
        </div>
        <div className="flex-1 bg-black text-white p-4 rounded-xl flex flex-col items-center gap-2 shadow">
          <FaCalendarAlt size={30} />
          <p className="text-2xl font-bold">6</p>
          <p>Upcoming Events</p>
        </div>
        <div className="flex-1 bg-[#1115CB] text-white p-4 rounded-xl flex flex-col items-center gap-2 shadow">
          <FaTrophy size={30} />
          <p className="text-2xl font-bold">6</p>
          <p>Competition</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-lg font-semibold">Recent Students</h2>
        <button
          className="bg-[#001489] text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={() => { reset(); setEditingIndex(null); setShowModal(true); }}
        >
          + Add Student
        </button>
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="min-w-full text-sm border-collapse">
          <thead className="font-semibold bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left">Student Name</th>
              <th className="py-2 px-3 text-left">Grade/Class</th>
              <th className="py-2 px-3 text-left">STEM Strength</th>
              <th className="py-2 px-3 text-center">Edit</th>
              <th className="py-2 px-3 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{student.name}</td>
                <td className="py-2 px-3">{student.gradeLevel}</td>
                <td className="py-2 px-3">{student.stemStrength}</td>
                <td className="py-2 px-3 text-center">
                  <button className="text-blue-700" onClick={() => { setEditingIndex(index); reset(student); setShowModal(true); }}><FaEdit /></button>
                </td>
                <td className="py-2 px-3 text-center">
                  <button className="text-red-600" onClick={() => handleDelete(index)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className=""> 

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{editingIndex !== null ? "Edit Student" : "Add Student"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" {...register("name", { required: "Student Name is required" })} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Grade/Class</label>
                <input type="text" className="w-full border rounded px-3 py-2" {...register("gradeLevel", { required: "Grade is required" })} />
                {errors.gradeLevel && <p className="text-red-500 text-sm">{errors.gradeLevel.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">STEM Strength</label>
                <input type="text" className="w-full border rounded px-3 py-2" {...register("stemStrength", { required: "STEM Strength is required" })} />
                {errors.stemStrength && <p className="text-red-500 text-sm">{errors.stemStrength.message}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowModal(false); reset(); setEditingIndex(null); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-[#001489] text-white rounded">{loading ? "Saving..." : editingIndex !== null ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
