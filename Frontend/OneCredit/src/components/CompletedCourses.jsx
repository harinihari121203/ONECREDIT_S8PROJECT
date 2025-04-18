import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const CompletedCourses = ({ studentId }) => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [mergedCourses, setMergedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      try {
        const response = await axios.get(
          `https://onecredit-backend.onrender.com/attendance_marks?studentId=${studentId}&completed_status=Yes`
        );
        console.log("Completed Courses Response:", response.data);
        setCompletedCourses(response.data || []);
      } catch (error) {
        console.error("Error fetching completed courses", error);
        setCompletedCourses([]); // Ensure state is still set
      }
    };

    if (studentId) {
      fetchCompletedCourses();
    }
  }, [studentId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`https://onecredit-backend.onrender.com/api/courses`);
        console.log("Available Courses Response:", response.data);
        setAvailableCourses(response.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setAvailableCourses([]); // Ensure state is still set
      }
    };

    fetchCourses();
  }, []);

  // useEffect(() => {
  //   if (completedCourses.length > 0 && availableCourses.length > 0) {
  //     console.log("Matching courses...");

  //     const updatedCourses = completedCourses.map((completed) => {
  //       const matchingCourse = availableCourses.find((course) => {
  //         console.log(`Comparing: ${course.courseId} === ${completed.courseId}`);
  //         return String(course.courseId) === String(completed.courseId);
  //       });

  //       return {
  //         ...completed,
  //         courseName: matchingCourse ? matchingCourse.name : "Course Not Found",
  //       };
  //     });

  //     console.log("Final Merged Courses:", updatedCourses);
  //     setMergedCourses(updatedCourses);
  //   } else {
  //     setMergedCourses([]); // Avoid stale state
  //   }

  //   setLoading(false);
  // }, [completedCourses, availableCourses]);

  console.log(completedCourses)

  useEffect(() => {
    const allCompletedCourses = completedCourses
      .map((completedElement) => {
        // Find the matching course in availableCourses
        const foundCourse = availableCourses.find((ele) => ele._id === completedElement.courseId);
  
        // If a match is found, merge data from completedCourses and availableCourses
        if (foundCourse) {
          return {
            courseName: foundCourse.name, // Extract course name from availableCourses
            completedStatus: completedElement.completed_status, // Extract completed status from completedCourses
            completedDate: completedElement.updatedAt
            , // Extract completed date from completedCourses
          };
        }
        return null; // Return null if no match is found
      })
      .filter((ele) => ele !== null); // Remove null values
  
    console.log(allCompletedCourses);
  
    setMergedCourses(allCompletedCourses);
    setLoading(false);
  }, [completedCourses, availableCourses]);


  console.log(mergedCourses)
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : mergedCourses.length > 0 ? (
        <ul>
          {mergedCourses.map((course, index) => (
            <li key={index} className="mb-1 p-2 border rounded">
              <h3 className="text-lg font-medium">
                {course.courseName}
              </h3>
              <p className="text-sm text-gray-500">
                Completed on: {course.completedDate? new Date(course.completedDate ).toLocaleDateString(): "N/A"}
              </p>
              <p>Status: {course.completedStatus}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No completed courses available.</p>
      )}
    </div>
  );
};

CompletedCourses.propTypes = {
  studentId: PropTypes.string.isRequired,
};

export default CompletedCourses;
