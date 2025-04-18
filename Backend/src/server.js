const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const authRoute = require("./routes/authRoutes");
//const authMiddleware=require("./middlewares/authMiddleware");
//const cookieSession = require("cookie-session");
const session = require("express-session");
const passportStrategy = require('./routes/passport');
const connectDB = require('./config/db');
const itemModel = require('./models/Item');
const bodyParser = require("body-parser");
const admin = require("./firebase");
const User = require("./models/BaseUser");
const Course = require("./models/addnewcourse");
const Registration = require("./models/registration");
const Trainer = require("./models/trainer");
const AttendanceMarks = require('./models/attendance_marks');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const courseRoutes = require("./routes/courseRoutes");
const course_student = require("./routes/course_student");
const completedCoursesRoutes = require('./routes/completedCoursesRoutes');
const exemption = require("./routes/exemptionRequests");
const HOD_Details = require('./models/hodSchema');
const ExemptionRequest = require("./models/ExemptionRequest");
const ExemptiveLimit=require("./models/exemptivetypelimit")
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerJSDocs = swaggerJsDoc(swaggerOptions);


dotenv.config();

const app = express();




app.use(express.json());
app.use(bodyParser.json());
app.use(cors()); // Fix CORS issues
app.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerJSDocs))
app.use(express.urlencoded({ extended: true }));

connectDB();


// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );

// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key',  
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }  // Set true only if using HTTPS
// }));

// app.use(passport.initialize());
// app.use(passport.session());


// const admin = require("firebase-admin"); // Assuming you have Firebase Admin SDK initialized
// const User = require("./models/BaseUser"); // Import your user model

async function verifyToken(req, res, next) {
  console.log("Headers received:", req.headers); // Debugging
  let idToken = req.headers.authorization;
  console.log(idToken)

  if (!idToken) {
    console.error("No token provided");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  } 

  try {
    console.log("Received Token:", idToken); // Debugging
    if (idToken.startsWith("Bearer ")) {
      idToken = idToken.split(" ")[1];
    }
    console.log("hi")
  
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded Token:", decodedToken); // Check if token is valid

    const { uid, name, email, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      // Assign roles based on email
      let role = "";

      if (email === "12159.sushmithav@gmail.com") {  // Replace with actual admin email 
        role = "admin";
      } 
      
      else if ( email === "harinihari121203@gmail.com") {  
        role = "HOD";
      }
      else if (email === "jpushpam44@gmail.com" || email ==="autonomyaffairs@bitsathy.ac.in") {
        role = "Autonomy Affairs";
      }
      else if (email === "sushmi755@gmail.com" || email === "headacademics@bitsathy.ac.in") {
        role = "Head Academics";
      }
      else if (email === "harinivedha1409@gmail.com" || email === "coe@bitsathy.ac.in") {
        role = "COE";
      }
      else if (email.endsWith("@bitsathy.ac.in")) {
        role = "student";
      }
      else {
        // Check if the user is a trainer
        const trainer = await Trainer.findOne({ email, role: "trainer" });
        if (trainer) {
          role = "trainer";
        } else {
          return res.status(403).json({ error: "Access Denied: Unauthorized user" });
        }
      }   

        // Log the assigned role
        console.log(`Assigned role: ${role} for email: ${email}`);

      // Save new user with assigned role
      user = new User({ uid, name, email, picture, role });
      await user.save();
      
    }
    else {
      console.log(`Existing user role: ${user.role}`); 
    }

    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

// Protected Route: Sends role back to frontend for redirection
app.post("/api/protected", verifyToken, async (req, res) => {
  let userRole = req.user.role; // Default role from token

 

  res.json({
    uid: req.user.uid,
    name: req.user.name,
    email: req.user.email,
    picture: req.user.picture,
    role: userRole, // Send updated role 
  });
});

app.get("/api/userRole",verifyToken, async (req, res) => {
   console.log("Hi")
  try {
    const user = await User.findOne({ email: req.user.email }); // Find user by email
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ role: user.role }); // Send role
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Server error" });
  }
}); 

//Routes
app.use("/auth", authRoute);

app.use("/api", courseRoutes);

// Use the completed courses routes
app.use('/api', completedCoursesRoutes);

app.use('/api', exemption); 




