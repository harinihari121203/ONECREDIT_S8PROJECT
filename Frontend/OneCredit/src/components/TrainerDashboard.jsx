import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import TrainerCourses from "./TrainerCourses";
import TrainerAttendanceMarks from "./TrainerAttendanceMarks";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const TrainerDashboard = () => {
  const auth = getAuth();
  const [trainerEmail, setTrainerEmail] = useState("");
  const [active, setActive] = useState("dashboard");
  const [coursesCount, setCoursesCount] = useState(0);
  //const [studentsCount, setStudentsCount] = useState(0);
  const [courses, setCourses] = useState([]);
  //const nav=useNavigate();
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { 
        setTrainerEmail(user.email);
      } else {
        console.log("No trainer signed in.");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (trainerEmail) {
      fetch(`https://onecredit-backend.onrender.com/api/trainer-courses?email=${trainerEmail}`)
        .then((response) => response.json())
        .then((data) => {
          // Ensure data is an array, or set to an empty array as fallback
          const coursesData = Array.isArray(data) ? data : [];
          setCourses(coursesData);
          setCoursesCount(coursesData.length);

          // Safely calculate total students
          // const totalStudents = coursesData.reduce((sum, course) =>
          //   sum + (Array.isArray(course.students) ? course.students.length : 0)
          //   , 0);

          // setStudentsCount(totalStudents);
        })
        .catch((error) => console.error("Error fetching trainer courses:", error));
    }
  }, [trainerEmail]);


  return (
    <div  className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white shadow-lg">
        <div className="p-6 text-3xl font-bold text-center border-b border-gray-700">OneCredit</div>
        <nav className="mt-6">
          <Link
            to="/trainer-dashboard"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 ${active === "dashboard" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("dashboard")}
          >
            Dashboard
          </Link>
          <Link
            to="/trainer-dashboard/courses"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 ${active === "courses" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("courses")}
          >
            My Courses
          </Link>
          <Link
            to="/trainer-dashboard/attendance-marks"
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg transition-colors duration-200 hover:bg-gray-700 ${active === "attendance-marks" ? "bg-orange-500" : ""
              }`}
            onClick={() => setActive("attendance-marks")}
          >
            Attendance & Marks
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ paddingLeft: '0', margin: 0, marginLeft: '28px'}} className="flex-1 p-8">
        <Routes>
          <Route
            path="/"
            element={
              trainerEmail ? (
                <div>
                  {/* Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-orange-500">
                      <h3 className="text-lg font-semibold text-gray-700">Total Courses</h3>
                      <p className="text-4xl font-bold text-indigo-900 mt-2">{coursesCount}</p>
                    </div>
                    {/* <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
                      <p className="text-4xl font-bold text-indigo-900 mt-2">{studentsCount}</p>
                    </div> */}
                  </div>

                  {/* Courses Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">My Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course, index) => (
                        <div key={course._id || index} className="p-6 bg-white rounded-xl shadow-md border-t-4 border-indigo-500">
                          <h3 className="text-lg font-semibold text-black-700">{course.name}</h3>
                          <h3 className="text-lg font-semibold text-gray-700">StartDate: {course.startDate.split("T")[0]}</h3>
                          <h3 className="text-lg font-semibold text-gray-700">EndDate: {course.endDate.split("T")[0]}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading trainer details...</p>
              )
            }
          />
          <Route path="courses" element={<TrainerCourses trainerEmail={trainerEmail} />} />
          <Route path="attendance-marks" element={<TrainerAttendanceMarks trainerEmail={trainerEmail} />} />
        </Routes>
      </div>
    </div>
  );
};

export default TrainerDashboard;