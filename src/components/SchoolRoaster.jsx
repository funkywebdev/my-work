import React, { useState } from "react";
import { Plus } from "lucide-react";
import removebg from "../assets/images/removebg.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = "https://bql-production.up.railway.app";

const SchoolRoaster = () => {
const [students, setStudents] = useState([
{ name: "Jay Doe", gradeLevel: "ss1", stemStrength: "chemistry" },
{ name: "Ade Ori", gradeLevel: "ss2", stemStrength: "physics" },
]);
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false); // modal state
const navigate = useNavigate();

const handleChange = (index, field, value) => {
const updated = [...students];
updated[index][field] = value;
setStudents(updated);
};

const addStudent = () => {
if (students.length >= 4) {
toast.error("You cannot add more than 4 students"); // toast for immediate feedback
setShowModal(true); // modal pops up
return;
}
setStudents([...students, { name: "", gradeLevel: "", stemStrength: "" }]);
};

const onSubmit = async (e) => {
e.preventDefault();

// Check limit before submitting
if (students.length > 4) {
toast.error("Cannot submit more than 4 students");
setShowModal(true);
return;
}

const token = localStorage.getItem("schoolToken");
const schoolId = localStorage.getItem("schoolId");

if (!token || !schoolId) {
toast.error("Token or School ID missing. Please login again.");
return;
}

setLoading(true);

try {
const payload = { schoolId, students };

const response = await axios.post(`${baseUrl}/students/bulk`, payload, {
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
});

console.log("Full response:", response);
console.log("Backend data:", response.data);

toast.success("Students added successfully!");
setTimeout(() => {
navigate("/dashboard");
}, 1000);
} catch (error) {
console.error(error.response?.data || error.message);
if (error.response?.status === 401) {
toast.error("Unauthorized. Please login again.");
} else if (error.response?.status === 500) {
toast.error("Server error. Check your student data.");
} else {
toast.error("Failed to add students.");
}
} finally {
setLoading(false);
}
};

return (
<>
    <ToastContainer />
    <nav className="bg-[#001489] p-4 flex items-center gap-4 shadow-md">
        <img src={removebg} alt="Logo" className="w-20 sm:w-34 md:ml-10 h-auto object-contain" />
        <p className="text-white font-bold sm:text-2xl  text-center sm:mx-auto">
            School Roster Management
        </p>
    </nav>

    <form onSubmit={onSubmit} className="space-y-8 px-4 sm:px-8 md:px-16 mt-10 max-w-7xl mx-auto">
        {students.map((student, index) => (
        <div key={index} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm space-y-4">
            <h2 className="font-semibold text-[#001489]">Student {index + 1}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Student Name</label>
                    <input type="text" value={student.name} onChange={(e)=> handleChange(index, "name",
                    e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Grade/Level</label>
                    <input type="text" value={student.gradeLevel} onChange={(e)=> handleChange(index, "gradeLevel",
                    e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">STEM Strength</label>
                    <input type="text" value={student.stemStrength} onChange={(e)=> handleChange(index,
                    "stemStrength", e.target.value)}
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </div>
        ))}

        <button type="button" onClick={addStudent}
            className="flex items-center justify-center w-full bg-[#8193FE4A] hover:bg-[#8193FE70] transition text-[#001489] font-medium p-2 rounded-md">
            <Plus size={16} className="mr-2" />
            Add Student
        </button>

        <div className="flex justify-end">
            <button type="submit" disabled={loading}
                className="px-6 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489d8] transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Submitting..." : "Submit"}
            </button>
        </div>
    </form>

    {/* Modal */}
    {showModal && (
    <div className="fixed inset-0 flex items-center justify-center shadow-md bg-opacity-50 z-50 ">
        <div
            className="bg-white p-6 rounded-lg shadow-md max-w-sm w-[250px] sm:w-full text-center  transform transition duration-200 hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-[#001489]">Limit Reached</h2>
            <p className="mb-4">You cannot add more than 4 students per school.</p>
            <button onClick={()=> setShowModal(false)}
                className="px-4 py-2 bg-[#001489] text-white rounded-md hover:bg-[#001489d8]"
                >
                Close
            </button>
        </div>
    </div>
    )}
</>
);
};

export default SchoolRoaster;
