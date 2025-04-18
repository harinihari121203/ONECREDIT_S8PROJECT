const mongoose = require("mongoose"); 


const MaterialSchema = new mongoose.Schema({
  id: { type: String, required: true }, // unique identifier for material
  title: { type: String, required: true },
  //description: { type: String, default: "" },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const NewCourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required:true},
  field: { 
    type: String,
    required: true,
    enum: ["Frontend", "Backend", "FullStack", "DevOps", "AI", "DataScience"]
  }, // new attribute for course categorization
  description:{type:String,required:true},
  //eligible_departments: { type: [String], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  materials: { type: [MaterialSchema], default: [] }, // new field for materials
  
});

module.exports = mongoose.model("Course", NewCourseSchema);
