import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientMedicalHistoryModal({ isOpen, onClose, onUpdate, patient  }) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
  if (!isOpen || !patient?.patient_id) return;

  let didCancel = false;

  axios
    .get(`/medicalhistory/${patient.patient_id}`)
    .then((response) => {
      if (didCancel) return;

      const data = response.data;
      if (Array.isArray(data) && data.every((item) => typeof item === "string")) {
        setTags(data);
      } else {
        console.warn("Unexpected data format:", data);
        setTags([]);
      }
    })
    .catch((error) => {
      if (!didCancel) {
        console.error("Error fetching medical history:", error.response?.data || error.message);
        setTags([]);
      }
    });

  return () => {
    didCancel = true;
  };
}, [isOpen, patient?.patient_id]);


  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault();
      const trimmedTag = newTag.trim();
      if (!tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setNewTag("");
      }
    }
  };

  const handleUpdate = () => {
   let updatedTags;

if (newTag) {
  updatedTags = [...tags, newTag];
} else {
  updatedTags = tags;
}
    axios
      .post("/medicalhistory/add", {
        patient_id: patient.patient_id,
        diseases: updatedTags
      })
      .then(() => {
        onUpdate(tags);
        onClose();
      })
      .catch((err) => {
        console.error("Error updating medical history:", err.response?.data || err.message);
      });
      setNewTag("")
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[40%] p-6">
        <h2 className="text-xl font-bold text-[#429ABF] mb-4">UPDATE MEDICAL HISTORY</h2>

        <div className="w-[90%] m-auto">
        <label className="text-[#429ABF] font-semibold mb-2 block">
          Update Medical History
        </label>

        <div className="border rounded-md p-3 flex flex-wrap gap-2 min-h-[60px]">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#429ABF] text-white px-3 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="ml-2 text-white font-bold hover:text-gray-200"
              >
                ×
              </button>
            </span>
          ))}

          <input
  type="text"
  value={newTag}
  onChange={(e) => setNewTag(e.target.value)}
  onKeyDown={handleKeyDown}
  className="flex-1 min-w-[100px] border-0 focus:outline-none focus:ring-0"
/>

        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="text-[#429ABF] rounded px-4 py-2  hover:text-white cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-[#429ABF] text-white rounded px-4 py-2 save-button"
          >
            Update
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
