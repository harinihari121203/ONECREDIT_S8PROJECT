import  { useState } from "react";

const CourseRecommendation = () => {
  const [selectedField, setSelectedField] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // The dropdown options exactly match your schema's enum values.
  const fields = ["Frontend", "Backend", "FullStack", "DevOps", "AI", "DataScience"];

  const fetchRecommendedCourses = async () => {
    if (!selectedField) {
      console.warn("No field selected");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/recommend-courses?field=${selectedField}`);
      const data = await response.json();
      setRecommendedCourses(data);
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Course Recommendation</h2>
      <label className="block mb-2 text-lg font-medium">
        Select Your Field of Interest:
      </label>
      <select
        value={selectedField}
        onChange={(e) => setSelectedField(e.target.value)}
        className="p-2 border rounded-md mb-4"
      >
        <option value="">--Select Field--</option>
        {fields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
      <button
        onClick={fetchRecommendedCourses}
        className="bg-purple-600 text-white px-4 py-2 rounded-md ml-4"
      >
        Submit
      </button>

      {recommendedCourses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Recommended Courses:</h3>
          <ul className="list-disc ml-6">
            {recommendedCourses.map((course) => (
              <li key={course._id} className="text-lg">
                {course.name} - {course.field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseRecommendation;
