import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TrainerCourses = ({ trainerEmail }) => {
  const [courses, setCourses] = useState([]);
  const [uploadingCourseId, setUploadingCourseId] = useState(null);
  const [file, setFile] = useState(null);
  const [materialTitle, setMaterialTitle] = useState("");
  //const [materialDescription, setMaterialDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch trainer courses
  useEffect(() => {
    if (trainerEmail) {
      fetch(`http://localhost:8080/api/trainer-courses?email=${trainerEmail}`)
        .then((response) => response.json())
        .then((data) => setCourses(data))
        .catch((error) => console.error("Error fetching trainer courses:", error));
    }
  }, [trainerEmail]);

  const openUploadForm = (courseId) => {
    setUploadingCourseId(courseId);
  };

  const closeUploadForm = () => {
    setUploadingCourseId(null);
    setFile(null);
    setMaterialTitle("");
    //setMaterialDescription("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload material handler
  const handleUpload = async (courseId) => {
    if (!file || !materialTitle) {
      alert("Please provide a file and a title for the material.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("file", file);
      formData.append("title", materialTitle);
      //formData.append("description", materialDescription);

      const response = await fetch("http://localhost:8080/api/upload-material", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === updatedCourse._id ? updatedCourse : course
          )
        );
        alert("Material uploaded successfully!");
        closeUploadForm();
      } else {
        alert("Failed to upload material.");
      }
    } catch (error) {
      console.error("Error uploading material:", error);
      alert("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "0px", marginLeft: "18px" }}>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="p-6 bg-white rounded-xl shadow-md border-t-4 border-indigo-500">
            <h3 className="text-lg font-semibold text-gray-700">{course.name}</h3>
            <p className="text-gray-600 mt-2">{course.description}</p>
            {/* List materials if any */}
            {course.materials && course.materials.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Materials:</h4>
                <ul className="list-disc ml-5">
                  {course.materials.map((material) => (
                    <li key={material.id}>
                      <a href={material.fileUrl} target="_blank" rel="noreferrer">{material.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => openUploadForm(course._id)}
            >
              Upload Material
            </button>
            {uploadingCourseId === course._id && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                <h4 className="font-semibold text-gray-700 mb-2">Upload Material</h4>
                <input
                  type="text"
                  placeholder="Material Title"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                {/* <textarea
                  placeholder="Material Description (optional)"
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                /> */}
                <input type="file" onChange={handleFileChange} className="mb-2" />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpload(course._id)}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    onClick={closeUploadForm}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

TrainerCourses.propTypes = {
  trainerEmail: PropTypes.string,
};

export default TrainerCourses;
