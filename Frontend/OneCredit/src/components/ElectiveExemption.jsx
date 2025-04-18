import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import PropTypes from "prop-types";

const ElectiveExemption = ({ totalCredits, settotalcredits }) => {
  const auth = getAuth();
  const [studentEmail, setStudentEmail] = useState("");
  const [pendingOnlineCourseRequests, setPendingOnlineCourseRequests] = useState([]);
  const [exemptiveLimits, setexemptiveLimits] = useState([])
  const [limitReached, setLimitReached] = useState(false);
  const [student, setStudent] = useState({
    email: "",
    rollNo: "",
    studentId: "",
    studentName: ""
  });
  console.log(totalCredits, "tot")
  const [selectedOption, setSelectedOption] = useState("");
  //  const [courses, setCourses] = useState([]); // Stores available courses
  const [semesters] = useState(["4", "5", "6", "7"]);
  const [courses, setcourses] = useState([])
  const [completedCourses, setcompletedCourses] = useState([])
  const [months] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);

  const [selectedCourses, setSelectedCourses] = useState([
    { courseCode: "", courseName: "", semester: "", month: "", year: "" },
    { courseCode: "", courseName: "", semester: "", month: "", year: "" },
    { courseCode: "", courseName: "", semester: "", month: "", year: "" }
  ]);
  const [exemptions, setExemptions] = useState([]);

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    rollNo: "",
    email: "",
    exemptiveType: "",
    details: {},
    proof: null, // ✅ Ensure proof is properly stored

  });

  //const [responseMessage, setResponseMessage] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        setStudentEmail(user.email);
      } else {
        console.log("No user is signed in.");
      }
    });
    return () => unsubscribe();
  }, [auth]);
  useEffect(() => {

    const fetchExemptiveLimits = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/exemptiveLimits");

        if (!response.ok) {
          throw new Error("Failed to fetch exemptiveLimits");
        }

        const data = await response.json();
        console.log(data, "data")
        setexemptiveLimits(data);
        console.log(exemptiveLimits, "exemptiveLimits")
      } catch (error) {
        console.log("error", error)
      }
    }

    fetchExemptiveLimits()
  }, [])

  const canSubmitRequest = (selectedType, studentCurrentCount) => {
    const limitObj = exemptiveLimits.find(limit => limit.exemptiveType === selectedType);

    if (!limitObj) {
      console.log("No limit set for this exemptive type.");
      return false;  // Or true, depending on your desired behavior
    }

    return studentCurrentCount < limitObj.limit;
  };

  useEffect(() => {
    const fetchStudentExemptionsCount = async () => {
      if (!formData.studentId || !formData.exemptiveType) return;  // Wait until both are ready

      try {
        const response = await fetch(`http://localhost:8080/api/studentExemptionsCount/${formData.studentId}/${formData.exemptiveType}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student exemption count");
        }

        const { count } = await response.json();

        if (!canSubmitRequest(formData.exemptiveType, count)) {
          setLimitReached(true)
          // alert(`You have reached the maximum limit for ${formData.exemptiveType} exemptions.`);
        }
      } catch (err) {
        console.log("Error fetching exemption count:", err);
      }
    };

    fetchStudentExemptionsCount();
  }, [formData.exemptiveType]);

  // You need to create this API call




  useEffect(() => {
    const fetchExemptions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/exemptions");

        if (!response.ok) {
          throw new Error("Failed to fetch exemptions");
        }

        const data = await response.json();
        setExemptions(data);
        console.log(exemptions)
      } catch (error) {
        console.log("error", error)
      }
    };

    fetchExemptions();
  }, []);

  //console.log(exemptions)


  useEffect(() => {
    if (studentEmail) {
      // Fetch registered courses count
      fetch(`http://localhost:8080/api/registered-courses?email=${studentEmail}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const studentData = data[0];
            setStudent({
              studentId: studentData.uid,
              studentName: studentData.name,
              rollNo: studentData.rollNo,
              email: studentData.email,
            });
          }
          console.log("Fetched Data:", data);
        })
        .catch((error) =>
          console.error("Error fetching registered courses:", error)
        );
    }
  }, [studentEmail, formData.exemptiveType]);



  console.log(student.studentId)



  // Update formData when student details are available
  useEffect(() => {
    if (student) {
      setFormData((prevData) => ({
        ...prevData,
        studentId: student.studentId,
        studentName: student.studentName,
        rollNo: student.rollNo,
        email: student.email,
      }));
    }
  }, [student]); // Runs when `student` is set


  console.log(formData)


  useEffect(() => {

    const fetchCompletedCourses = async (studentId) => {
      console.log(studentId)
      try {

        const response = await axios.get(
          `http://localhost:8080/attendance_marks?studentId=${studentId}&completed_status=Yes`
        );
        console.log("Data from API response", response?.data);
        setcompletedCourses(response?.data);
        console.log(response.data.length);
      } catch (error) {
        console.error("Error fetching completed courses", error);
      }
    };
    fetchCompletedCourses(student.studentId);


  }, [student.studentId])

  useEffect(() => {
    const fetchAllCourses = async () => {
      const response = await axios.get(`http://localhost:8080/api/courses`);
      if (response?.data?.length > 0) {
        setcourses(response?.data)
      }

    }
    fetchAllCourses()

  }, [])


  const allcompletedcoursenames = completedCourses
    .map((completedelement) => {
      const foundCourse = courses.find((ele) => ele._id == completedelement.courseId);
      return foundCourse ? foundCourse : null// Extract name
    })
    .filter((ele) => ele !== null); // Remove null values

  console.log(allcompletedcoursenames);


  // Handle dropdown & input changes for courses
  const handleCourseChange = (index, field, value) => {
    setSelectedCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      updatedCourses[index][field] = value;

      setFormData((prevData) => {
        const existingDetails = typeof prevData.details === "string" ? JSON.parse(prevData.details) : prevData.details || {};

        return {
          ...prevData,
          details: JSON.stringify({
            ...existingDetails,
            courses: updatedCourses,  // ✅ Store all courses inside `details`
          }),
        };
      });

      return updatedCourses;
    });
  };

  //console.log(completedCourses)

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // let calculatedCredits = 0;

    // if (name === "courseDuration") {
    //   if (value === "4 weeks") {
    //     calculatedCredits = 1;
    //   } else if (value === "8 weeks") {
    //     calculatedCredits = 2;
    //   } else if (value === "12 weeks") {
    //     calculatedCredits = 3;
    //   }
    // }
    // For exemptiveType, update both state and selectedOption.
    if (name === "exemptiveType") {
      setSelectedOption(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      details: JSON.stringify({
        ...(typeof prevData.details === "string" ? JSON.parse(prevData.details) : prevData.details),
        [name]: value
      }),
    }));
  };

  // Handle changes for the details object (used for Online Course Exemption ).



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, proof: file }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student) {
      alert("Student details not available");
      return;
    }
    console.log(totalCredits, "tot")
    // ✅ Allow request only if totalCredits is divisible by 3
    if (formData.exemptiveType === "Online Course Exemption")
      if (totalCredits <= 0 || totalCredits % 3 !== 0) {
        alert("You can only request exemption for Online Course Exemption  when your total approved credits are greater than 3");
        return;
      }

    // Validate form
    if (!validateFormData(formData)) {
      alert("Please fill in all required fields.");
      return;
    }

    const requestData = new FormData();

    for (const key in formData) {
      if (key === "details") {
        requestData.append("details", JSON.stringify(formData.details));
      } else {
        requestData.append(key, formData[key]);
      }
    }

    console.log("🚀 Sending FormData:");
    for (let pair of requestData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await fetch("http://localhost:8080/api/exemptions", {
        method: "POST",
        body: requestData,
      });

      console.log("📡 Response Status:", response.status);

      const result = await response.json();
      console.log("📨 Response Data:", result);

      if (response.ok) {
        alert("Exemption request submitted successfully!");
        await fetchExemptions();
        resetForm();
        if (formData.exemptiveType === "Online Course Exemption") {
          setPendingOnlineCourseRequests(prev => [...prev, result.requestId]);
        }
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("❌ Error submitting request:", error);
    }
  };

  useEffect(() => {
    if (pendingOnlineCourseRequests.length === 0) return;

    const interval = setInterval(async () => {
      for (const requestId of pendingOnlineCourseRequests) {
        try {
          const res = await fetch(`http://localhost:8080/api/exemptions/${requestId}`);
          const data = await res.json();

          console.log(`⏳ Checking Status for ${requestId}:`, data);

          if (data.status === "Approved by COE") {


            settotalcredits((prev) => {
              const updatedCredits = prev - 3;
              localStorage.setItem("totalCredits", updatedCredits);  // 🧠 Sync with localStorage
              return updatedCredits;
            });


            // Remove the approved request from pending list
            setPendingOnlineCourseRequests((prev) =>
              prev.filter((id) => id !== requestId)
            );

            alert(`Request ${requestId} approved 3 credit(s) have been decreased.`);
          }
        } catch (err) {
          console.error(`⚠️ Error checking status for ${requestId}:`, err);
        }
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [pendingOnlineCourseRequests]);



  // useEffect(() => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     exemptiveType: selectedOption,
  //   }));
  // }, [selectedOption]);

  // When exemptiveType changes, update the details structure accordingly.
  useEffect(() => {
    if (formData.exemptiveType === "Online Course Exemption") {
      setFormData((prevData) => ({
        ...prevData,
        details: {
          courseDuration: "",
          credits: 0,
        },
      }));
    } else {
      // Reset details for other types if needed.
      setFormData((prevData) => ({
        ...prevData,
        details: {},
      }));
    }
  }, [formData.exemptiveType]);

  // Function to validate the form fields
  const validateFormData = (data) => {
    if (!data.studentId || !data.studentName || !data.rollNo || !data.email || !data.exemptiveType) {
      return false;
    }

    // Add more validation rules as necessary
    return true;
  };


  // Function to fetch exemptions
  const fetchExemptions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/exemptions");

      if (!response.ok) {
        throw new Error("Failed to fetch exemptions");
      }

      const data = await response.json();
      setExemptions(data);
      console.log("Refreshed Exemptions:", data);
    } catch (error) {
      console.error("Error fetching exemptions:", error);
    }
  };



  // Function to reset the form state
  const resetForm = () => {
    setSelectedOption("");
    setSelectedCourses([
      { courseCode: "", courseName: "", semester: "", month: "", year: "" },
      { courseCode: "", courseName: "", semester: "", month: "", year: "" },
      { courseCode: "", courseName: "", semester: "", month: "", year: "" },
    ]);
    setFormData({
      studentId: "",
      studentName: "",
      rollNo: "",
      email: "",
      exemptiveType: "",
      details: {},
      proof: null,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Elective Exemption Requests</h2>
      {limitReached ? (
        <p className="text-red-600 font-semibold mb-4">
          You have reached the maximum limit for {formData.exemptiveType} exemptions.
        </p>
      ) :
        <form onSubmit={handleSubmit} className="mb-6">
          <select
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setFormData((prevData) => ({ ...prevData, exemptiveType: e.target.value }));
            }}
            className="p-2 border rounded mb-4 w-full"
          >
            <option value="">Select Exemption Type</option>
            <option value="OneCredit Course">OneCredit Course</option>
            <option value="Online Course Exemption">Online Course Exemption</option>
            <option value="Honor">Honor</option>
            <option value="Minor">Minor</option>
            <option value="Internship">Internship</option>
          </select>


          {selectedOption === "Online Course Exemption" && formData.exemptiveType === "Online Course Exemption" && (
            <div className="mb-4">
              <input
                type="text"
                name="OnlineCourseName"
                placeholder="Course Offering Agency"
                value={formData.OnlineCourseName}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              />
              <select
                name="ElectiveExemptionRequired"
                value={formData.ElectiveExemptionRequired}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              >
                <option value="">Elective Exemption Required</option>
                <option value="4 semester">4 semester</option>
                <option value="5 semester ">5 semester </option>
                <option value="6 semester">6 semester</option>
                <option value="7 semester">7 semester</option>
              </select>

              <select
                name="ElectiveExemptionOptfor"
                value={formData.ElectiveExemptionOptfor}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              >
                <option value="">Elective exemption opt for</option>
                <option value="Discipline Elective">Discipline Elective</option>
                <option value="Open Elective ">Open Elective </option>
              </select>





            </div>
          )}

          {selectedOption === "Honor" && (
            <div className="mb-4">
              <input
                type="text"
                name="honorCourseName"
                placeholder="Honor CourseName"
                value={formData.honorCourseName}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              />
              <select
                name="ElectiveExemptionRequired"
                value={formData.ElectiveExemptionRequired}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              >
                <option value="">Elective Exemption Required</option>
                <option value="4 semester">4 semester</option>
                <option value="5 semester ">5 semester </option>
                <option value="6 semester">6 semester</option>
                <option value="7 semester">7 semester</option>
              </select>
              <div className="mb-4 p-4 border rounded bg-gray-50">
                <label className="block font-semibold mb-2 text-gray-700">Upload Proof</label>

                {!formData.proof ? (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0-9l-3 3m3-3l3 3M12 3v9" />
                    </svg>
                    <span className="text-blue-600 font-medium">Click to upload (PDF only)</span>
                    <input
                      type="file"
                      name="proof"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 border border-blue-400 rounded-lg bg-green-50">
                    <span className="text-blue-700 font-medium">{formData.proof.name}</span>
                    <button
                      type="button"
                      className="ml-4 text-red-500 hover:text-red-700 text-sm"
                      onClick={() => setFormData((prevData) => ({ ...prevData, proof: null }))}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedOption === "Minor" && (
            <div className="mb-4">
              <input
                type="text"
                name="minorCourseName"
                placeholder="Minor CourseName"
                value={formData.minorCourseName}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              />
              <select
                name="ElectiveExemptionRequired"
                value={formData.ElectiveExemptionRequired}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              >
                <option value="">Elective Exemption Required</option>
                <option value="4 semester">4 semester</option>
                <option value="5 semester ">5 semester </option>
                <option value="6 semester">6 semester</option>
                <option value="7 semester">7 semester</option>
              </select>
              <div className="mb-4 p-4 border rounded bg-gray-50">
                <label className="block font-semibold mb-2 text-gray-700">Upload Proof</label>

                {!formData.proof ? (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0-9l-3 3m3-3l3 3M12 3v9" />
                    </svg>
                    <span className="text-blue-600 font-medium">Click to upload (PDF only)</span>
                    <input
                      type="file"
                      name="proof"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 border border-blue-400 rounded-lg bg-green-50">
                    <span className="text-blue-700 font-medium">{formData.proof.name}</span>
                    <button
                      type="button"
                      className="ml-4 text-red-500 hover:text-red-700 text-sm"
                      onClick={() => setFormData((prevData) => ({ ...prevData, proof: null }))}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedOption === "Internship" && (
            <div className="mb-4">
              <input
                type="text"
                name="OrganizationDetails"
                placeholder="Organization Details"
                value={formData.OrganizationDetails}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              />

              <select
                name="ElectiveExemptionRequiredInternship"
                value={formData.ElectiveExemptionRequiredInternship}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              >
                <option value="">Elective Exemption Required</option>
                <option value="4 semester">4 semester</option>
                <option value="5 semester ">5 semester </option>
                <option value="6 semester">6 semester</option>
                <option value="7 semester">7 semester</option>
              </select>
              <input
                type="text"
                name="TrainingField"
                placeholder="Training Field"
                value={formData.TrainingField}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              />

              <input
                type="text"
                name="TrainingDuration"
                placeholder="Training Duration (in Months)"
                value={formData.TrainingDuration}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              />
              <input
                type="text"
                name="percentageofmarksobtained"
                placeholder="% of marks obtained"
                value={formData.percentageofmarksobtained}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
              />
             <div className="mb-4 p-4 border rounded bg-gray-50">
                <label className="block font-semibold mb-2 text-gray-700">Upload Proof</label>

                {!formData.proof ? (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0-9l-3 3m3-3l3 3M12 3v9" />
                    </svg>
                    <span className="text-blue-600 font-medium">Click to upload (PDF only)</span>
                    <input
                      type="file"
                      name="proof"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 border border-blue-400 rounded-lg bg-green-50">
                    <span className="text-blue-700 font-medium">{formData.proof.name}</span>
                    <button
                      type="button"
                      className="ml-4 text-red-500 hover:text-red-700 text-sm"
                      onClick={() => setFormData((prevData) => ({ ...prevData, proof: null }))}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedOption === "OneCredit Course" && (
            <>
              {[0, 1, 2].map((index) => {
                // Extract selected course names except the current index
                const selectedCourseNames = selectedCourses
                  .filter((_, i) => i !== index) // Exclude current index
                  .map((course) => course.courseName) // Extract selected course names

                return (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <label className="block font-semibold">Course {index + 1}</label>
                    <input
                      type="text"
                      placeholder="Course Code"
                      value={selectedCourses[index].courseCode}
                      onChange={(e) => handleCourseChange(index, "courseCode", e.target.value)}
                      className="p-2 border rounded w-full mb-2"
                    />

                    <select
                      value={selectedCourses[index].courseName}
                      onChange={(e) => handleCourseChange(index, "courseName", e.target.value)}
                      className="p-2 border rounded w-full mb-2"
                    >
                      <option value="">Select Course Name</option>
                      {allcompletedcoursenames
                        .filter((course) => !selectedCourseNames.includes(course.name)) // Exclude already selected courses
                        .map((course) => (
                          <option key={course._id} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                    </select>

                    <select
                      value={selectedCourses[index].semester}
                      onChange={(e) => handleCourseChange(index, "semester", e.target.value)}
                      className="p-2 border rounded w-full mb-2"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>

                    <select
                      value={selectedCourses[index].month}
                      onChange={(e) => handleCourseChange(index, "month", e.target.value)}
                      className="p-2 border rounded w-full mb-2"
                    >
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Year of Passing"
                      value={selectedCourses[index].year}
                      onChange={(e) => handleCourseChange(index, "year", e.target.value)}
                      className="p-2 border rounded w-full mb-2"
                    />
                  </div>
                );
              })}

              {/* ✅ Single File Upload for All Courses */}
              <div className="mb-4 p-4 border rounded bg-gray-50">
                <label className="block font-semibold mb-2 text-gray-700">Upload Proof</label>

                {!formData.proof ? (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0-9l-3 3m3-3l3 3M12 3v9" />
                    </svg>
                    <span className="text-blue-600 font-medium">Click to upload (PDF only)</span>
                    <input
                      type="file"
                      name="proof"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 border border-blue-400 rounded-lg bg-green-50">
                    <span className="text-blue-700 font-medium">{formData.proof.name}</span>
                    <button
                      type="button"
                      className="ml-4 text-red-500 hover:text-red-700 text-sm"
                      onClick={() => setFormData((prevData) => ({ ...prevData, proof: null }))}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Submit Request
          </button>
        </form>
      }

      {/* {responseMessage && (
        <p className="mt-4 text-sm text-green-600">{responseMessage}</p>
      )} */}
    </div>
  );

};
ElectiveExemption.propTypes = {
  totalCredits: PropTypes.number.isRequired,
  settotalcredits: PropTypes.func.isRequired,

};


export default ElectiveExemption;