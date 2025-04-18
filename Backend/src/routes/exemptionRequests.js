const express = require("express");
const router = express.Router();
const ExemptionRequest = require("../models/ExemptionRequest");
//const { verifyToken } = require("../middleware/authMiddleware");

// Get all exemption requests
router.get("/", async (req, res) => {
  try {
    const requests = await ExemptionRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching exemption requests" });
  }
});

// Approve/Reject a request
router.put("/:id/:action",  async (req, res) => {
  try {
    const { id, action } = req.params;
    const { role } = req.body; // The role of the approver
    const request = await ExemptionRequest.findById(id);

    if (!request) return res.status(404).json({ error: "Request not found" });

    // Check if the approver is correct based on current status
    const roleApprovalStages = {
      "Pending": "HOD",
      "Approved by HOD, Waiting for Autonomy Affairs": "Autonomy Affairs",
      "Approved by Autonomy Affairs, Waiting for Head Academics": "Head Academics",
      "Approved by Head Academics, Waiting for COE": "COE"
    };

    if (roleApprovalStages[request.status] !== role) {
      return res.status(403).json({ error: "You are not authorized to approve this request" });
    }

    if (action === "approve") {
      // Move to the next approval stage
      const newStatus = getNextApprovalStage(request.status);
      request.status = newStatus;
    } else if (action === "reject") {
      request.status = `Rejected by ${role}`;
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await request.save();
    res.status(200).json({ message: `Request ${action}d successfully`, request });

  } catch (error) {
    res.status(500).json({ error: "Error processing request" });
  }
});

// Helper function to get the next approval stage
const getNextApprovalStage = (currentStatus) => {
  switch (currentStatus) {
    case "Pending":
      return "Approved by HOD, Waiting for Autonomy Affairs";
    case "Approved by HOD, Waiting for Autonomy Affairs":
      return "Approved by Autonomy Affairs, Waiting for Head Academics";
    case "Approved by Autonomy Affairs, Waiting for Head Academics":
      return "Approved by Head Academics, Waiting for COE";
    case "Approved by Head Academics, Waiting for COE":
      return "Approved by COE";
    default:
      return currentStatus;
  }
};

module.exports = router;
