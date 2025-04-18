const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  expertise: { type: String, required: true },
  selectedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  role: { type: String, default:'trainer',required: true }, 
});

const Trainer = mongoose.model("Trainer", TrainerSchema);

module.exports = Trainer;