app.get('/', async (req, res) => {
  try {
    const response = await itemModel.find();
    return res.json({ items: response });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get courses based on department
// app.get("/api/courses", async (req, res) => {
//   try {
//     // Define departments as an array
//     const departments = ['CSE', 'IT', 'CSBS', 'AIDS', 'AIML','ME'];

//     if (!departments.length) {
//       console.log("No departments provided. Returning empty list.");
//       return res.json([]); // Instead of error, return empty list
//     }

//     console.log("Requested Departments:", departments);
//     const courses = await Course.find({ eligible_departments: { $in: departments } });

//     console.log("Courses found:", courses);
//     res.json(courses);
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     res.status(500).json({ error: "Failed to fetch courses" });
//   }
// });

app.get("/api/courses", async (req, res) => {
  try {
    // Fetch all courses without any filtering
    const courses = await Course.find({});

    console.log("All courses found:", courses);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});




// ✅ Define API Route for Adding Trainers
app.post("/api/trainers", async (req, res) => {
  try {
    const { name, email, expertise, selectedCourses } = req.body;

    if (!name || !email || !expertise || selectedCourses.length === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newTrainer = new Trainer({ name, email, expertise, selectedCourses });
    await newTrainer.save();

    res.status(201).json({ message: "Trainer added successfully" });

  } catch (error) {
    console.error("Error adding trainer:", error);
    res.status(500).json({ error: "Failed to add trainer" });
  }
});

// ✅ Define API Route for Fetching Trainers
app.get("/api/trainers", async (req, res) => {
  try {
    const trainers = await Trainer.find(); // Fetch all trainers from the database
    res.status(200).json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
});

// API to Fetch Trainers
app.get("/api/trainers", async (req, res) => {
  try {
    const trainers = await Trainer.find({}, "name role");
    res.json({ trainers });
  } catch (err) {
    console.error("Error fetching trainers:", err);
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
});

// Route to fetch all HODs
app.get('/api/hods', async (req, res) => {
  try {
    const hods = await HOD_Details.find(); // Fetch all HOD records
    res.status(200).json(hods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching HODs", error });
  }
});

// Route to add a new HOD
app.post('/api/hods', async (req, res) => {
  try {
    const { hod_name, hod_dept, hod_emailID } = req.body;

    // Check if HOD with the same email already exists
    const existingHOD = await HOD_Details.findOne({ hod_emailID });
    if (existingHOD) {
      return res.status(400).json({ message: "HOD with this email already exists" });
    }

    // Get the last HOD ID and increment it
    const lastHOD = await HOD_Details.findOne().sort({ hod_id: -1 });
    const nextHodId = lastHOD ? parseInt(lastHOD.hod_id) + 1 : 1; // Start from 1 if no records exist

    // Create new HOD
    const newHOD = new HOD_Details({
      hod_id: nextHodId.toString(), // Ensure consistency (string format)
      hod_name,
      hod_dept,
      hod_emailID,
      isActive: true // Default value is true
    });

    // Save to database
    await newHOD.save();
    res.status(201).json({ message: "HOD added successfully", hod: newHOD });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error adding HOD", error });
  }
});
app.put("/api/hods/:id/status", async (req, res) => {
  try {
    const { id } = req.params;


    const { isActive } = req.body; // Get the new status from request body

    // Check if isActive is a boolean
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "Invalid status value. Must be true or false." });
    }

    // Find and update the HOD status
    const updatedHOD = await HOD_Details.findByIdAndUpdate(
      id,
      { isActive },
      { new: true } // Returns the updated document
    );

    // If HOD not found, return error
    if (!updatedHOD) {
      return res.status(404).json({ message: "HOD not found" });
    }

    res.json({ message: "HOD status updated successfully", hod: updatedHOD });
  } catch (error) {
    console.error("Error updating HOD status:", error);
    res.status(500).json({ message: "Error updating HOD status", error });
  }
});

// Register for a course
app.post("/api/register-course", async (req, res) => {
  try {
    console.log("Received registration request:", req.body);

    const { name, rollNo, email, yearOfStudy, semester, department, courseId, courseTitle } = req.body;

    // Check if the registration already exists for the user and course
    const existingRegistration = await Registration.findOne({ rollNo, courseId });
    if (existingRegistration) {
      return res.status(400).json({ error: "You have already registered for this course." });
    }

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Fetch the user's UID based on their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new registration with the UID linked
    const registration = new Registration({
      name,
      rollNo,
      email,
      yearOfStudy,
      semester,
      department,
      courseId,
      courseTitle: courseTitle || course.title,
      registeredDate: new Date(),
      uid: user.uid // Linking UID from the user collection
    });

    await registration.save();
    res.status(201).json(registration);

  } catch (error) {
    console.error("Error registering course:", error);
    res.status(500).json({ error: "Error registering course", details: error.message });
  }
});

// Example Express.js endpoint
app.get('/api/registered-courses', async (req, res) => {
  const email = req.query.email;

  try {
    const registeredCourses = await Registration.find({ email });
    res.json(registeredCourses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registered courses' });
  }
});

// API to Get Completed Courses using Student ID
app.get("/api/attendance-marks", async (req, res) => {
  try {
    const { studentId, completed_status } = req.query;
    const completedCourses = await AttendanceMarks.find({
      studentId,
      completed_status: 'yes',
    });
    res.json(completedCourses);
    console.log("Fetched Completed Courses:", res.data);
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// GET API to fetch completed courses by studentId and completed_status
app.get("/attendance_marks", async (req, res) => {
  try {
    const { studentId, completed_status } = req.query;

    if (!studentId || !completed_status) {
      return res.status(400).json({ error: "Missing studentId or completed_status parameter" });
    }

    const completedCourses = await AttendanceMarks.find({
      studentId,
      completed_status,
    });

    res.status(200).json(completedCourses);

  } catch (error) {
    console.error("Error fetching completed courses:", error);
    res.status(500).json({ error: "Failed to fetch completed courses" });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const student = await student.findOne({ email });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Add a new course (Admin only)
app.post("/api/add-course", async (req, res) => {
  console.log("Received data:", req.body); // Log request data for debugging

  try {
    const { name, code, field, description, startDate, endDate } = req.body;

    if (!name || !code || !field || !description || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCourse = new Course({
      name,
      code,
      field,
      description,
      startDate,
      endDate,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!", course: newCourse });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Error adding course" });
  }
});


app.get("/api/trainer-courses", async (req, res) => {
  try {
    const trainerEmail = req.query.email;
    if (!trainerEmail) {
      return res.status(400).json({ error: "Trainer email is required" });
    }

    const trainer = await Trainer.findOne({ email: trainerEmail });
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    const courses = await Course.find({ _id: { $in: trainer.selectedCourses } });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching trainer courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// API to fetch students by courseId
app.get("/api/course-students", async (req, res) => {
  try {
    const { courseId } = req.query;
    console.log("Received courseId:", courseId); // Debug log

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      console.error("Invalid Course ID format:", courseId);
      return res.status(400).json({ error: "Invalid Course ID format" });
    }

    const students = await Registration.find({ courseId: courseId });

    console.log("Students fetched:", students);

    if (students.length === 0) {
      return res.status(404).json({ error: "No students found for this course" });
    }

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


app.post('/api/submit-attendance', async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid data format. Expected an array." });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { courseId: update.courseId, studentId: update.studentId },
        update: {
          $set: {
            attendance: update.attendance,
            marks: update.marks,
            completed_status: update.completed_status,
            remarks: update.remarks,
          },
        },
        upsert: true,
      },
    }));

    const result = await AttendanceMarks.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Attendance and marks submitted successfully!', result });
  } catch (error) {
    console.error('Error saving attendance data:', error);
    res.status(500).json({ error: 'Failed to submit attendance and marks' });
  }
});



// ✅ API Route to Get Student Count
// app.get("/api/users/student-count", async (req, res) => {
//   try {
//     // Count documents in the 'users' collection where role is 'student'
//     const studentsCount = await User.countDocuments({ role: "student" });

//     // Send the count as a response
//     res.status(200).json({ studentsCount });
//   } catch (error) {
//     console.error("Error fetching student count:", error);
//     res.status(500).json({ error: "Failed to fetch student count" });
//   }
// });

// API to count students
app.get("/api/users/student-count", async (req, res) => {
  try {
    const studentsCount = await User.countDocuments({ role: "student" });
    res.json({ studentsCount });
  } catch (error) {
    console.error("Error fetching student count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// -------------------- Multer Setup for File Uploads --------------------
const UPLOADS_FOLDER = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const materialUpload = multer({ storage }).single("file"); // For material uploads
const exemptionUpload = multer({ storage }).single("proof"); // For exemption uploads
//app.use("/uploads", express.static(UPLOADS_FOLDER));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// -------------------- End Multer Setup -------------------


// POST upload material endpoint
// Expects: courseId, title, description and file (multipart/form-data)
app.post("/api/upload-material", materialUpload, async (req, res) => {
  try {
    const { courseId, title, description } = req.body;
    if (!courseId || !title || !req.file) {
      return res.status(400).json({ error: "courseId, title, and file are required" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const newMaterial = {
      id: "mat-" + Date.now(),
      title,
      description: description || "",
      fileUrl: `http://localhost:${process.env.PORT || 8080}/uploads/${req.file.filename}`,
    };
    course.materials.push(newMaterial);
    await course.save();
    res.json(course);
  } catch (error) {
    console.error("Error uploading material:", error);
    res.status(500).json({ error: "Failed to upload material" });
  }
});


// GET student courses endpoint – returns courses where the student is enrolled.
// For simplicity, we assume each Registration document contains the student’s email and courseId.
app.get("/api/student-courses", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Student email is required" });
    // Find all registrations for this student
    const registrations = await Registration.find({ email });
    const courseIds = registrations.map((r) => r.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});



// -------------------- Fix: API Without Multer --------------------
app.post("/api/exemptions", exemptionUpload, async (req, res) => {
  try {
    console.log("request",req)
    console.log("📥 Received Body:", req.body);
    console.log("📁 Received File:", req.file);

    const {  studentId, studentName, rollNo, email, exemptiveType, details } = req.body;
   

    if (!studentId || !studentName || !rollNo || !email || !exemptiveType || !details) {
      return res.status(400).json({ error: "All fields are required" });
    } 

    const parsedDetails = typeof details === "string" ? JSON.parse(details) : details;
    console.log("📌 Parsed Details:", parsedDetails);

    const proofFileUrl = req.file
    ? `http://localhost:${process.env.PORT || 8080}/uploads/${req.file.filename}`
    : null;

    
    // Decide status based on exemptiveType
    let status = "Pending";
    if (exemptiveType === "Online Course Exemption") {
      status = "Waiting for COE Approval";
    }
     
    // if (ExemptionRequest.status ==="Pending" && exemptiveType === "Online Course Exemption") {
    //   ExemptionRequest.status = "Waiting for COE approval";
    // }

    const newRequest = new ExemptionRequest({
      studentId,
      studentName,
      rollNo,
      email,
      exemptiveType,
      details: parsedDetails, 
      proof: proofFileUrl,
      status,
    
    });
    // if (requestId && requestId.trim() !== "") {
    //   newRequest.requestId = requestId;  // ✅ Add requestId if it's not empty
    // }

    await newRequest.save();
    res.status(201).json({ message: "Exemption request submitted successfully",
     request: newRequest,
     requestId: newRequest._id,
     });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Error submitting exemption request", details: error.message });
  }
});




app.get("/api/student-details/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const studentDetails = await RegisteredCourses.findOne({ email });

    if (!studentDetails) {
      return res.status(404).json({ error: "Student not found in registered courses" });
    }

    res.json(studentDetails);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: error.message });
  }
});



// -------------------- End Multer Setup --------------------



// Approve or Reject a request
// app.put('/api/exemptions/:id', async (req, res) => {
//   try {
//     const { role, action, rejectionReason } = req.body; // role: HOD, Autonomy Affairs, etc.
//     const request = await ExemptionRequest.findById(req.params.id);

//     if (!request) {
//       return res.status(404).json({ error: 'Request not found' });
//     }

//     if (action === 'approve') {
//       if (request.status === 'Pending') request.status = 'Approved by HOD';
//       else if (request.status === 'Approved by HOD') request.status = 'Approved by Autonomy Affairs';
//       else if (request.status === 'Approved by Autonomy Affairs') request.status = 'Approved by Head Academics';
//       else if (request.status === 'Approved by Head Academics') request.status = 'Approved by COE';
//     } else if (action === 'reject') {
//       request.status = `Rejected by ${role}`;
//       request.rejectionReason = rejectionReason || '';
//     }

//     await request.save();
//     res.json(request);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// Approval Sequence
const approvalFlow = ["HOD", "Autonomy Affairs", "Head Academics", "COE"];

// Approve or Reject an Exemption Request
app.put("/api/exemptions/:requestId/:action", verifyToken, async (req, res) => {
  try {
    const { requestId, action } = req.params;
    const { role, name } = req.user; // Extract user details from token
    const {rejectionReason}=req.body
    console.log(rejectionReason,"rejectedreason")
    console.log(`${role} (${name}) is processing request ${requestId}`);

    const request = await ExemptionRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Exemption request not found" });
    }
    console.log("Current Request Status:", request.status);

    // Find the current approval stage of the request
    const currentStageIndex = approvalFlow.findIndex(stage => stage.includes(role)); 
    // Ensure user is authorized for the current approval stage
    if (currentStageIndex === -1 || role !== approvalFlow[currentStageIndex]) {
      return res.status(403).json({ error: "Unauthorized role for this approval stage" });
    }

    // If rejected, update status and stop approval process
    if (action === "reject") {
      request.status = `Rejected by ${role}`;
      request.rejectionReason = rejectionReason || "Insufficient Proof"; 
      await request.save();
      return res.json({ message: `Request rejected by ${role}`, updatedRequest: request });
    }

    // If approved, move to the next stage
    if (currentStageIndex < approvalFlow.length - 1) {
      request.status = `Approved by ${approvalFlow[currentStageIndex]}`; // Mark approval
    } else {
      request.status = "Approved by COE"; // Final approval stage
    }

    await request.save();
    res.json({ message: `Request approved by ${role}`, updatedRequest: request });
  } catch (error) {
    console.error("Error processing exemption request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/api/exemptionsbyRole", verifyToken, async (req, res) => {
  try {
    const { role } = req.user;
    console.log(role);

    let requests;

    if (role === "HOD") {
      // HOD will approve all exemption types initially
      requests = await ExemptionRequest.find({
        status: "Pending",
      });
    } else if (role === "Autonomy Affairs") {
      // Autonomy Affairs only processes Online Course & Internship
      requests = await ExemptionRequest.find({
        status: "Approved by HOD",
        exemptiveType: { $in: ["Online Course", "Internship"] },
      });
    } else if (role === "Head Academics") {
      // Head Academics only processes Online Course & Internship
      requests = await ExemptionRequest.find({
        status: "Approved by Autonomy Affairs",
        exemptiveType: { $in: ["Online Course", "Internship"] },
      });
    } else if (role === "COE") {
      // COE only processes Online Course & Internship
      requests = await ExemptionRequest.find({
        status: { $in: ["Approved by Head Academics", "Waiting for COE Approval"] },
        exemptiveType: { $in: ["Online Course", "Internship", "Online Course Exemption"] },
      });
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.json(requests);
  } catch (error) {
    console.error("Error fetching exemption requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// API to fetch exemption requests by studentId
app.get('/api/exemptions/student/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    // Fetch exemption requests for the given studentId
    const exemptionRequests = await ExemptionRequest.find({ studentId });

    if (exemptionRequests.length === 0) {
      return res.status(404).json({ message: 'No exemption requests found for this student' });
    }

    res.status(200).json(exemptionRequests);
  } catch (error) {
    console.error('Error fetching exemption requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});










app.get("/api/exemptions", async (req, res) => {
  console.log("🔹 Received request at /api/exemptions"); // Log when request reaches the backend
  try {
    const exemptions =  await ExemptionRequest.find(); // Replace this with your database query
    console.log("Backend Response:", exemptions);
    res.json(exemptions); // Always return an array
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exemptions" });
  }
});


app.put("/api/exemptive-limits", async (req, res) => {
  const { exemptiveType, limit } = req.body;

  try {
    // Check if a record already exists for this type
    let existing = await ExemptiveLimit.findOne({ exemptiveType });

    if (existing) {
      // Update existing limit
      existing.limit = limit;
      await existing.save();
      return res.status(200).json({ message: "Limit updated successfully." });
    } else {
      // Create new
      const newLimit = new ExemptiveLimit({ exemptiveType, limit });
      await newLimit.save();
      return res.status(201).json({ message: "Limit created successfully." });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

app.get('/api/exemptions/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const exemption = await ExemptionRequest.findById(id);

      if (!exemption) {
          return res.status(404).json({ error: 'Exemption request not found' });
      }

      return res.status(200).json(exemption);
  } catch (error) {
      console.error('Error fetching exemption request:', error);
      return res.status(500).json({ error: 'Server error' });
  }
});

app.get("/api/exemptiveLimits", async (req, res) => {
  try {
    const limits = await ExemptiveLimit.find();
    res.status(200).json(limits);
  } catch (error) {
    console.error("Error fetching exemptive limits:", error);
    res.status(500).json({ error: "Failed to fetch exemptive limits" });
  }
});

app.get("/api/studentExemptionsCount/:studentId/:exemptiveType", async (req, res) => {
  const { studentId, exemptiveType } = req.params;

  if (!studentId|| !exemptiveType) {
    return res.status(400).json({ error: "studentId and exemptiveType are required." });
  }

  let statusCondition;

  switch (exemptiveType) {
    case "Online Course Exemption":
      statusCondition = "Approved by COE";
      break;
    case "Honor":
    case "Minor":
    case "OneCredit Course":
      statusCondition = "Approved by HOD";
      break;
    case "Internship":
      statusCondition = "Approved by COE";
      break;
    default:
      return res.status(400).json({ error: "Invalid exemptiveType" });
  }

  try {
    const count = await ExemptionRequest.countDocuments({
      studentId,
      exemptiveType,
      status: statusCondition
    });

    res.json({ count });
  } catch (error) {
    console.error("Error fetching exemption count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






// app.listen(8080, () =>
// 	{
// 		console.log("app is running");
// 	}) 

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));   
