const mongoose = require('mongoose');

const hodSchema = new mongoose.Schema({
  hod_id: {
    type: Number,
    required: true,
    unique: true
  },
  hod_name: {
    type: String,
    required: true
  },
  hod_dept: {
    type: String,
    required: true
  },
  hod_emailID: {
    type: String,
    required: true,
    unique: true
  },

  role: { type: String, default:'HOD',required: true }, 
  
  isActive: {
    type: Boolean,
    default: true 
  }
});

const HOD_Details = mongoose.model('HOD', hodSchema); 
module.exports = HOD_Details;
