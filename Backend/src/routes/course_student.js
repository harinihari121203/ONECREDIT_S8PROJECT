// // routes/courses.js
// const express = require("express");
// const router = express.Router();
// const Course = require("../models/addnewcourse");
// const CourseEnrollment = require("../models/Course_Student");

// // Get courses with enrolled students and completion status
// router.get("/api/trainer-courses", async (req, res) => {
//   try {
//     const trainerEmail = req.query.email;
//     if (!trainerEmail) {
//       return res.status(400).json({ error: "Trainer email is required" });
//     }

//     // Fetch all courses (Optionally filter by trainer if needed)
//     const courses = await Course.find().lean();

//     // Fetch enrolled students and completion status using CourseEnrollment
//     const courseIds = courses.map(course => course._id);
//     const enrollmentData = await CourseEnrollment.find({ courseId: { $in: courseIds } })
//     .populate({
//         path: "studentId",
//         match: { role: "student" }, // Ensures only students are fetched
//         select: "name email role" // Fetch only needed fields
//       })
//       .lean();

//     // Map students to the respective courses
//     const courseStudentsMap = enrollmentData.reduce((acc, record) => {
//         const { courseId, studentId, completedStatus } = record;
//         if (studentId) { // Check if student exists and has role 'student'
//           if (!acc[courseId]) {
//             acc[courseId] = [];
//           }
//           acc[courseId].push({ ...studentId, completedStatus });
//         }
//         return acc;
//       }, {});

//     // Append students to their courses
//     const coursesWithStudents = courses.map(course => ({
//       ...course,
//       students: courseStudentsMap[course._id] || []
//     }));

//     res.json(coursesWithStudents);

//   } catch (error) {
//     console.error("Error fetching trainer courses:", error);
//     res.status(500).json({ error: "Failed to fetch courses" });
//   }
// });

// module.exports = router;
