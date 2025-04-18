const express = require('express');
const router = express.Router();
const { getCompletedCourses } = require('../controllers/completedCoursesController');

// Define the route to get completed courses
router.get('/completed-courses', getCompletedCourses);

module.exports = router;
