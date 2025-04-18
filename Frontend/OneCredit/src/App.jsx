import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import AdminDashboard from "./components/AdminDashboard";
import TrainerDashboard from "./components/TrainerDashboard";
import StudentDashboard from "./components/StudentDashboard";
import RegisteredCourses from "./components/RegisteredCourses";
import CompletedCourses from "./components/CompletedCourses";
import CourseRegistration from "./components/CourseRegistration"; 
import ElectiveExemption from "./components/ElectiveExemption";
import TrainerCourses from "./components/TrainerCourses";
import TrainerAttendanceMarks from "./components/TrainerAttendanceMarks";
import logo from "./assets/bitsathy_logo.png";
import ExemptionDashboard from "./components/ExemptionDashbaord";
import StudentExemptionRequest from "./components/StudentExemptionRequest";


const Home = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      console.log("Token received",token);

      // Store the token in localStorage
    localStorage.setItem("token", token);
    
      // const userEmail = result.user.email;
      // if (userEmail === "harinihari121203@gmail.com") {
      
      //   navigate("/hod-dashboard"); // Redirecting to ExemptionDashboard
      //   return;
      // }  
      const response = await fetch("https://onecredit-backend.onrender.com/api/protected", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const userData = await response.json();
      console.log("User Data from Backend:", userData); // Debugging

      
      if (!userData.role) {
        console.error("User role not found!");
        return;
      }

      localStorage.setItem("userRole", userData.role);
      console.log(userData.role)

      switch (userData.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "trainer":
          navigate("/trainer-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        case "HOD":
          console.log("Navigating to hod-dashboard");  // Debug log
          navigate("/hod-dashboard");
          break;
        case "Autonomy Affairs":
          console.log("Navigating to Autonomy Affairs-dashboard");  // Debug log
          navigate("/autonomy-affairs-dashboard");
          break;
        case "Head Academics":
          console.log("Navigating to Head Academics-dashboard");
          navigate("/head-academics-dashboard");
          break;
        case "COE":
          console.log("Navigating to COE-dashboard");
          navigate("/coe-dashboard");
          break;
        default:
          console.error("Unknown role:", userData.role);
          break;
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg flex flex-col items-center max-w-md">
        {/* <h1 className="text-lg font-bold mb-6">OneCredit Course</h1> */}
        <h2 className="text-2xl font-semibold mb-5">OneCredit Course</h2>
        <h3 className="text-2xl font-semibold mb-5">Welcome Back!</h3>
        
        <img src={logo} alt="BIT Logo" className="w-70 mb-9" />

        <button
          onClick={handleGoogleSignIn}
          className="px-10 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
         Google Sign In
        </button>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
      <Route path="/trainer-dashboard/*" element={<TrainerDashboard />} />
      <Route path="trainer-courses" element={<TrainerCourses />} />
       <Route path="attendance-marks" element={<TrainerAttendanceMarks />} />
      {/* Student Dashboard with Nested Routes */}
      <Route path="/student-dashboard/*" element={<StudentDashboard />}>
        <Route path="registered-courses" element={<RegisteredCourses />} />
        <Route path="completed-courses" element={<CompletedCourses />} />
        <Route path="register-course" element={<CourseRegistration />} />
        <Route path="elective-exemption" element={<ElectiveExemption />} />
        <Route path="exemption-request" element={<StudentExemptionRequest/>} />
      </Route>
      <Route path="/hod-dashboard" element={<ExemptionDashboard role="HOD" />} />
        <Route path="/autonomy-affairs-dashboard" element={<ExemptionDashboard role="Autonomy Affairs" />} />
        <Route path="/head-academics-dashboard" element={<ExemptionDashboard role="Head Academics" />} />
        <Route path="/coe-dashboard" element={<ExemptionDashboard role="COE" />} />

    </Routes>
  </Router>
);

export default App;