# Library Management System

A full-stack web application built for **Task 02** of the Auspify Technologies Software Development Internship. The system enables users to manage library catalogs, track book availability statuses (`Available` / `Borrowed`), and filter records in real-time.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** SQLite3
* **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+ Async/Await, Fetch API)
* **Middleware:** CORS, Express JSON parser (`express.json()`)

---

## ✨ Key Features

* **Full RESTful API Architecture:** Implements `GET`, `POST`, `PUT`, and `DELETE` HTTP endpoints for complete CRUD operations.
* **Persistent & Secure Data Storage:** Dynamic SQLite table initialization using parameterized SQL queries to prevent SQL injection vulnerabilities.
* **Status Tracking:** Real-time toggling of book statuses (`Available` ↔ `Borrowed`) with state persistence in the database.
* **Client-Side Live Filtering:** Fast, in-memory instant search filtering by Title, Author, Genre, or ISBN.
* **Event Delegation & Dynamic DOM:** Dynamic DOM updates without page reloads using centralized table event delegation.

---

## 📁 Project Structure

```text
Task-02-Library-Management-System/
├── library.db              # Auto-generated SQLite database
├── package.json            # Project configuration and dependencies
├── server.js               # Express server & API routes
├── README.md               # Project documentation
└── public/                 # Static frontend assets
    ├── index.html          # Web application structure
    ├── styles.css          # Responsive design & UI styling
    └── script.js           # Frontend logic & Fetch API interactions

```

---

## 🔗 API Reference

| Endpoint | Method | Description | Request Body |
| --- | --- | --- | --- |
| `/api/books` | `GET` | Retrieve all books (ordered by ID descending) | None |
| `/api/books` | `POST` | Create a new book record | `{ title, author, isbn, genre }` |
| `/api/books/:id/status` | `PUT` | Update book status (`available` / `borrowed`) | `{ status }` |
| `/api/books/:id` | `DELETE` | Permanently remove a book record by ID | None |

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v14 or higher)
* npm (Node Package Manager)

### Installation & Setup

1. **Navigate to the project directory:**
```bash
cd Task-02-Library-Management-System

```


2. **Install required dependencies:**
```bash
npm install

```


3. **Start the Express server:**
```bash
node server.js

```


4. **Access the application:**
Open your browser and navigate to `http://localhost:3000`

```

<ElicitationsGroup>
- Ready to commit and push Task 2 to your GitHub repository?
- Would you like help testing any of the endpoints before submitting?
</ElicitationsGroup>

```