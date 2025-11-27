import React, { useRef, useState } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";

const Question = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      subject: "Mathematics",
      difficulty: "Hard",
      question: "What is the derivative of f(x) = x³ + 2x² - 5x + 3?",
      answers: [
        { label: "A", text: "3x² + 4x - 5" },
        { label: "B", text: "3x² + 2x - 5" },
        { label: "C", text: "3x² + 4x - 5" },
        { label: "D", text: "3x² + x - 5" },
      ],
      timeLimit: 60,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'add', 'bulk', 'preview'
  const [modalContent, setModalContent] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    category: "General",
    difficulty: "Medium",
    timeLimit: 60,
    answers: ["", "", "", ""],
    correctAnswer: "A",
  });

  const fileInputRef = useRef(null);

  // ---------------- MODAL HANDLERS ----------------
  const openAddModal = () => {
    setModalType("add");
    setNewQuestion({
      question: "",
      category: "General",
      difficulty: "Medium",
      timeLimit: 60,
      answers: ["", "", "", ""],
      correctAnswer: "A",
    });
    setIsModalOpen(true);
  };

  const openBulkModal = (fileName) => {
    setModalType("bulk");
    setModalContent(`File "${fileName}" uploaded successfully!`);
    setIsModalOpen(true);
  };

  const openPreviewModal = (q) => {
    setModalType("preview");
    setModalContent(q);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // ---------------- FILE UPLOAD ----------------
  const handleBulkUploadClick = () => fileInputRef.current.click();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) openBulkModal(file.name);
  };

  // ---------------- ADD QUESTION ----------------
  const handleAddQuestionSubmit = () => {
    const { question, answers, category, difficulty, timeLimit, correctAnswer } = newQuestion;
    if (!question || answers.some((a) => !a)) {
      alert("All fields are required!");
      return;
    }

    const newQ = {
      id: questions.length + 1,
      subject: category,
      difficulty,
      timeLimit,
      question,
      answers: answers.map((text, i) => ({ label: ["A", "B", "C", "D"][i], text })),
      correctAnswer,
    };

    setQuestions([...questions, newQ]);
    setCurrentIndex(questions.length);
    closeModal();
  };

  // ---------------- EDIT ----------------
  const handleEdit = (id) => {
    const q = questions.find((item) => item.id === id);
    const newText = prompt("Edit question:", q.question);
    if (!newText) return;

    setQuestions(
      questions.map((item) =>
        item.id === id ? { ...item, question: newText } : item
      )
    );
  };

  // ---------------- DELETE ----------------
  const handleDelete = (id) => {
    if (!window.confirm("Delete this question?")) return;

    const newQuestions = questions.filter((item) => item.id !== id);
    setQuestions(newQuestions);

    if (currentIndex >= newQuestions.length) {
      setCurrentIndex(newQuestions.length - 1);
    }
  };

  // ---------------- NEXT ----------------
  const handleNext = () => {
    if (questions.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const q = questions[currentIndex] || null;

  return (
    <div className="p-4 md:p-6 bg-white rounded-md shadow-md w-full">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">Question Bank</p>
          <p className="text-gray-500 text-sm">{questions.length} total questions</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={handleBulkUploadClick}
            className="flex items-center gap-2 border border-[#1115CB] text-[#1115CB] px-4 py-2 rounded-md hover:bg-[#f2f3ff] transition w-full md:w-auto"
          >
            <FiDownload size={18} /> Bulk Upload
          </button>

          <button
            onClick={openAddModal}
            className="bg-[#1115CB] text-white px-4 py-2 rounded-md hover:bg-[#0d0cb3] transition w-full md:w-auto"
          >
            + New Question
          </button>
        </div>
      </div>

      {/* ---------- SEARCH + FILTER ---------- */}
      <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search questions or tags"
            className="border pl-10 pr-3 py-2 rounded-md w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <select className="border px-3 py-2 rounded-md w-full sm:w-auto">
            <option>All Categories</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Design</option>
          </select>

          <select className="border px-3 py-2 rounded-md w-full sm:w-auto">
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      {/* ---------- QUESTION BOX ---------- */}
      {!q ? (
        <div className="mt-8 text-center text-gray-500">
          No questions available. Please add a question.
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-[#001489] border border-[#001489] px-3 py-1 rounded-lg">{q.subject}</p>
            <p className="bg-[#FF004F] text-white px-3 py-1 rounded-lg">{q.difficulty}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <p className="font-semibold sm:max-w-[85%]">{q.question}</p>
            <p
              onClick={() => handleEdit(q.id)}
              className="text-[#001489] border border-[#001489] px-3 py-1 rounded-md cursor-pointer hover:bg-[#001489] hover:text-white transition w-fit"
            >
              Edit
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.answers.map((ans) => (
              <div
                key={ans.label}
                className="flex items-center gap-3 border border-[#C5CEFFFC] rounded-full px-4 py-2 hover:bg-[#001489] hover:text-white transition"
              >
                <span className="flex items-center justify-center w-8 h-8 bg-[#C5CEFFFC] text-[#001489] rounded-full font-bold">{ans.label}</span>
                <span>{ans.text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleNext}
              className="bg-[#001489] text-white px-6 py-2 rounded-md hover:bg-[#0022b3] transition"
            >
              Next Question
            </button>

            <button
              onClick={() => handleDelete(q.id)}
              className="bg-[#FF004F] text-white px-6 py-2 rounded-md hover:bg-[#d60044] transition"
            >
              Delete
            </button>

            <button
              onClick={() => openPreviewModal(q)}
              className="bg-[#2c3e50] text-white px-6 py-2 rounded-md hover:bg-[#1f2a38] transition col-span-1 sm:col-span-2"
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {/* ---------------- MODAL ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
            >
              ×
            </button>

            {/* Add Question Modal */}
            {modalType === "add" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#001489] mb-4">Create New Question</h2>

                {/* Category, Difficulty, Time Limit */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["Category", "Difficulty", "Time Limit (sec)"].map((label, idx) => {
                    let value, onChange, options = [];
                    if (label === "Category") {
                      value = newQuestion.category;
                      onChange = (e) => setNewQuestion({ ...newQuestion, category: e.target.value });
                      options = ["General", "Mathematics", "Chemistry", "Physics", "Biology", "Geography"];
                    } else if (label === "Difficulty") {
                      value = newQuestion.difficulty;
                      onChange = (e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value });
                      options = ["Easy", "Medium", "Hard"];
                    } else {
                      value = newQuestion.timeLimit;
                      onChange = (e) => setNewQuestion({ ...newQuestion, timeLimit: Number(e.target.value) });
                      options = [30, 60, 90, 120];
                    }
                    return (
                      <div className="flex flex-col" key={idx}>
                        <label className="font-medium text-gray-700 mb-1">{label}</label>
                        <select
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#001489]"
                          value={value}
                          onChange={onChange}
                        >
                          {options.map((opt, i) => <option key={i}>{opt}</option>)}
                        </select>
                      </div>
                    );
                  })}
                </div>

                {/* Question Textarea */}
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">Question</label>
                  <textarea
                    rows={4}
                    placeholder="Enter your question here..."
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#001489] resize-none"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  />
                </div>

                {/* Answer Options */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 mb-1">Answer Options</label>
                  {newQuestion.answers.map((ans, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Answer ${["A", "B", "C", "D"][idx]}`}
                      value={ans}
                      onChange={(e) => {
                        const updated = [...newQuestion.answers];
                        updated[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, answers: updated });
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#001489]"
                    />
                  ))}
                </div>

                {/* Correct Answer */}
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">Select Correct Option</label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#001489]"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                  >
                    {["A", "B", "C", "D"].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={handleAddQuestionSubmit}
                    className="w-full sm:w-auto bg-[#1115CB] text-white px-6 py-2 rounded-md hover:bg-[#0d0cb3] transition"
                  >
                    Add Question
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full sm:w-auto border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

           
            {/* Bulk Upload Modal */}
      {modalType === "bulk" && (
        <div className="space-y-6">
          {/* Modal Title */}
          <h2 className="text-2xl font-bold text-[#001489] mb-2">Bulk Upload Questions</h2>
          <p className="text-gray-600">Import questions from a CSV file to quickly add multiple questions.</p>

          {/* Drag & Drop Upload Box */}
          <div
            onClick={handleBulkUploadClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) openBulkModal(file.name);
            }}
            className="flex flex-col items-center justify-center gap-3 border border-dashed border-[#001489] rounded-lg p-8 cursor-pointer  hover:from-[#f0f4ff] hover:to-[#e6ecff] transition-all duration-300 shadow-md"
          >
            <FiDownload size={50} className="text-[#001489]" />
            <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
            <p className="text-gray-400 text-sm">CSV file only (Max: 1000 questions)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

    {/* CSV Template & Instructions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {/* Template */}
      <div className="bg-[#f8f9ff] p-4 rounded-lg shadow-sm border border-gray-200 space-y-2">
        <h3 className="font-semibold text-gray-700 text-lg">CSV Template Format</h3>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          <li>Category (Chemistry, Mathematics, Physics, etc.)</li>
          <li>Difficulty (Easy, Medium, or Hard)</li>
          <li>Text (question text)</li>
          <li>Option A, Option B, Option C, Option D</li>
          <li>Correct Option (A, B, C, or D)</li>
          <li>Time Limit (seconds, e.g., 30)</li>
          <li>Explanation (answer explanation)</li>
        </ul>
        <button className="border border-[#001489] text-[#001489] px-4 py-2 rounded-md hover:bg-[#e6ecff] transition font-medium mt-2">
          Download CSV Template
        </button>
      </div>

      {/* Tips */}
      <div className="bg-[#fff8f0] p-4 rounded-lg shadow-sm border border-gray-200 space-y-2">
        <h3 className="font-semibold text-gray-700 text-lg">Tips</h3>
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          <li>Use the template to ensure the correct format.</li>
          <li>Avoid commas within cell values.</li>
          <li>Check spelling and formatting before upload.</li>
          <li>Maximum 1000 questions per upload.</li>
        </ul>
      </div>
    </div>

    {/* Success Message */}
    {modalContent && (
      <p className="text-green-600 font-medium mt-4">{modalContent}</p>
    )}
  </div>
)}


            {/* Preview Modal */}
            {modalType === "preview" && modalContent && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold mb-2">Preview</h2>
                <p className="font-semibold">{modalContent.question}</p>
                <div className="space-y-1">
                  {modalContent.answers.map((a) => (
                    <p key={a.label}>
                      <span className="font-bold">{a.label}. </span>
                      {a.text}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
