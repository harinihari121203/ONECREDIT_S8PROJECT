import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddHOD = () => {
  const [hodData, setHodData] = useState({
    hod_name: "",
    hod_dept: "",
    hod_emailID: "",
    isActive: true, // Default value is true
  });

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHodData({ ...hodData, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/hods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hodData),
      });

      if (response.ok) {
        alert("HOD added successfully!");
        navigate("/admin-dashboard/available-hods"); // Redirect after success
      } else {
        alert("Failed to add HOD.");
      }
    } catch (error) {
      console.error("Error adding HOD:", error);
      alert("Error adding HOD.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add New HOD</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="hod_name"
          placeholder="HOD Name"
          value={hodData.hod_name}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <input
          type="text"
          name="hod_dept"
          placeholder="HOD Department"
          value={hodData.hod_dept}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <input
          type="email"
          name="hod_emailID"
          placeholder="HOD Email ID"
          value={hodData.hod_emailID}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHOD;
