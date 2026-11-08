# Task Management App (Task 6)

A full-stack Task Management application built as part of the **Auspify Technologies Software Development Internship**. The app enables users to organize daily tasks, set priorities, track execution progress across workflow states, and manage record lifecycles backed by a persistent SQLite database.

---

## 🌟 Key Features

* **Complete CRUD Operations:** Create, retrieve, update, and delete tasks dynamically via REST API endpoints.
* **Workflow Status Tracking:** Transition tasks across `Pending`, `In Progress`, and `Completed` lifecycle stages.
* **Priority Classification:** Visual color-coded indicators for `Low`, `Medium`, and `High` priority items.
* **Real-time UI Filtering:** Filter tasks instantly by status and priority levels without full page reloads.
* **Persistent SQLite Storage:** Saves task details, due dates, timestamps, and status states permanently in `tasks.db`.
* **Auto-Seeding Database:** Automatically seeds initial demo task data into SQLite upon first application startup.

---

## 🛠️ Tech Stack

* **Backend Runtime:** Node.js
* **Web Framework:** Express.js
* **Database:** SQLite3 (`sqlite3`)
* **Middleware:** CORS, Express JSON Parser
* **Frontend:** HTML5, CSS3 (Flexbox/Grid layout), Vanilla JavaScript (ES6+ / Fetch API)

---

## 📁 Project Structure

```text
Task-06-Task-Management-App/
├── tasks.db                # SQLite database file (created automatically)
├── package.json            # Node.js configuration & dependencies
├── README.md               # Project documentation
├── server.js               # Express API routes & SQLite queries
└── public/
    ├── index.html          # Task Manager user interface
    ├── styles.css          # Responsive card-based styling
    └── script.js           # REST API fetch client & DOM interactions
🚀 Installation & Setup
Navigate to the project directory:

Bash
cd Task-06-Task-Management-App
Install dependencies:

Bash
npm install
Start the server:

Bash
npm start
Open in browser:
Access http://localhost:3000 in your web browser.

🔌 API Endpoints
Method	Endpoint	Description
GET	/api/tasks	Retrieves all tasks (supports ?status= and ?priority= query filters).
POST	/api/tasks	Creates a new task item.
PUT	/api/tasks/:id	Updates task status, priority, title, description, or due date.
DELETE	/api/tasks/:id	Removes a task permanently by ID.
🗄️ Database Schema
tasks Table
id (INTEGER PRIMARY KEY AUTOINCREMENT)

title (TEXT NOT NULL)

description (TEXT)

priority (TEXT DEFAULT 'Medium')

status (TEXT DEFAULT 'Pending')

due_date (TEXT)

created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

👨‍💻 Author
Developer: Yaseen

Role: Software Development Intern

Organization: Auspify Technologies