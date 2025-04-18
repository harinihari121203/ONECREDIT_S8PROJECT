import { useState } from "react";
import axios from "axios";

const ExemptiveTypeLimit = () => {
  const [formData, setFormData] = useState({
    exemptiveType: "",
    limit: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put("https://onecredit-backend.onrender.com/api/exemptive-limits", {
        exemptiveType: formData.exemptiveType,
        limit: Number(formData.limit)
      });
      setMessage("Limit updated successfully!");
      setFormData({ exemptiveType: "", limit: "" });
    } catch (error) {
      console.error("Error updating limit:", error);
      setMessage("Failed to update limit.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Exemptive Type Limit Fixation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="exemptiveType"
          value={formData.exemptiveType}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        >
          <option value="" disabled hidden>--Select Exemptive Type--</option>
          <option value="Online Course Exemption">Online Course Exemption</option>
          <option value="OneCredit Course">OneCredit Course</option>
          <option value="Honor">Honor</option>
          <option value="Minor">Minor</option>
          <option value="Internship">Internship</option>
        </select>

        <input
          name="limit"
          type="number"
          placeholder="Enter Limit"
          value={formData.limit}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Submit
        </button>

        {message && (
          <p className={`mt-2 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ExemptiveTypeLimit;
