import { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import axios from "axios";

const ExemptionDashboard = () => {
  const [exemptionRequests, setExemptionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        let storedRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

        if (storedRole) {
          setUserRole(storedRole);
        } else {
          const response = await axios.post("http://localhost:8080/api/protected", {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });

          if (response.data.role) {
            setUserRole(response.data.role);
            console.log(response.data.role)
            localStorage.setItem("userRole", response.data.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error.response?.data || error.message);
      }
    };

    fetchUserRole();
  }, []);

  const fetchExemptionRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:8080/api/exemptionsbyRole", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Requests:", response.data);
      setExemptionRequests(response.data);
    } catch (error) {
      console.error("Error fetching exemption requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExemptionRequests();
  }, [userRole]); // Runs when userRole changes


  const handleDecision = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      let payload = {};

      if (action === "reject") {
        const rejectionReason = prompt("Please enter the reason for rejection:");
  
        if (!rejectionReason) {
          alert("Rejection reason is required.");
          return;
        }
  
        payload = { rejectionReason };
      }

      await axios.put(
        `http://localhost:8080/api/exemptions/${requestId}/${action}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Request ${action}ed successfully!`);

      // Close the extra details box by clearing the selectedRequest
      setSelectedRequest(null);

      fetchExemptionRequests();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Elective Exemption Requests</h2>
      {loading ? (
        <p>Loading exemption requests...</p>
      ) : exemptionRequests.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Roll No</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Exemptive Type</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exemptionRequests.map((request, index) => (
              <tr key={request._id || index} className="border">
                <td className="border p-2">{request.studentName}</td>
                <td className="border p-2">{request.rollNo}</td>
                <td className="border p-2">{request.email}</td>
                <td className="border p-2">{request.exemptiveType || "NA"}</td>
                <td className={`border p-2 ${request.status.includes("Rejected") ? "text-red-500" : "text-green-500"}`}>
                  {userRole === 'Autonomy Affairs' || userRole === 'Head Academics' || userRole === 'COE' ? 'Pending' : request.status}

                </td>
                <td className="border p-2 text-center flex justify-center gap-3">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => setSelectedRequest(request)}>
                    <FaEye size={20} />
                  </button>
                  {(request.status === "Approved by HOD" || request.status === "Approved by Autonomy Affairs" || request.status === "Approved by Head Academics" || request.status === "Waiting for COE Approval" || request.status === "Pending") && (
                    <>
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded"
                        onClick={() => handleDecision(request._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => handleDecision(request._id, "reject")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No exemption requests found.</p>
      )}

      {selectedRequest && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">
            Extra Details for {selectedRequest.studentName}
          </h3>

          {selectedRequest.details ? (
            (() => {
              const parsedDetails =
                typeof selectedRequest.details === "string"
                  ? JSON.parse(selectedRequest.details)
                  : selectedRequest.details;

              return selectedRequest.exemptiveType === "Online Course" ? (
                <div>
                  <p><strong>Course Offering Agency:</strong> {parsedDetails.OnlineCourseName || "N/A"}</p>
                  {parsedDetails.ElectiveExemptionRequired && (
                    <p><strong>Elective Exemption Required:</strong> {parsedDetails.ElectiveExemptionRequired}</p>
                  )}
                  {parsedDetails.ElectiveExemptionOptfor && (
                    <p><strong>Elective Exemption Opt for:</strong> {parsedDetails.ElectiveExemptionOptfor || "N/A"}</p>
                  )}
                  <p><strong>Course Title:</strong> {parsedDetails.CourseTitle || "N/A"}</p>
                  <p><strong>Course Duration:</strong> {parsedDetails.courseDuration || "N/A"}</p>
                  <p><strong>% of Marks Obtained:</strong> {parsedDetails.percentageofmarksobtained || "N/A"}</p>
                  {/* <p><strong>Equivalent Credits:</strong> {parsedDetails.EquivalentCredits || "N/A"}</p> */}
                  <p>
                    <strong>Proof:</strong>
                    {console.log(selectedRequest.proof)}
                    <a href={selectedRequest.proof}  // ✅ Use it as-is
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View File
                    </a>
                  </p>
                </div>

              ) : selectedRequest.exemptiveType === "Online Course Exemption" ? (
                <div>
                  <p><strong>Course Offering Agency:</strong> {parsedDetails.OnlineCourseName || "N/A"}</p>
                  {parsedDetails.ElectiveExemptionRequired && (
                    <p><strong>Elective Exemption Required:</strong> {parsedDetails.ElectiveExemptionRequired}</p>
                  )}
                  {parsedDetails.ElectiveExemptionOptfor && (
                    <p><strong>Elective Exemption Opt for:</strong> {parsedDetails.ElectiveExemptionOptfor || "N/A"}</p>
                  )}
                </div>


              ) : selectedRequest.exemptiveType === "Internship" ? (
                <div>
                  <p><strong>OrganizationDetails:</strong> {parsedDetails.OrganizationDetails || "N/A"}</p>
                  <p><strong>ElectiveExemptionRequiredInternship:</strong> {parsedDetails.ElectiveExemptionRequiredInternship || "N/A"}</p>
                  <p><strong>TrainingField:</strong> {parsedDetails.TrainingField || "N/A"}</p>
                  <p><strong>TrainingDuration:</strong> {parsedDetails.TrainingDuration || "N/A"}</p>
                  <p><strong>PercentageOfMarksObtained:</strong> {parsedDetails.percentageofmarksobtained || "N/A"}</p>
                  <p>
                    <strong>Proof:</strong>
                    {console.log(selectedRequest.proof)}
                    <a href={selectedRequest.proof}  // ✅ Use it as-is
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View File
                    </a>

                  </p>
                </div>


              ) : selectedRequest.exemptiveType === "OneCredit Course" ? (
                <div>
                  {parsedDetails.courses && parsedDetails.courses.length > 0 ? (
                    parsedDetails.courses.map((course, index) => (
                      <div key={index} className="mb-4 p-4 border rounded bg-white">
                        <h4 className="text-md font-semibold mb-2">
                          Course {index + 1}
                        </h4>
                        <p><strong>Course Code:</strong> {course.courseCode || "N/A"}</p>
                        <p><strong>Course Name:</strong> {course.courseName || "N/A"}</p>
                        <p><strong>Semester:</strong> {course.semester || "N/A"}</p>
                        <p><strong>Month:</strong> {course.month || "N/A"}</p>
                        <p><strong>Year of Passing:</strong> {course.year || "N/A"}</p>
                      </div>
                    ))
                  ) : (
                    <p>No course details available.</p>
                  )}

                  {/* Display the proof file link outside the loop, as it's a single file */}
                  {selectedRequest.proof && (
                    <p>
                      <strong>Proof:</strong>{" "}
                      <a
                        href={selectedRequest.proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View File
                      </a>
                    </p>
                  )}
                </div>

              ) : selectedRequest.exemptiveType === "Minor" ? (
                <div>
                  <p><strong>Minor CourseName:</strong> {parsedDetails.minorCourseName || "N/A"}</p>
                  <p><strong>ElectiveExemptionRequired:</strong> {parsedDetails.ElectiveExemptionRequired || "N/A"}</p>
                  <p>
                    <strong>Proof:</strong>
                    {console.log(selectedRequest.proof)}
                    <a href={selectedRequest.proof}  // ✅ Use it as-is
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View File
                    </a>

                  </p>
                </div>
              ): selectedRequest.exemptiveType === "Honor" ? (
                  <div>
                    <p><strong>Honor CourseName:</strong> {parsedDetails.honorCourseName || "N/A"}</p>
                    <p><strong>ElectiveExemptionRequired:</strong> {parsedDetails.ElectiveExemptionRequired || "N/A"}</p>
                    <p>
                      <strong>Proof:</strong>
                      {console.log(selectedRequest.proof)}
                      <a href={selectedRequest.proof}  // ✅ Use it as-is
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View File
                      </a>

                    </p>
                  </div>
                ) : (
                  <p>No exemption details available.</p>
                );

            })()
          ) : (
            <p>Loading details...</p>
          )}

          <button
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => setSelectedRequest(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ExemptionDashboard;
