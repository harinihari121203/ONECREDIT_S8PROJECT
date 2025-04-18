import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdditionalHOD=()=>{
    const [hods, setHods] = useState([]);
      const nav=useNavigate()
     
    
      // Fetch HODs from the API
      useEffect(() => {
        fetch("http://localhost:8080/api/hods")
          .then((res) => res.json())
          .then((data) => {
            console.log("HODs API Response:", data);
            if (Array.isArray(data)) setHods(data);
          })
          .catch((err) => console.error("Error fetching HODs:", err));
      }, []);
    
      // Toggle Active/Inactive Status
      const toggleStatus = async (id, currentStatus) => {
        const updatedStatus = !currentStatus;
        try {
          await fetch(`http://localhost:8080/api/hods/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: updatedStatus }),
          });
          
          // Update UI
          setHods(hods.map(hod => (hod._id === id ?
             { ...hod, isActive: updatedStatus } : hod)));
        } catch (err) {
          console.error("Error updating status:", err);
        }
      };

    return(
        <div>
      {/* Button to add a new HOD */}
      <Link to="/admin-dashboard/add-hod">
      <button onClick={()=>{nav('add-hod')}}className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Add New HOD
      </button>
    </Link>


    {/* HOD List */}
    <ul className="mt-2 space-y-2">
      {hods.length > 0 ? (
        hods.map((hod) => (
          <li key={hod._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
            <div>
              <p className="text-md font-semibold">{hod.hod_name}</p>
              <p className="text-sm text-gray-600">{hod.hod_emailID}</p>
              <p className={`text-sm font-semibold ${hod.isActive ? "text-green-600" : "text-red-600"}`}>
                {hod.isActive ? "Active" : "Inactive"}
              </p>
            </div>
           
            <button
              onClick={() => toggleStatus(hod._id, hod.isActive)}
              className={`px-4 py-2 rounded-md text-white ${
                hod.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {hod.isActive ? "Make Inactive" : "Make Active"}
            </button>
          </li>
        ))
      ) : (
        <p className="text-sm text-gray-500">No available HODs</p>
      )}
    </ul>
  </div>
    )
}
export default  AdditionalHOD;