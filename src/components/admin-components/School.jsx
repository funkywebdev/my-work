import React, { useEffect, useState } from "react";
import Table from "../../components/admin-components/Table";
import axios from "axios";

const School = () => {

  const [schools, setSchools] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // modal open state
  const [matches, setMatches] = useState([]); // saved matches
 
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
  });

 const storageKey = "bolo_quiz_matches_v1";
 const baseUrl = "https://bql-production.up.railway.app";
 const adminToken = localStorage.getItem('token');

 //console.log(adminToken);

   useEffect(() => {
  axios
    .get(`${baseUrl}/schools`, {
      headers : {
       "Authorization": `Bearer ${adminToken}`
      }
    })
    .then((response) => {
     //console.log("student fetched",response.data); 
      setSchools(response.data); 
    })
    .catch((err) => {
      console.error("Error fetching students:", err);
      
    });
}, []); 





  // Load matches from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        setMatches(JSON.parse(raw));
      } catch {
        setMatches([]);
      }
    }
  }, []);

  const saveToStorage = (arr) => {
    localStorage.setItem(storageKey, JSON.stringify(arr));
  };

  const openModal = () => {
    setForm({ title: "", date: "", description: "" });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please provide a title for the match.");
      return;
    }

    const newMatch = {
      id: Date.now(),
      title: form.title.trim(),
      date: form.date || null,
      description: form.description.trim() || "",
    };

    const updated = [newMatch, ...matches];
    setMatches(updated);
    saveToStorage(updated);
    setIsOpen(false);
  };

  const handleDelete = (id) => {
    const updated = matches.filter((m) => m.id !== id);
    setMatches(updated);
    saveToStorage(updated);
  };

  return (
    <div className="p-4">
      {/* Header + Create Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 w-full">
  {/* Left section */}
  <div>
    <h1 className="font-semibold text-[16px] sm:text-2xl">
      School Management
    </h1>
    <p className="text-sm text-gray-600">
      Manage registration, rosters and approvals
    </p>
  </div>

  {/* Right section: Create Match button */}
  <div className="flex justify-start sm:justify-end w-full sm:w-auto">
    <button
      onClick={openModal}
      className="flex items-center gap-2 bg-[#1115CB] text-white px-4 py-2 sm:py-2 rounded-md hover:opacity-95 transition w-full sm:w-auto justify-center"
    >
      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-[#1115CB] font-bold">
        +
      </span>
      <span>Create Match</span>
    </button>
  </div>
</div>


      {/* Matches List */}
      <div>
        {matches.length > 0 && (
          <ul className="space-y-3">
            {matches.map((m) => (
              <li
                key={m.id}
                className="p-3 rounded-md bg-white shadow-sm flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold">{m.title}</div>
                  {m.date && (
                    <div className="text-xs text-gray-500">{m.date}</div>
                  )}
                  {m.description && (
                    <div className="text-sm text-gray-700 mt-1">
                      {m.description}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard?.writeText(JSON.stringify(m))
                    }
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Copy JSON
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
            aria-hidden
          />
          <form
            onSubmit={handleCreate}
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10"
          >
            <h3 className="text-lg font-semibold mb-4">Create Match</h3>

            <label className="block mb-2">
              <span className="text-sm font-medium">Title</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Inter-School Quiz 2025"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1115CB]"
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-medium">Date</span>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Optional description"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1115CB] text-white rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
      <Table schools={schools} />
    </div>
  );
};

export default School;
