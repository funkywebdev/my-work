import React, { useRef, useState, useEffect } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---------------- CONFIG ----------------
const baseUrl = "https://bql-production.up.railway.app";

// ---------------- VALIDATION SCHEMA ----------------
const questionSchema = yup.object().shape({
  questionText: yup.string().required("Question is required"),
  category: yup.string().required("Category is required"),
  difficulty: yup.string().required("Difficulty is required"),
  timeLimit: yup
    .number()
    .typeError("Time limit must be a number")
    .required("Time limit is required")
    .min(10, "Minimum 10 seconds")
    .max(3600, "Maximum 3600 seconds"),
  optionA: yup.string().required("Option A is required"),
  optionB: yup.string().required("Option B is required"),
  optionC: yup.string().required("Option C is required"),
  optionD: yup.string().required("Option D is required"),
  correctAnswer: yup.string().oneOf(["A", "B", "C", "D"]).required("Select the correct answer"),
  explanation: yup.string().required("Explanation is required"),
});

// ---------------- AXIOS ERROR HANDLER ----------------
const handleAxiosError = (err) => {
  const msg = err.response?.data?.message || err.message || "Something went wrong";
  toast.error(msg);
  console.error(err);
};

// ---------------- COMPONENT ----------------
const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'add', 'edit', 'preview'
  const [modalContent, setModalContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);

  const fileInputRef = useRef(null);
  const authToken = localStorage.getItem("adminToken");

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(questionSchema),
    defaultValues: {
      questionText: "",
      category: "General",
      difficulty: "Medium",
      timeLimit: 60,
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      explanation: "",
    },
  });

  // ---------------- FETCH QUESTIONS ----------------
  const fetchQuestions = async () => {
    try {
      let url = `${baseUrl}/questions`;
      const params = {};
      if (categoryFilter !== "All") params.category = categoryFilter.toLowerCase();
      if (difficultyFilter !== "All") params.difficulty = difficultyFilter.toLowerCase();

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
        params,
      });
      setQuestions(res.data || []);
      setCurrentIndex(0);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // ---------------- FETCH STATS ----------------
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${baseUrl}/questions/stats`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setStats(res.data);
    } catch (err) {
      handleAxiosError(err);
    }
  };

  useEffect(() => {
    if (!authToken) {
      toast.error("No admin token found! Please login.");
      return;
    }
    fetchQuestions();
    fetchStats();
  }, [authToken, categoryFilter, difficultyFilter]);

  // ---------------- MODAL HANDLERS ----------------
  const openAddModal = () => {
    reset();
    setModalType("add");
    setIsModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditQuestion(q);
    reset({
      questionText: q.questionText,
      category: q.category,
      difficulty: q.difficulty,
      timeLimit: q.timeLimit,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const openPreviewModal = (q) => {
    setModalType("preview");
    setModalContent(q);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditQuestion(null);
    reset();
  };

  // ---------------- FILE UPLOAD ----------------
  const handleBulkUploadClick = () => fileInputRef.current.click();
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${baseUrl}/questions/bulk-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
      });
      toast.success(`File "${file.name}" uploaded successfully!`);
      fetchQuestions();
    } catch (err) {
      handleAxiosError(err);
    }
  };

  const downloadCSVTemplate = async () => {
    try {
      const res = await axios.get(`${baseUrl}/questions/sample-csv`, {
        headers: { Authorization: `Bearer ${authToken}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "questions_template.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // ---------------- ADD QUESTION ----------------
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        category: data.category.toLowerCase(),
        difficulty: data.difficulty.toLowerCase(),
        timeLimit: Number(data.timeLimit),
      };

      if (modalType === "add") {
        const res = await axios.post(`${baseUrl}/questions`, payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setQuestions([...questions, res.data]);
        setCurrentIndex(questions.length);
        toast.success("Question added successfully!");
      } else if (modalType === "edit" && editQuestion) {
        const res = await axios.put(`${baseUrl}/questions/${editQuestion.id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setQuestions(questions.map(item => item.id === editQuestion.id ? res.data : item));
        toast.success("Question updated successfully!");
      }

      closeModal();
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`${baseUrl}/questions/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setQuestions(questions.filter(item => item.id !== id));
      setCurrentIndex(prev => prev >= questions.length - 1 ? questions.length - 2 : prev);
      toast.success("Question deleted successfully!");
      fetchStats();
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // ---------------- NEXT ----------------
  const handleNext = () => {
    if (questions.length) setCurrentIndex(prev => (prev + 1) % questions.length);
  };

  // ---------------- FILTERED QUESTIONS ----------------
  const filteredQuestions = questions.filter(q =>
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const q = filteredQuestions[currentIndex] || null;

  return (
    <div className="p-4 md:p-6 bg-white rounded-md shadow-md w-full">
      <ToastContainer />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">Question Bank</p>
          <p className="text-gray-500 text-sm">{filteredQuestions.length} total questions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={handleBulkUploadClick} className="flex items-center gap-2 border border-[#1115CB] text-[#1115CB] px-4 py-2 rounded-md hover:bg-[#f2f3ff] transition">
            <FiDownload size={18} /> Bulk Upload
          </button>
          <button onClick={downloadCSVTemplate} className="border px-4 py-2 rounded-md hover:bg-gray-100">Download CSV Template</button>
          <button onClick={openAddModal} className="bg-[#1115CB] text-white px-4 py-2 rounded-md hover:bg-[#0d0cb3] transition">+ New Question</button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search questions or tags"
            className="border pl-10 pr-3 py-2 rounded-md w-full"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); }}
          />
        </div>
        <select className="border px-3 py-2 rounded-md w-full" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {["All","General","Mathematics","Chemistry","Physics","Biology","Geography"].map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <select className="border px-3 py-2 rounded-md w-full" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
          {["All","Easy","Medium","Hard"].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* STATS */}
      {stats && (
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="bg-blue-100 px-4 py-2 rounded-md">Total: {stats.total}</div>
          <div className="bg-green-100 px-4 py-2 rounded-md">Easy: {stats.easy}</div>
          <div className="bg-yellow-100 px-4 py-2 rounded-md">Medium: {stats.medium}</div>
          <div className="bg-red-100 px-4 py-2 rounded-md">Hard: {stats.hard}</div>
        </div>
      )}

      {/* QUESTION BOX */}
      {!q ? (
        <div className="mt-8 text-center text-gray-500">No questions found.</div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-[#001489] border border-[#001489] px-3 py-1 rounded-lg">{q.category}</p>
            <p className="bg-[#FF004F] text-white px-3 py-1 rounded-lg">{q.difficulty}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <p className="font-semibold sm:max-w-[85%]">{q.questionText}</p>
            <p onClick={() => openEditModal(q)}
              className="text-[#001489] border border-[#001489] px-3 py-1 rounded-md cursor-pointer hover:bg-[#001489] hover:text-white transition w-fit">
              Edit
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["A","B","C","D"].map(label => (
              <div key={label} className="flex items-center gap-3 border border-[#C5CEFFFC] rounded-full px-4 py-2 hover:bg-[#001489] hover:text-white transition">
                <span className="flex items-center justify-center w-8 h-8 bg-[#C5CEFFFC] text-[#001489] rounded-full font-bold">{label}</span>
                <span>{q[`option${label}`]}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleNext} className="bg-[#001489] text-white py-2 px-4 rounded-md hover:bg-[#0022b3] transition">Next Question</button>
            <button onClick={() => handleDelete(q.id)} className="bg-[#FF004F] text-white py-2 px-6 rounded-md hover:bg-[#d60044] transition">Delete</button>
            <button onClick={() => openPreviewModal(q)} className="bg-[#2c3e50] text-white py-2 px-6 rounded-md hover:bg-[#1f2a38] transition">Preview</button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl">×</button>

            <h1 className="text-center text-2xl mb-4 text-[#001489]">{modalType === "add" ? "New Question" : modalType === "edit" ? "Edit Question" : "Preview Question"}</h1>

            {(modalType === "add" || modalType === "edit") && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Category, Difficulty, Time Limit */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label>Category</label>
                    <select {...register("category")} className="border px-3 py-2 rounded-md w-full">
                      {["General","Mathematics","Chemistry","Physics","Biology","Geography"].map(cat => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label>Difficulty</label>
                    <select {...register("difficulty")} className="border px-3 py-2 rounded-md w-full">
                      {["Easy","Medium","Hard"].map(d => <option key={d}>{d}</option>)}
                    </select>
                    {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty.message}</p>}
                  </div>
                  <div>
                    <label>Time Limit (sec)</label>
                    <input type="number" {...register("timeLimit")} className="border px-3 py-2 rounded-md w-full" />
                    {errors.timeLimit && <p className="text-red-500 text-sm">{errors.timeLimit.message}</p>}
                  </div>
                </div>

                {/* Question */}
                <div>
                  <label>Question</label>
                  <textarea {...register("questionText")} className="border px-3 py-2 rounded-md w-full" rows={4}></textarea>
                  {errors.questionText && <p className="text-red-500 text-sm">{errors.questionText.message}</p>}
                </div>

                {/* Answers */}
                <div className="space-y-2">
                  <label>Answers</label>
                  {["A","B","C","D"].map((label) => (
                    <div key={label}>
                      <input placeholder={`Answer ${label}`} {...register(`option${label}`)} className="border px-3 py-2 rounded-md w-full" />
                      {errors[`option${label}`] && <p className="text-red-500 text-sm">{errors[`option${label}`]?.message}</p>}
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div>
                  <label>Correct Answer</label>
                  <select {...register("correctAnswer")} className="border px-3 py-2 rounded-md w-full">
                    {["A","B","C","D"].map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                  {errors.correctAnswer && <p className="text-red-500 text-sm">{errors.correctAnswer.message}</p>}
                </div>

                {/* Explanation */}
                <div>
                  <label>Explanation</label>
                  <textarea {...register("explanation")} className="border px-3 py-2 rounded-md w-full" rows={3}></textarea>
                  {errors.explanation && <p className="text-red-500 text-sm">{errors.explanation.message}</p>}
                </div>

                <div className="flex gap-3 mt-4">
                  <button type="submit" className="bg-[#1115CB] text-white px-6 py-2 rounded-md" disabled={loading}>
                    {loading ? (modalType === "add" ? "Adding..." : "Saving...") : (modalType === "add" ? "Add Question" : "Save Changes")}
                  </button>
                  <button type="button" onClick={closeModal} className="border px-6 py-2 rounded-md" disabled={loading}>Cancel</button>
                </div>
              </form>
            )}

            {modalType === "preview" && modalContent && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold mb-2">Preview</h2>
                <p className="font-semibold">{modalContent.questionText}</p>
                {["A","B","C","D"].map(label => (
                  <p key={label}><strong>{label}. </strong>{modalContent[`option${label}`]}</p>
                ))}
                <p className="mt-2 text-gray-600"><strong>Explanation:</strong> {modalContent.explanation}</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
