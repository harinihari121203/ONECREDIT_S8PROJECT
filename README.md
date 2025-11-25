 One Credit Course Registration and Exemption System
 
A full-stack MERN web application to digitalize the entire workflow of One Credit Courses, enabling students, trainers, and admins to manage registrations, assessments, attendance, study materials, and exemption processes efficiently.

---

## 🚀 Live Demo

- Frontend (Render): https://onecredit-s8project.onrender.com/
- Backend (Render): https://onecredit-backend.onrender.com
- GitHub Repository: https://github.com/harinihari121203/ONECREDIT_S8PROJECT

---

## 🧰 Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js (REST API)
- Auth: Firebase Authentication
- Database: MongoDB Atlas
- Deployment: Render (Frontend & Backend), MongoDB Atlas

---

## ✨ Features

- Secure login with institutional BITSathy email (Firebase Auth)
- Online course registration and eligibility tracking
- Elective exemption requests:
  - One Credit Courses
  - Online Courses
  - Honors / Minor Courses
  - Internships
- Smart course recommendation system:
  - Popularity
  - Department
  - Interest
  - Difficulty
- Trainer dashboard for:
  - Study material uploads
  - Attendance marking (Day 1: FN1, AN1 | Day 2: FN2, AN2)
  - Internal marks updating
- Admin panel for:
  - Course–trainer assignment
  - Registration management
  - Exemption review and approval

---

## 👥 User Roles

### 🧑‍🎓 Student

- Register for one-credit courses
- View enrolled courses and status
- Apply for elective exemptions
- Receive course recommendations

### 👨‍🏫 Trainer

- View assigned courses
- Upload study materials
- View enrolled students
- Mark attendance and update internal marks

### 🧑‍💼 Admin

- Assign courses to trainers
- Manage course registrations
- Review and approve exemption requests

---

## 🖥️ Installation & Setup

### 1. Clone the Repository

git clone https://github.com/harinihari121203/ONECREDIT_S8PROJECT
cd ONECREDIT_S8PROJECT

text

### 2. Backend Setup

cd backend
npm install
npm start

Backend runs on: http://localhost:5000
text

### 3. Frontend Setup

cd ../frontend
npm install
npm run dev

Frontend runs on: http://localhost:5173
text

---

## 🔐 Authentication

- Authentication is restricted to official BITSathy email IDs via Firebase Authentication.

---

## 📂 Project Structure (High Level)

ONECREDIT_S8PROJECT/
frontend/ # React + Tailwind client
backend/ # Node + Express API

text

---

## 🙌 Acknowledgements

Special thanks to our project guide, faculty, and team members for their guidance and support throughout the development of this final year engineering project.
