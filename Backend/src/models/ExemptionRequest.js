const mongoose = require('mongoose');

const exemptionRequestSchema = new mongoose.Schema({
    //requestId: { type: String },
    studentId: { type: String, required: true }, 
    studentName: { type: String, required: true },
    rollNo: { type: String, required: true },
    email: { type: String, required: true },
    exemptiveType: { 
        type: String, 
        enum: ['Online Course', 'OneCredit Course', 'Internship', 'Honor', 'Minor','Online Course Exemption'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved by HOD', 'Approved by Autonomy Affairs', 'Approved by Head Academics', 'Approved by COE', 'Rejected by HOD','Rejected by Autonomy Affairs','Rejected by Head Academics','Rejected by COE','Waiting for COE Approval'], 
        default: 'Pending' 
    },
    rejectionReason: { type: String, default: '' },
    appliedDate: { type: Date, default: Date.now },

    // Store varying details in a nested object 
    details: { type: mongoose.Schema.Types.Mixed, required: true },
    
    proof: { type: String, default: "" }  
});

module.exports = mongoose.model('ExemptionRequest', exemptionRequestSchema); 

