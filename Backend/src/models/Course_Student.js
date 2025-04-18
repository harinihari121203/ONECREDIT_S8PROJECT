
const mongoose = require("mongoose");

const courseEnrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completedStatus: { type: String, enum: ["yes", "no"], default: "no" }
  
});

module.exports = mongoose.model("CourseEnrollment", courseEnrollmentSchema);
