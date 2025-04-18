const mongoose = require("mongoose");

const ExemptiveLimitSchema = new mongoose.Schema({
  exemptiveType: {
    type: String,
    required: true,
    enum: ["OneCredit Course","Honor","Minor","Internship","Online Course Exemption"]
  },
  limit: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("ExemptiveLimit", ExemptiveLimitSchema);