import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";

const OnlineCourseDashboard = ({ totalCredits, settotalcredits }) => {
  const auth = getAuth();
  const [studentEmail, setStudentEmail] = useState("");
  const [student, setStudent] = useState({
    email: "",
    rollNo: "",
    studentId: "",
    studentName: ""
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    rollNo: "",
    email: "",
    exemptiveType: "",
    details: {
      OnlineCourseName: "",
      CourseTitle: "",
      courseDuration: "",
      percentageofmarksobtained: "",
      credits: "",
    },
    proof: null,
  });

  const fileInputRef = useRef(null);

  const validateFormData = (data) => {
    if (!data.studentId || !data.studentName || !data.rollNo || !data.email || !data.exemptiveType) {
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      studentId: student.studentId,
      studentName: student.studentName,
      rollNo: student.rollNo,
      email: student.email,
      exemptiveType: "Online Course",
      details: {
        OnlineCourseName: "",
        CourseTitle: "",
        courseDuration: "",
        percentageofmarksobtained: "",
        credits: "",
      },
      proof: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    try {
      const response = await fetch("https://onecredit-backend.onrender.com/api/exemptions", {
        method: "POST",
        body: requestData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Exemption request submitted successfully!");
        const requestId = result.requestId;
        setPendingRequests((prev) => [...prev, requestId]);
        resetForm();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("❌ Error submitting request:", error);
    }
  };

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
    localStorage.setItem("totalCredits", totalCredits);
  }, [totalCredits]);

  useEffect(() => {
    if (pendingRequests.length === 0) return;

    const interval = setInterval(async () => {
      for (const requestId of pendingRequests) {
        try {
          const res = await fetch(`https://onecredit-backend.onrender.com/api/exemptions/${requestId}`);
          const data = await res.json();

          if (data.status === "Approved by COE") {
            const credits = parseInt(data.details.credits || 0);
            settotalcredits((prev) => prev + credits);
            setPendingRequests((prev) => prev.filter((id) => id !== requestId));
            alert(`Request ${requestId} approved! ${credits} credit(s) added.`);
          }
        } catch (err) {
          console.error(`⚠️ Error checking status for ${requestId}:`, err);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pendingRequests,settotalcredits]); 

  useEffect(() => {
    if (studentEmail) {
      fetch(`https://onecredit-backend.onrender.com/api/registered-courses?email=${studentEmail}`)
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
          setFormData({
            exemptiveType: "Online Course"
          });
        })
        .catch((error) =>
          console.error("Error fetching registered courses:", error)
        );
    }
  }, [studentEmail]);

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
  }, [student]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        proof: files[0],
      }));
    } else if (
      ["OnlineCourseName", "CourseTitle", "courseDuration", "credits", "percentageofmarksobtained"].includes(name)
    ) {
      setFormData((prevData) => {
        const currentDetails =
          typeof prevData.details === "string"
            ? JSON.parse(prevData.details)
            : prevData.details || {};

        const updatedDetails = {
          ...currentDetails,
          [name]: value,
        };

        if (name === "courseDuration") {
          const creditMap = {
            "4 weeks": 1,
            "8 weeks": 2,
            "12 weeks": 3,
          };
          updatedDetails.credits = creditMap[value] || "";
        }

        return {
          ...prevData,
          details: updatedDetails,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const parsedDetails =
    typeof formData.details === "string"
      ? JSON.parse(formData.details)
      : formData.details || {};

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Submit Online Course</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="OnlineCourseName"
          placeholder="Course Offering Agency"
          value={parsedDetails.OnlineCourseName}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />

        <input
          type="text"
          name="CourseTitle"
          placeholder="Course Title"
          value={parsedDetails.CourseTitle}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />

        <select
          name="courseDuration"
          value={parsedDetails.courseDuration}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        >
          <option value="">--Select Course Duration--</option>
          <option value="4 weeks">4 Weeks</option>
          <option value="8 weeks">8 Weeks</option>
          <option value="12 weeks">12 Weeks</option>
        </select>

        <input
          type="text"
          name="credits"
          placeholder="Equivalent Credits"
          value={parsedDetails.credits}
          readOnly
          className="block w-full p-2 border rounded bg-gray-100"
        />

        <input
          type="text"
          name="percentageofmarksobtained"
          placeholder="% of Marks Obtained"
          value={parsedDetails.percentageofmarksobtained}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
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
                      onChange={handleChange}
                      ref={fileInputRef}
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

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

OnlineCourseDashboard.propTypes = {
  totalCredits: PropTypes.number.isRequired,
  settotalcredits: PropTypes.func.isRequired,
};

export default OnlineCourseDashboard;
