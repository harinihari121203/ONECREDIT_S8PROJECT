const mongoose = require("mongoose");
const Registration = require("./registration"); // Import Registration model

const attendanceMarksSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: String, // Changed to String to match UID format
      required: true,
    },
    rollNo: {
      type: String,
      required: false, // Auto-populated from Registration schema
    },
    attendance: {
      day1: {
        FN1: { type: String, enum: ["present", "absent"], default: "absent" },
        AN1: { type: String, enum: ["present", "absent"], default: "absent" },
      },
      day2: {
        FN2: { type: String, enum: ["present", "absent"], default: "absent" },
        AN2: { type: String, enum: ["present", "absent"], default: "absent" },
      },
    },
    marks: {
      type: Number,
      min: 0,
      max: 100,
      default: null, // Marks are initially empty
    },
    completed_status: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate records for the same courseId, rollNo, and studentId
attendanceMarksSchema.index({ courseId: 1, rollNo: 1, studentId: 1 }, { unique: true });

// Middleware to fetch `rollNo` and `uid` from registered_courses when attendance is submitted
attendanceMarksSchema.pre("save", async function (next) {
  try {
    // Fetch rollNo and uid (studentId) from registered_courses if not already set
    // if (!this.rollNo || !this.studentId) {
    //   const registration = await Registration.findOne({
    //     courseId: this.courseId,
    //     uid: this.studentId,
    //   });

    //   if (registration) {
    //     this.rollNo = registration.rollNo;
    //     this.studentId = registration.uid; // Correctly set uid as studentId
    //     console.log(`Fetched rollNo: ${this.rollNo}, uid: ${this.studentId}`);
    //   } else {
    //     console.warn(
    //       "No matching registration found for courseId:",
    //       this.courseId
    //     );
    //     return next(new Error("Registration not found for the provided courseId and uid"));
    //   }
    // }

    // Automatically update completed_status and isCompleted based on marks
    if (this.marks !== null && !isNaN(this.marks)) {
      this.completed_status = "yes";
    }
    
    
    //   // Update the 'isCompleted' field in the registered_courses collection
    //   const updatedRegistration = await Registration.findOneAndUpdate(
    //     { uid: this.studentId },
        
    //     { $set: { isCompleted: "yes" } }, // Use $set to ensure the update is applied
    //     { new: true, runValidators: true }
    //   );
    //   console.log(this.studentId);
    //   console.log(updatedRegistration)

    //   if (updatedRegistration) {
    //     console.log(
    //       `Updated isCompleted to "yes" for rollNo: ${this.rollNo} in registered_courses`
    //     );
    //   } else {
    //     console.warn(
    //       "No registration found to update isCompleted for rollNo:",
    //       this.rollNo
    //     );
    //   }
    // } 
    // 
    else {
      this.completed_status = "no";
    }

    next();
  } catch (error) {
    console.error(
      "Error updating attendance marks or registration status:",
      error
    );
    next(error);
  }
});


const AttendanceMarks = mongoose.model("AttendanceMarks", attendanceMarksSchema);

module.exports = AttendanceMarks;
