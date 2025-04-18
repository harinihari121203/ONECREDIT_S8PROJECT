const express = require("express");
const router = express.Router();
const Course = require("../models/addnewcourse.js");

// GET /api/recommend-courses?field=Devops
router.get("/recommend-courses", async (req, res) => {
  const { field } = req.query;
  
  if (!field) {
    return res.status(400).json({ message: "Field parameter is required" });
  }
  
  try {
    // Use a case-insensitive regex to match the field value
    const courses = await Course.find({
      field: { $regex: new RegExp(`^${field}$`, "i") }
    });
    
    res.json(courses);
  } catch (error) {
    console.error("Error fetching recommended courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
