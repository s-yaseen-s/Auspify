document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    document.getElementById('task-form').addEventListener('submit', handleAddTask);
    document.getElementById('filter-status').addEventListener('change', loadTasks);
    document.getElementById('filter-priority').addEventListener('change', loadTasks);
});

async function loadTasks() {
    const status = document.getElementById('filter-status').value;
    const priority = document.getElementById('filter-priority').value;

    const queryParams = new URLSearchParams({ status, priority });
    const res = await fetch(`/api/tasks?${queryParams.toString()}`);
    const tasks = await res.json();

    renderTasks(tasks);
}

function renderTasks(tasks) {
    const grid = document.getElementById('tasks-grid');

    if (tasks.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">No tasks found.</p>';
        return;
    }

    grid.innerHTML = tasks.map(task => `
        <div class="task-card priority-${task.priority}">
            <div>
                <div class="task-header">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
                </div>
                <p class="task-desc">${escapeHtml(task.description || 'No description provided.')}</p>
                <div class="task-meta">
                    📅 Due: ${task.due_date ? task.due_date : 'No deadline'}
                </div>
            </div>
            <div class="task-actions">
                <select class="status-select" onchange="updateStatus(${task.id}, this.value)">
                    <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
                <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function handleAddTask(e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const priority = document.getElementById('priority').value;
    const due_date = document.getElementById('due-date').value;

    if (!title) return;

    const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority, due_date })
    });

    if (res.ok) {
        document.getElementById('task-form').reset();
        loadTasks();
    }
}

async function updateStatus(id, newStatus) {
    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    loadTasks();
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
