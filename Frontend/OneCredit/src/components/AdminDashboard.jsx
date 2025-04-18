import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
//import { getAuth, onAuthStateChanged } from "firebase/auth";
import AddCourse from "./AddCourse";
import AddTrainer from "./AddTrainer";
import AvailableHods from "./AvailableHods";
import AddHOD from "./AddHOD";
import AdditionalHOD from "./AvailableHod's render";
import ExemptiveTypeLimit from "./ExemptiveTypeLimit";


const AdminDashboard = () => {
  // const auth = getAuth();
  //const [adminEmail, setAdminEmail] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [hods, setHods] = useState([]);
  //const [students, setStudents] = useState([]);
  //const [availableCourses, setAvailableCourses] = useState([]);
  //const [availableTrainers, setAvailableTrainers] = useState([]);
  


  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) setAdminEmail(user.email);
  //   });
  //   return () => unsubscribe();
  // }, [auth]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
    const userRole = userData?.role; // Get role from user object
    const userDepartment = userData?.department; // Get department

    if (userRole === "admin") {
      console.log("Admin logged in - No department needed");
      return; // Stop API call for admin
    }

    if (!userDepartment) {
      console.error("No department found for user");
      return;
    }

    fetch(`https://onecredit-backend.onrender.com/api/courses?department=${encodeURIComponent(userDepartment)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Courses API Response:", data);
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);


  useEffect(() => {
  fetch("https://onecredit-backend.onrender.com/api/courses")
    .then((res) => res.json())
    .then((data) => {
      console.log("Courses API Response:", data);
      setCourses(Array.isArray(data) ? data : []);
    })
    .catch((err) => console.error("Error fetching courses:", err));

  fetch("https://onecredit-backend.onrender.com/api/trainers")
    .then((res) => res.json())
    .then((data) => {
      console.log("Trainers API Response:", data);
      setTrainers(Array.isArray(data) ? data : []);
    })
    .catch((err) => console.error("Error fetching trainers:", err));
  },[]);

  // fetch("https://onecredit-backend.onrender.com/api/students")
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log("Students API Response:", data);
  //     setStudents(Array.isArray(data) ? data : []);
  //   })
  //   .catch((err) => console.error("Error fetching students:", err));

  //   fetch("https://onecredit-backend.onrender.com/api/available-courses")
  //     .then((res) => res.json())
  //     .then((data) => setAvailableCourses(data))
  //     .catch((err) => console.error("Error fetching available courses:", err));

  //   fetch("https://onecredit-backend.onrender.com/api/available-trainers")
  //     .then((res) => res.json())
  //     .then((data) => setAvailableTrainers(data))
  //     .catch((err) => console.error("Error fetching available trainers:", err));
  // }, []);


  const handleAddCourse = async (courseData) => {
    console.log("Course data being sent:", courseData); // Debugging
    try {
      const response = await fetch("https://onecredit-backend.onrender.com/api/add-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });



      if (!response.ok) {
        const errorData = await response.json(); // Extract error details
        throw new Error(errorData.message || "Failed to add course");
      }

      const responseData = await response.json(); // Read response JSON once
      console.log("Course added successfully:", responseData);
    } catch (error) {
      console.error("Error adding course:", error.message);
    }
  };


  const handleAddTrainer = (trainer) => {
    fetch("https://onecredit-backend.onrender.com/api/trainers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainer),
    })
      .then((res) => res.json())
      .then((data) => setTrainers([...trainers, data]))
      .catch((err) => console.error("Error adding trainer:", err));
  };

 

  useEffect(() => {
    fetch("https://onecredit-backend.onrender.com/api/users/student-count")
      .then((res) => res.json())
      .then((data) => {
        console.log("Student Count:", data.studentsCount);
        setStudentCount(data.studentsCount); // ✅ Correctly use setStudentCount
      })
      .catch((err) => console.error("Error fetching student count:", err));
  }, []);
  // const [hods, setHods] = useState([]);

  // Fetch the HODs data
  useEffect(() => {
    fetch("https://onecredit-backend.onrender.com/api/hods")
      .then((res) => res.json())
      .then((data) => {
        console.log("HODs API Response:", data);
        setHods(data || []); // Set the HODs dynamically
        console.log(hods)
      })
      .catch((err) => console.error("Error fetching HODs:", err));
  }, [hods]);



  return (
    <div className="flex min-h-screen bg-gray-100"> {/* Ensure the entire page height is covered */}
      
      {/* Sidebar */}
      <div className="w-64 bg-black text-white shadow-lg">
        <div className="p-6 text-3xl font-bold text-center border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="mt-6">
          <Link
            to="/admin-dashboard"
            onClick={() => setActive("dashboard")}
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg ${
              active === "dashboard" ? "bg-orange-500" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin-dashboard/add-course"
            onClick={() => setActive("add-course")}
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg ${
              active === "add-course" ? "bg-orange-500" : ""
            }`}
          >
            Add Courses
          </Link>
          <Link
            to="/admin-dashboard/add-trainer"
            onClick={() => setActive("add-trainer")}
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg ${
              active === "add-trainer" ? "bg-orange-500" : ""
            }`}
          >
            Add Trainers
          </Link>
          <Link
            to="/admin-dashboard/available-hods"
            onClick={() => setActive("available-hods")}
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg ${
              active === "available-hods" ? "bg-orange-500" : ""
            }`}
          >
            Available HODs
          </Link>
          <Link
            to="/admin-dashboard/exemptive-type-limits"
            onClick={() => setActive("exemptive-type-limits")}
            className={`block px-6 py-3 mt-2 text-md font-medium rounded-lg ${
              active === "exemptive-type-limits" ? "bg-orange-500" : ""
            }`}
          >
           ExemptiveType limit Fixation
          </Link>
        </nav>
      </div>
  
      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route
            path="add-course"
            element={<AddCourse onAddCourse={handleAddCourse} />}
          />
          <Route
            path="add-trainer"
            element={<AddTrainer courses={courses} onAddTrainer={handleAddTrainer} />}
          />
          <Route path="available-hods" element={<AvailableHods />} />
          <Route
            path="additional-available-hods"
            element={<AdditionalHOD />}
          />
          <Route path="add-hod" element={<AddHOD />} />
          <Route path="exemptive-type-limits" element={<ExemptiveTypeLimit/>}/>
          <Route
            path="/"
            element={
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-orange-500">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Total Students
                    </h3>
                    <p className="text-4xl font-bold text-indigo-900 mt-2">
                      {studentCount}
                    </p>
                  </div>
  
                  <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Total Trainers
                    </h3>
                    <p className="text-4xl font-bold text-indigo-900 mt-2">
                      {trainers.length}
                    </p>
                  </div>
  
                  <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-green-500">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Total Courses
                    </h3>
                    <p className="text-4xl font-bold text-indigo-900 mt-2">
                      {courses.length}
                    </p>
                  </div>
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4 border-b pb-2">
                      Available Trainers
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {trainers.length > 0 ? (
                        trainers.map((trainer) => (
                          <li key={trainer._id} className="text-md text-gray-700">
                            {trainer.name}
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No available trainers
                        </p>
                      )}
                    </ul>
                  </div>
  
                  <div className="p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4 border-b pb-2">Available Courses</h3>
                  <ul className="mt-2 space-y-2">
                    {courses.length > 0 ? (
                      courses.map((course, index) => (
                        <li key={index} className="text-md text-gray-700">{course.name}</li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No available courses</p>
                    )}
                  </ul>
                </div>
              </div>
            </>
          } />
        </Routes>
      </div>
    </div>
  );
};



export default AdminDashboard;   