import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const AddTrainer = ({ onAddTrainer }) => {
  const [courses, setCourses] = useState([]); // State to store courses
  const [formData, setFormData] = useState({ name: "", email: "", expertise: "", selectedCourses: [] });

  // Fetch courses from the API when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://onecredit-backend.onrender.com/api/courses");  // Update with your actual API endpoint
        const data = await response.json();
        setCourses(data);  // Set fetched courses into state
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []); // Runs only once when component mounts

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle course selection with date conflict validation
  const handleCourseSelect = (e) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = courses.find(course => course._id === selectedCourseId);

    if (!selectedCourse) return;

    // Check if the selected course overlaps with any already selected course
    const dateConflict = formData.selectedCourses.some(courseId => {
      const existingCourse = courses.find(c => c._id === courseId);
      return (
        new Date(existingCourse.startDate) < new Date(selectedCourse.endDate) &&
        new Date(selectedCourse.startDate) < new Date(existingCourse.endDate)
      );
    });

    if (dateConflict) {
      alert("Course dates conflict with an already selected course.");
      return;
    }

    // Add course to selectedCourses if no conflict
    setFormData({ ...formData, selectedCourses: [...formData.selectedCourses, selectedCourseId] });
  };

  // Remove a selected course
  const handleRemoveCourse = (courseId) => {
    setFormData({
      ...formData,
      selectedCourses: formData.selectedCourses.filter(id => id !== courseId),
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTrainer(formData);
    setFormData({ name: "", email: "", expertise: "", selectedCourses: [] });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Trainer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Trainer Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
        <input
          name="expertise"
          placeholder="Expertise"
          value={formData.expertise}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />

        <label className="block font-medium">Select Courses:</label>
        <select onChange={handleCourseSelect} className="block w-full p-2 border rounded">
          <option value="">Select a course</option>
          {courses.length > 0 ? (
            courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name} ({course.startDate} to {course.endDate})
              </option>
            ))
          ) : (
            <option disabled>Loading courses...</option>
          )}
        </select>

        {/* Display selected courses */}
        <div className="mt-4">
          <h3 className="font-semibold">Selected Courses:</h3>
          {formData.selectedCourses.length > 0 ? (
            <ul>
              {formData.selectedCourses.map((courseId) => {
                const course = courses.find(c => c._id === courseId);
                return (
                  <li key={courseId} className="flex justify-between items-center border p-2 rounded mt-2">
                    {course?.name} ({course?.startDate} to {course?.endDate})
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(courseId)}
                      className="bg-red-500 text-white px-2 py-1 rounded ml-4"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">No courses selected</p>
          )}
        </div>

        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Submit
        </button>
      </form>
    </div>
  );
};

AddTrainer.propTypes = {
  onAddTrainer: PropTypes.func,
};

export default AddTrainer;
