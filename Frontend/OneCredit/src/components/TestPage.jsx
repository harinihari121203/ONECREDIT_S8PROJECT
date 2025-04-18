// TestPage.jsx
//import React from "react";
//import "./debug.css"; // We'll create a debug.css file to hold the global outlines

import TrainerAttendanceMarks from "./TrainerAttendanceMarks";

export default function TestPage() {
  return (
    <div className="bg-gray-100 min-h-screen w-full flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <TrainerAttendanceMarks trainerEmail="test@domain.com" />
    </div>
  );
}
