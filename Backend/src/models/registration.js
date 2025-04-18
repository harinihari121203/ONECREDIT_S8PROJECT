const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  email: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  semester: { type: String, required: true },
  department: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseTitle: { type: String, required: true },
  registeredDate: {
    type: Date,
    default: Date.now  // Automatically set to current date when registering
  },
  status: {
    type: String,
    enum: ['registered', 'completed'], // Allowed values
    default: 'registered',             // Default value 
    required: true 
  },
  isCompleted:
  {
    type: String,
    enum:['yes','no'],
    default:'no',
    required:true
  },
  uid: { type: String, required: true } // Add uid reference here
}); 

module.exports = mongoose.model('Registration', registrationSchema, 'registered_courses');
