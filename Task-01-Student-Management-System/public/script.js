const API_URL = '/api/students';

const form = document.getElementById('student-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const tableBody = document.getElementById('student-table-body');
const searchInput = document.getElementById('search-input');

let allStudents = [];

// Fetch and display all students
async function fetchStudents() {
    try {
        const res = await fetch(API_URL);
        allStudents = await res.json();
        renderTable(allStudents);
    } catch (err) {
        console.error('Failed to load students:', err);
    }
}

// Render dynamic student rows
function renderTable(students) {
    tableBody.innerHTML = '';
    if (students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No student records found.</td></tr>`;
        return;
    }

    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.grade}</td>
            <td>
                <button class="btn btn-edit" onclick="startEdit(${student.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Handle Add / Edit submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('student-id').value;
    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        course: document.getElementById('course').value,
        grade: document.getElementById('grade').value,
    };

    try {
        if (id) {
            // Update
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        resetForm();
        fetchStudents();
    } catch (err) {
        console.error('Error saving record:', err);
    }
});

// Load record into edit mode
function startEdit(id) {
    const student = allStudents.find(s => s.id === id);
    if (!student) return;

    document.getElementById('student-id').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('course').value = student.course;
    document.getElementById('grade').value = student.grade;

    formTitle.innerText = 'Edit Student Record';
    submitBtn.innerText = 'Update Student';
    cancelBtn.style.display = 'inline-block';
}

// Delete student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents();
    } catch (err) {
        console.error('Error deleting record:', err);
    }
}

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    document.getElementById('student-id').value = '';
    form.reset();
    formTitle.innerText = 'Add New Student';
    submitBtn.innerText = 'Add Student';
    cancelBtn.style.display = 'none';
}

// Search Filter
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allStudents.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.course.toLowerCase().includes(query)
    );
    renderTable(filtered);
});

// Initial load
fetchStudents();