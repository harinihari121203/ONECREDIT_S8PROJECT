import { useState, useEffect } from "react";
import PropTypes from "prop-types"; 

const CourseMaterials = ({ studentEmail }) => {
    const [studentCourses, setStudentCourses] = useState([]);
  
    useEffect(() => {
      if (studentEmail) {
        fetch(`http://localhost:8080/api/student-courses?email=${studentEmail}`)
          .then((response) => response.json())
          .then((data) => setStudentCourses(data))
          .catch((error) =>
            console.error("Error fetching student courses:", error)
          );
      }
    }, [studentEmail]);
  
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 border-b pb-2">
          Course Materials
        </h3>
        {studentCourses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          studentCourses.map((course) => (
            <div key={course._id} className="mb-6 border-b pb-4 last:border-none">
              <h4 className="text-xl font-bold text-gray-800">{course.name}</h4>
              <p className="text-gray-600">{course.description}</p>
              {course.materials && course.materials.length > 0 ? (
                <div className="mt-2">
                  <h5 className="font-semibold text-gray-700">Materials:</h5>
                  <ul className="list-disc ml-5">
                    {course.materials.map((material) => (
                      <li key={material.id}>
                        <a
                          href={material.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {material.title}
                        </a>
                        {material.description && (
                          <p className="text-gray-500 text-sm">
                            {material.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-2 text-gray-600">No materials uploaded yet.</p>
              )}
            </div>
          ))
        )}
      </div>
    );
  };  

  CourseMaterials.propTypes = {
    studentEmail: PropTypes.string.isRequired,
  };
  export default CourseMaterials;