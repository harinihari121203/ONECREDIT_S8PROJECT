# 🎓 ONE CREDIT — Course Registration & Exemption System

A Final Year Project: a full‑stack web application (MERN + Firebase auth) to digitalize the workflow for one‑credit courses. The system enables students, trainers, and admins to manage course registrations, exemption applications, attendance, materials, and assessments in a structured and automated way.

---

🚀 Live Demo
- Frontend (Render): https://onecredit-s8project.onrender.com/
- Backend (Render): https://onecredit-backend.onrender.com/
- GitHub: https://github.com/harinihari121203/ONECREDIT_S8PROJECT

---

🛠️ Tech stack (as provided)
- Frontend: React.js, Tailwind CSS
- Authentication: Firebase Authentication
- Backend: Node.js, Express.js (JavaScript)
- Database: MongoDB Atlas
- Deployment: Render (Frontend & Backend)

Note: This README reflects the repository contents and the project description you provided. I have avoided adding details not present in the repo or your description.

---

👥 User roles & main features

- 🧑‍🎓 Student
  - Login using BITSathy institutional email via Firebase Authentication
  - Register for one‑credit courses
  - View enrolled courses and current status
  - Apply for elective exemption
  - Receive course recommendations based on popularity, department, interest, difficulty

- 👨‍🏫 Trainer
  - View assigned courses
  - Upload study materials
  - View enrolled student lists
  - Mark attendance (Day 1: FN1, AN1 | Day 2: FN2, AN2)
  - Update internal marks

- 🧑‍💼 Admin
  - Assign courses to trainers
  - View and manage course registrations
  - Review and approve exemption requests

---

📄 Key features
- 🔐 Secure authentication with Firebase
- 📝 Online course registration and eligibility tracking
- 🧾 Elective exemption requests (including one‑credit, online course, honor/minor courses, internships)
- 🧠 Course recommendation system (based on the attributes you mentioned)
- 📚 Trainer dashboard for materials, attendance & marks
- 📊 Admin control panel for reviewing submissions and assignments

---

📁 Repository structure (high level)
- Backend/ — Node.js + Express backend (index.js present)
  - Includes a Firebase service account JSON in the Backend folder (please see Security note)
- Frontend/ — React frontend (client application)
- README.md — this file

---

⚙️ Local setup (quick start)

Prerequisites
- Node.js (recommended v14+)
- npm or yarn
- Git (optional)

Backend
1. cd Backend
2. npm install
3. Provide the required environment variables or service account credentials. Inspect Backend/.env and Backend/index.js to determine exact variable names expected by the server.
   - Typical variables to look for: FIREBASE_* (or a service account file), MONGODB_URI (MongoDB Atlas connection string), PORT, JWT_SECRET (if used).
4. Start the backend:
   - npm start (or npm run dev if a dev script exists)

Frontend
1. cd Frontend
2. npm install
3. Configure frontend environment variables (e.g., API base URL pointing to the backend deployment or local backend)
4. Start the frontend:
   - npm start (or the framework's recommended start script)

Testing
- Open the frontend (typically http://localhost:3000 or the port shown by the start script) and verify flows.
- Use Postman or curl to test API endpoints on the backend (inspect Backend/index.js to see registered routes and expected request formats).

---

🔐 Security & important notes
- I observed a Firebase service account JSON file inside Backend/. Make sure this credential is rotated and not published in a public repository if this repo is public. Prefer storing credentials as environment variables or using your hosting provider's secret manager.
- Do NOT commit any secrets or private keys. Use .env (gitignored) or Render environment variables / secrets.

---

📦 Deployment (high level)
- Backend
  - Create a Render Web Service pointing to the Backend folder.
  - Set build/start commands from Backend/package.json.
  - Add environment variables / secrets in the Render dashboard (do not upload raw service account JSON—use secrets or env vars).
- Frontend
  - Deploy as a static site or Web Service on Render depending on your build output (build folder or dist).
  - Configure the frontend to use the backend URL (https://onecredit-backend.onrender.com) via environment variables.

---

🤝 Contributing & next steps
- If you'd like, I can:
  - Analyze the repository in detail and produce an API endpoints list and example requests.
  - Add a .env.example file with the exact variable names used by the code.
  - Update or push this README to the repository for you.
- To proceed with modifications in the repository, tell me whether you want me to:
  - Create the README.md file directly in the repo, or
  - Create a draft / pull request with the changes.

---

📬 Contact
- GitHub: @harinihari121203

---

⚖️ License
- Add a LICENSE file (for example MIT) if you intend to make the project open source.

Thank you — I kept this README professional and faithful to the content you provided. If you want more details (API reference, exact env var names, example payloads), I can read the repository files and produce them next.````
