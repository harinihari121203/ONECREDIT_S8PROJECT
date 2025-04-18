import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TrainerAttendanceMarks = ({ trainerEmail }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [marks, setMarks] = useState({});
  const [completedStatus, setCompletedStatus] = useState({});
  const [remarks, setRemarks] = useState({});

  // Fetch courses handled by the trainer
  useEffect(() => {
    if (trainerEmail) {
      fetch(`https://onecredit-backend.onrender.com/api/trainer-courses?email=${trainerEmail}`)
        .then((response) => response.json())
        .then((data) => setCourses(data))
        .catch((error) => console.error("Error fetching trainer courses:", error));
    }
  }, [trainerEmail]);

  // Fetch students when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      fetch(`https://onecredit-backend.onrender.com/api/course-students?courseId=${selectedCourseId}`)
        .then((response) => response.json())
        .then((data) => {
          setStudents(data);
          setAttendance({});
          setMarks({});
          setCompletedStatus({});
          setRemarks({});
        })
        .catch((error) => console.error("Error fetching students:", error));
    }
  }, [selectedCourseId]);

  // Handle attendance change
  const handleAttendanceChange = (studentId, day, session, value) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [day]: {
          ...prev[studentId]?.[day],
          [session]: value,
        },
      },
    }));
  };

  // Handle marks change
  const handleMarksChange = (studentId, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));

    // Update completed status when marks are entered
    setCompletedStatus((prev) => ({
      ...prev,
      [studentId]: value >= 50 ? "Yes" : "No",
    }));
  };

  // Handle remarks change
  const handleRemarksChange = (studentId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  // Submit attendance and marks
const handleSubmitAttendanceAndMarks = async () => {
  try {
    const updates = students.map((student) => ({
      courseId: selectedCourseId,
      studentId: student.uid, // ✅ Use uid instead of _id
     // rollNo: student.rollNo,  // Optional, since rollNo is auto-populated in the schema
      attendance: attendance[student._id] || {}, // Updated to match the uid
      marks: marks[student._id] || 0,
      completed_status: completedStatus[student._id] || "no",
      remarks: remarks[student._id] || "",
    }));

    const response = await fetch("https://onecredit-backend.onrender.com/api/submit-attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      alert("Attendance and marks submitted successfully!");
    } else {
      alert("Failed to submit attendance and marks.");
    }
  } catch (error) {
    console.error("Error submitting attendance and marks:", error);
    alert("An error occurred while submitting data.");
  }
};


  return (
<div style={{ margin: 0, padding: 0 }}>
  {/* Header */}
  <header className="p-4">
    <h2 className="text-3xl font-semibold text-gray-800">
      Attendance & Marks
    </h2>
  </header>

  {/* Main Content */}
  <main style={{ margin: 0, padding: 0 }}>
    {/* Course Selector */}
    <div className="mb-6 w-full max-w-xl">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Select a Course
      </label>
      <select
        className="w-full p-3 border rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSelectedCourseId(e.target.value)}
        value={selectedCourseId}
      >
        <option value="">-- Select Course --</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.name}
          </option>
        ))}
      </select>
    </div>

    {/* Students Table */}
    {selectedCourseId && students.length > 0 ? (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Students in Selected Course
        </h3>
        {/* Table Container */}
        <div className="table-container overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-3 py-2 text-left">
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm">Student</span>
                    <span className="font-bold text-sm">Name</span>
                  </div>
                </th>
                <th className="px-3 py-2 text-left">
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm">Roll</span>
                    <span className="font-bold text-sm">No</span>
                  </div>
                </th>
                <th className="px-3 py-2 text-left">
                  <span className="font-bold text-sm">Email</span>
                </th>
                <th className="px-3 py-2 text-left">
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm">Year</span>
                  </div>
                </th>
                <th className="px-3 py-2 text-left">
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm">Sem</span>
                  </div>
                </th>
                <th className="px-3 py-2 text-left">
                  <div className="flex flex-col items-start">
                    
                    <span className="font-bold text-sm">Dept</span>
                  </div>
                </th>
                {["FN1", "AN1", "FN2", "AN2"].map((session, index) => (
                  <th key={index} className="px-3 py-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-sm">{`Day ${
                        Math.floor(index / 2) + 1
                      }`}</span>
                      <span className="text-xs text-gray-300">({session})</span>
                    </div>
                  </th>
                ))}
                <th className="px-3 py-2 text-center">
                  <span className="font-bold text-sm">Marks</span>
                </th>
                <th className="px-3 py-2 text-left">
                  <span className="font-bold text-sm">Remarks</span>
                </th>
                <th className="px-3 py-2 text-center">
                  <span className="font-bold text-sm">Status</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-3 py-3 truncate max-w-[150px]">
                    {student.name}
                  </td>
                  <td className="px-3 py-3 truncate max-w-[150px]">
                    {student.rollNo}
                  </td>
                  <td
                    className="px-3 py-3 truncate max-w-[150px]"
                    title={student.email}
                  >
                    {student.email}
                  </td>
                  <td className="px-3 py-3 truncate max-w-[150px]">
                    {student.yearOfStudy}
                  </td>
                  <td className="px-3 py-3 truncate max-w-[150px]">
                    {student.semester}
                  </td>
                  <td className="px-3 py-3 truncate max-w-[150px]">
                    {student.department}
                  </td>
                  {["FN1", "AN1", "FN2", "AN2"].map((session, index) => (
                    <td
                      key={`${student._id}-${session}`}
                      className="px-3 py-3 text-center"
                    >
                      <select
                        className="p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={
                          attendance?.[student._id]?.[
                            `day${Math.floor(index / 2) + 1}`
                          ]?.[session] || "absent"
                        }
                        onChange={(e) =>
                          handleAttendanceChange(
                            student._id,
                            `day${Math.floor(index / 2) + 1}`,
                            session,
                            e.target.value
                          )
                        }
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      value={marks[student._id] || ""}
                      onChange={(e) =>
                        handleMarksChange(student._id, e.target.value)
                      }
                      min="0"
                      max="100"
                      className="p-2 border rounded-lg shadow-sm w-20 text-center focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={remarks[student._id] || ""}
                      onChange={(e) =>
                        handleRemarksChange(student._id, e.target.value)
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    {completedStatus[student._id] || "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <button
          className="mt-6 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
          onClick={handleSubmitAttendanceAndMarks}
        >
          Submit Attendance & Marks
        </button>
      </div>
    ) : selectedCourseId ? (
      <p className="text-gray-600 mt-4">No students enrolled in this course.</p>
    ) : null}
  </main>
</div>
  );
};

TrainerAttendanceMarks.propTypes = {
  trainerEmail: PropTypes.string,
};

export default TrainerAttendanceMarks;