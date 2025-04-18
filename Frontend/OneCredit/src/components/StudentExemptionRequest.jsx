import  { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const StudentExemptionRequest = ({ studentId }) => {
  const [exemptionRequests, setExemptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function updateExemptionStatus(exemptiveType, currentStatus) {
    if (exemptiveType === "Online Course" || exemptiveType === "Internship") {
      if (currentStatus.startsWith("Approved by")) {
        if (["Approved by HOD", "Approved by Autonomy Affairs", "Approved by Head Academics"].includes(currentStatus)) {
          return "Pending";
        } else {
          return "Approved";
        }
      } else if (currentStatus.startsWith("Rejected by")) {
        return "Rejected";
      } else {
        return "Pending";
      }
    } else if (exemptiveType === "OneCredit Course" || exemptiveType === "Honor"||exemptiveType==="Minor") {
      if (currentStatus === "Approved by HOD") {
        return "Approved";
      } else if (currentStatus.includes("Rejected by")) {
        return "Rejected";
      } else {
        return "Pending";
      }
    }
    return "Pending"; // Default fallback
  }


  useEffect(() => {
    const fetchExemptionRequests = async () => {
      try {
        if (studentId) {
          const response = await axios.get(
            `https://onecredit-backend.onrender.com/api/exemptions/student/${studentId}`
          );
          const updatedExemptions = response.data.map((request) => ({
            ...request,
            status: updateExemptionStatus(request.exemptiveType, request.status),
          }));
          setExemptionRequests(updatedExemptions);
       
        }
      } catch (err) {
        setError("Failed to fetch exemption requests. Please try again later.");
        console.error("Error fetching exemption requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExemptionRequests();
  }, [studentId]);
  console.log(exemptionRequests)

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-indigo-900 mb-4 border-b pb-2">
        Exemption Requests
      </h3>
      {loading ? (
        <p>Loading exemption requests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : exemptionRequests.length === 0 ? (
        <p>No exemption requests found.</p>
      ) : (
        <ul>
          {exemptionRequests.map((request) => (
            <li
              key={request._id}
              className="mb-4 p-4 border rounded-md shadow-sm bg-gray-50"
            >
              <h4 className="font-bold text-gray-800">
                Exemptive Type: {request.exemptiveType}   
              </h4>
              <p className="text-gray-600">
                Status:{" "}
                <span
                  className={
                    request.status === "Approved"
                      ? "text-green-500 font-semibold"
                      : request.status === "Rejected"
                      ? "text-red-500 font-semibold"
                      : "text-yellow-500 font-semibold"
                  }
                >
                  {request.status}
                </span>
              </p>
              {request.status === "Rejected" && (
  <p className="text-gray-500 text-sm mt-1">
    Reason: {request.rejectionReason || "No reason provided"}
  </p>
)}
             
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

StudentExemptionRequest.propTypes = {
  studentId: PropTypes.string.isRequired,
};

export default StudentExemptionRequest;
