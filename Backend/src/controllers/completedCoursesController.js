const AttendanceMarks = require('../models/attendance_marks');

const getCompletedCourses = async (req, res) => {
  try {
    const completedCourses = await AttendanceMarks.aggregate([
      {
        $match: { completed_status: "yes" },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $project: {
          courseId: 1,
          completed_status: 1,
          updatedAt: 1,
          courseName: "$courseDetails.courseName",
        },
      },
    ]);

    res.json(completedCourses);
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCompletedCourses };
