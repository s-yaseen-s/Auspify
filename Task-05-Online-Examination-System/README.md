Here is the complete `README.md` file in a single copy-ready block:

```markdown
# Online Examination System (Task 5)

A full-stack, web-based Online Examination System built as part of the **Auspify Technologies Software Development Internship**. The application features dynamic question loading, server-side grading, persistent scoring records in SQLite, and a real-time countdown timer with auto-submission.

---

## 🌟 Key Features

* **Dynamic Question Delivery:** Fetches exam questions dynamically from the backend without exposing correct answers to the client UI.
* **Server-Side Scoring:** Prevents client-side tampering by computing final scores and percentages strictly on the Node.js/Express backend.
* **Real-Time Countdown Timer:** Enforces a timed environment (3-minute limit) with automatic submission when time expires.
* **Persistent Results Storage:** Automatically logs student name, raw score, total score, percentage, and submission timestamp into an SQLite database (`exam.db`).
* **Instant Score Summary & History:** Displays immediate feedback upon submission alongside a historic table of previous test-takers.
* **Automated Seeding:** Self-seeds initial quiz data into the database on first startup if the tables are empty.

---

## 🛠️ Tech Stack

* **Backend Runtime:** Node.js
* **Web Framework:** Express.js
* **Database:** SQLite3 (`sqlite3`)
* **Middleware:** CORS, Express JSON Parser
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+ / Fetch API)

---

## 📁 Project Structure

```text
Task-05-Online-Examination-System/
├── exam.db                 # SQLite database file (created automatically)
├── package.json            # Node.js project configuration & dependencies
├── README.md               # Project documentation
├── server.js               # Express server, SQLite schema, & API endpoints
└── public/
    ├── index.html          # Single Page Application structure
    ├── styles.css          # Modern, responsive UI styling
    └── script.js           # Quiz lifecycle, timer, and Fetch API communication

```

---

## 🚀 Installation & Setup

1. **Navigate to the project folder:**
```bash
cd Task-05-Online-Examination-System

```


2. **Install dependencies:**
```bash
npm install

```


3. **Start the server:**
```bash
npm start

```


4. **Open in browser:**
Navigate to `http://localhost:3000` in your web browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/questions` | Retrieves all questions (sanitized without correct answers). |
| **POST** | `/api/submit` | Evaluates submitted answers, updates SQLite, and returns score summary. |
| **GET** | `/api/results` | Fetches historical test results sorted by most recent. |

### Sample POST `/api/submit` Request Body

```json
{
  "studentName": "Yaseen",
  "answers": {
    "1": "C",
    "2": "B",
    "3": "B",
    "4": "B",
    "5": "B"
  }
}

```

---

## 🗄️ Database Schema

### `questions` Table

* `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
* `question` (TEXT NOT NULL)
* `option_a` (TEXT NOT NULL)
* `option_b` (TEXT NOT NULL)
* `option_c` (TEXT NOT NULL)
* `option_d` (TEXT NOT NULL)
* `correct_option` (TEXT NOT NULL)

### `results` Table

* `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
* `student_name` (TEXT NOT NULL)
* `score` (INTEGER NOT NULL)
* `total` (INTEGER NOT NULL)
* `submitted_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

---

## 👨‍💻 Author

* **Developer:** Yaseen
* **Role:** Software Development Intern
* **Organization:** Auspify Technologies

```

```