import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import RegisteredCourses from "./RegisteredCourses";
import CompletedCourses from "./CompletedCourses";
import CourseRegistration from "./CourseRegistration";
import CourseRecommendation from "./CourseRecommendation";
import ElectiveExemption from "./ElectiveExemption";
import StudentExemptionRequest from "./StudentExemptionRequest";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
import axios from "axios";

import OnlineCourseDashboard from "./OnlineCourse";

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

const StudentDashboard = () => {
  const auth = getAuth();
  const [studentEmail, setStudentEmail] = useState("");
  const [user, setUser] = useState(null); // Initialize user as an object
  const [active, setActive] = useState("dashboard");
  const [registeredCoursesCount, setRegisteredCoursesCount] = useState(0);
  const [CompletedCoursesCount, setCompletedCoursesCount] = useState(0);
  const [totalCredits, setTotalCredits] = useState(() => {
    const storedCredits = localStorage.getItem("totalCredits");
    return storedCredits ? parseInt(storedCredits, 10) : 0;
  });


  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setStudentEmail(user.email);
        sessionStorage.setItem("studentemail",studentEmail)
      } else {
        console.log("No user is signed in.");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          _id: currentUser.uid, // Using Firebase UID as studentId
        });
      } else {
        console.log("No user is signed in.");
        setUser(null); // Reset user if not signed in
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (studentEmail) {
      // Fetch registered courses count
      fetch(`http://localhost:8080/api/registered-courses?email=${studentEmail}`)
        .then((response) => response.json())
        .then((data) => setRegisteredCoursesCount(data.length))
        .catch((error) =>
          console.error("Error fetching registered courses:", error)
        );
    }
  }, [studentEmail]);





  useEffect(() => {
  const fetchCompletedCourses = async () => {
    try {
      const studentId = user?._id;
      const response = await axios.get(
        `http://localhost:8080/attendance_marks?studentId=${studentId}&completed_status=Yes`
      );
      //setCompletedCourses(response.data);
      //console.log("Fetched Completed Courses:", response.data);
      //console.log(response)
      setCompletedCoursesCount(response.data.length);
      
    } catch (error) {
      console.error("Error fetching completed courses", error); 
    }
  }; 
  if (user?._id)
     fetchCompletedCourses();
}, [user]); 

// useEffect(() => {
//   if (studentEmail) {

//     const studentId = user?._id;
//     fetch(`http://localhost:8080/api/exemptions/student/${studentId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data,"data")
//         let totalApprovedOnlineCredits = 0;
//         data.forEach((req) => {
//   if (
//     req.exemptiveType === "Online Course" &&
//     req.status === "Approved by COE"
//   ) {
//     try {
//       const details =
//         typeof req.details === "string"
//           ? JSON.parse(req.details)
//           : req.details;

//       const credit = parseInt(details?.credits || 0);
//       console.log(credit, "credit");
//       totalApprovedOnlineCredits += credit;
//     } catch (err) {
//       console.error("Error parsing details for exemption:", req, err);
//     }
//   }
// });
// setTotalCredits(totalApprovedOnlineCredits)
//       })
//       .catch((error) => {
//         console.error("Error fetching exemption requests:", error);
//       });
//   }
// }, [studentEmail]);

console.log("studentCredits",totalCredits)










 


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white shadow-lg">
        <div className="p-6 text-3xl font-bold text-center border-b border-gray-700">
          OneCredit
        </div>
        <nav className="mt-6">
          <Link
            to="/student-dashboard"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 ${active === "dashboard" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("dashboard")}
          >
            Dashboard
          </Link>
          <Link
            to="/student-dashboard/register-course"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 ${active === "register-course" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("register-course")}
          >
            Register Courses
          </Link>
          <Link
            to="/student-dashboard/elective-exemption"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 ${active === "elective-exemption" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("elective-exemption")}
          >
            Elective Exemption Request
          </Link>
          <Link
            to="/student-dashboard/course-materials"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 ${active === "course-materials" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("course-materials")}
          >
            Course Materials
          </Link>
          <Link to="/student-dashboard/course-recommendation"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg hover:bg-gray-700 ${active === "course-recommendation" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("course-recommendation")}
          >
            Course Recommendation
          </Link>
          <Link
            to="/student-dashboard/online-course"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 ${active === "online-course" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("online-course")}
          >
           Online Course
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={
              studentEmail ? (
                <div>
                  {/* Dashboard Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-orange-500">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Enrolled Courses
                      </h3>
                      <p className="text-4xl font-bold text-indigo-900 mt-2">
                        {registeredCoursesCount}
                      </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-green-500">
                      <h3 className="text-lg font-semibold text-gray-700">Completed Courses</h3>
                      <p className="text-4xl font-bold text-indigo-900 mt-2">{CompletedCoursesCount}</p>
                    </div>
                  </div>

                 
                    

                  {/* Registered & Completed Courses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-white rounded-xl shadow-md">
                      <h3 className="text-lg font-semibold text-indigo-900 mb-4 border-b pb-2">
                        Registered Courses
                      </h3>
                      <RegisteredCourses studentEmail={studentEmail} />
                    </div>
                    <div className="p-6 bg-white rounded-xl shadow-md">
                      <h3 className="text-lg font-semibold text-indigo-900 mb-4 border-b pb-2">
                        Completed Course History
                      </h3>
                      <CompletedCourses  studentId={user?._id}/>
                    </div>
                  </div>

                  
                 
                  {/* <div className="p-6 bg-white rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4 border-b pb-2">
                      Exemption Requests
                    </h3> */}
                    
                    <StudentExemptionRequest studentId={user?._id} />
                  </div>
                // </div>
              ) : (
                <p>Loading user details...</p>
              )
            }
          />
          <Route
            path="register-course"
            element={<CourseRegistration />}
          />
          <Route
            path="elective-exemption"
            element={<ElectiveExemption totalCredits={totalCredits} settotalcredits={setTotalCredits}/>}
          />
          <Route
            path="course-materials"
            element={<CourseMaterials studentEmail={studentEmail} />}
          />
        <Route path="course-recommendation" 
        element={<CourseRecommendation />} /> 
        <Route path="online-course" 
        element={<OnlineCourseDashboard totalCredits={totalCredits} settotalcredits={setTotalCredits}/>}/>
        </Routes>

      </div>
    </div>
  );
};

// StudentDashboard.propTypes = {
//   studentEmail: PropTypes.string.isRequired,
// };

CourseMaterials.propTypes = {
  studentEmail: PropTypes.string.isRequired,

};



export default StudentDashboard;

