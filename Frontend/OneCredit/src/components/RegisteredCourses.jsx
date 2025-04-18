import  { useEffect, useState } from "react";
import PropTypes from "prop-types";  // Import PropTypes


const RegisteredCourses = ({ studentEmail }) => {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //console.log(studentEmail);

  useEffect(() => {
    if (studentEmail) {
      fetch(`http://localhost:8080/api/registered-courses?email=${encodeURIComponent(studentEmail)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setRegisteredCourses(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching registered courses:", err);
          setError("Failed to fetch registered courses.");
          setLoading(false);
        });
    }
  }, [studentEmail]);

  if (loading) {
    return <p>Loading registered courses...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      
      {registeredCourses.length > 0 ? (
        <ul>
          {registeredCourses.map((course) => (
            <li key={course._id} className="p-2 border rounded mb-2">
              <h3 className="text-lg font-medium">{course.title || course.courseTitle}</h3> {/* Adjusted for possible variations */}
              <p className="text-sm text-gray-500">
                Registered on: {new Date(course.registeredDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No registered courses found.</p>
      )}
    </div>
  );
};

// Add PropTypes validation
RegisteredCourses.propTypes = {
  studentEmail: PropTypes.string,  // Validate studentEmail as a required string
};


export default RegisteredCourses;
