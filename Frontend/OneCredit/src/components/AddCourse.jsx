import { useState } from "react";
import PropTypes from "prop-types";

const AddCourse = ({ onAddCourse }) => {
  if (!onAddCourse) {
    console.error("onAddCourse prop is missing!");
  }

  const [formData, setFormData] = useState({
    name: "",
    code:"",
    field:"",
    description: "",
    credits: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.code ||
      !formData.field ||
      !formData.description ||
      !formData.credits ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Please fill all fields before submitting!");
      return;
    }

    const formattedData = {
      ...formData
    //   eligible_departments: formData.eligible_departments
    //     .split(",")
    //     .map((dep) => dep.trim()), 
    };

    onAddCourse(formattedData);

    setFormData({
      name: "",
      code:"",
      field: "",
      description: "",
      // eligible_departments: "",
      credits: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Course Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />  
        <input
          name="code"
          placeholder="Course Code"
          value={formData.code}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        /> 
       <select
        name="field"
        value={formData.field}
        onChange={handleChange}
        required
        className="block w-full p-2 border rounded"
      >
        <option value="">--Select Field--</option>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="Fullstack">Fullstack</option>
        <option value="Devops">DevOps</option>
        <option value="AI">AI</option>
        <option value="DataScience">Data Science</option>
      </select>

        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        {/* <input
          name="eligible_departments"
          placeholder="Eligible Departments"
          value={formData.eligible_departments}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        /> */}
        <input
          name="credits"
          placeholder="No. of Credits"
          type="number"
          value={formData.credits}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <input
          name="startDate"
          placeholder="Start Date"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <input
          name="endDate"
          placeholder="End Date"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Submit
        </button>
      </form>
    </div>
  );
};

AddCourse.propTypes = {
  onAddCourse: PropTypes.func,
};

export default AddCourse;
