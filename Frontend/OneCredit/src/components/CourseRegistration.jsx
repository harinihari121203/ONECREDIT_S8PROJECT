import { useState, useEffect } from "react";

const CourseRegistration = () => {
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    rollNo: "",
    email:"",
    yearOfStudy: "",
    semester:"",
    department: "",
  });

  const [availableCourses, setAvailableCourses] = useState([]);
  //const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    if (studentDetails.department) {
      console.log("Fetching courses for department:", studentDetails.department);
      fetch(`http://localhost:8080/api/courses`)
        .then((response) => response.json())
        .then((data) =>  {
          console.log("Courses fetched:", data);  // Debug here
          setAvailableCourses(data); 
    })
        .catch((error) => console.error("Error fetching courses:", error));
    } else {
      setAvailableCourses([]);
    }
  }, [studentDetails.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails({ ...studentDetails, [name]: value });
  };
  const handleRegister = async (courseId, courseTitle) => {
    const registrationDetails = {
      ...studentDetails,
      courseId,
      courseTitle,  // Ensure courseTitle is included
    };
    console.log("Sending registration data:", registrationDetails); 
    try {
      const response = await fetch("http://localhost:8080/api/register-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationDetails),
      });
     // console.log("Response status:", response.status); // Debugging

     const responseData = await response.json();
     console.log("Response data:", responseData); // Debugging
     console.log(responseData)

     if (response.ok) {
      console.log("Registration successful:", responseData);
     // setRegisteredCourses((prev) => [...prev, responseData]);
      alert("Registration successful!");
       // Reset all fields and states
       setStudentDetails({
        name: "",
        rollNo: "",
        email: "",
        yearOfStudy: "",
        Semester: "",
        department: "",
      });
      setAvailableCourses([]);
    } else {
      console.error("Registration failed:", responseData);
      alert(`Registration failed: ${responseData.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error registering course:", error);
    alert("An error occurred while registering.");
  }
};

console.log(availableCourses)
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Register for New Courses</h2>
      
      <div className="mb-4 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={studentDetails.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number"
          value={studentDetails.rollNo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={studentDetails.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="yearOfStudy"
          placeholder="Year of Study"
          value={studentDetails.yearOfStudy}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="semester"
          placeholder="Semester"
          value={studentDetails.Semester}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="department"
          value={studentDetails.department}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Department</option>
          <option value="CSE">Computer Science and Engineering</option>
          <option value="IT">Information Technology</option>
          <option value="CT">Computer Technology</option>
          <option value="CSBS">Computer Science and Business System</option>
          <option value="AIDS">Artificial Intelligence and Data Science</option>
          <option value="AIML">Artificial Intelligence and Machine Learning</option>
          <option value="ECE">Electronics & Communication Engineering</option>
          <option value="ME">Mechanical Engineering</option>
        </select>
      </div>
      {studentDetails.department && (
  <div>
    <h3 className="text-lg font-medium mb-2">One Credit Courses</h3>
    <ul>
      {availableCourses.length > 0 ? (
        availableCourses.map((course) => (
          <li
            key={course._id}
            className="p-2 border rounded mb-2 flex justify-between items-center"
          >
            <span>{course.name}</span> {/* Display course name */}
            <button
              onClick={() => handleRegister(course._id, course.name)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Register
            </button>
          </li>
        ))
      ) : (
        <li className="p-2 text-gray-500">No courses available</li>
      )}
    </ul>
  </div>
)}


      {/* <h3 className="text-lg font-medium mt-4">Registered Courses</h3>
      <ul>
        {registeredCourses.length > 0 ? (
          registeredCourses.map((course, index) => (
            <li key={index} className="p-2 border rounded mb-2">
              {course.courseTitle}
            </li>
          ))
        ) : (
          <li>No courses registered yet.</li>
        )}
      </ul> */}
    </div>
  );
};

export default CourseRegistration;