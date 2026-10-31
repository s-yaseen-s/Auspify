Set-Content -Path "Task-01-Student-Management-System/README.md" -Value @"
# Task 01: Student Management System

A full-stack web application built for managing student records with persistent storage, full CRUD operations, and real-time search capabilities.

---

## 🛠️ Tech Stack & Dependencies
* **Backend:** Node.js, Express.js
* **Database:** SQLite (`sqlite3`)
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
* **Middleware:** CORS, Body-Parser

---

## ✨ Features
* **Create:** Register new students with Name, Email, Course, and Grade/GPA.
* **Read:** Display all stored records dynamically in a structured data table.
* **Update:** Load existing records back into the form for details modification.
* **Delete:** Remove student entries with a confirmation safety prompt.
* **Filter:** Live client-side search across student names and courses.

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students` | Retrieve all student records |
| `POST` | `/api/students` | Add a new student record |
| `PUT` | `/api/students/:id` | Update an existing student record by ID |
| `DELETE` | `/api/students/:id` | Delete a student record by ID |

---

## 🚀 How to Run Locally

1. Navigate to the task directory:
   cd Task-01-Student-Management-System

2. Install dependencies:
   npm install

3. Launch the Express server:
   node server.js

4. Open your browser and go to:
   http://localhost:3000
"@ -Encoding UTF8; git add Task-01-Student-Management-System/README.md; git commit -m "Added dedicated README documentation for Task 1"; git push origin main