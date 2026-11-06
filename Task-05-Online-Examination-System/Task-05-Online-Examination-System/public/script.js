let studentName = '';
let examQuestions = [];
let timerInterval = null;
let timeLeft = 180; // 3 minutes in seconds

document.getElementById('start-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    studentName = document.getElementById('student-name').value.trim();
    if (!studentName) return;

    await loadQuestions();
    document.getElementById('start-card').classList.add('hidden');
    document.getElementById('exam-card').classList.remove('hidden');
    startTimer();
});

async function loadQuestions() {
    const res = await fetch('/api/questions');
    examQuestions = await res.json();
    
    const container = document.getElementById('questions-container');
    container.innerHTML = examQuestions.map((q, idx) => `
        <div class="question-block">
            <p>${idx + 1}. ${q.question}</p>
            <label class="option-label"><input type="radio" name="q_${q.id}" value="A"> A) ${q.option_a}</label>
            <label class="option-label"><input type="radio" name="q_${q.id}" value="B"> B) ${q.option_b}</label>
            <label class="option-label"><input type="radio" name="q_${q.id}" value="C"> C) ${q.option_c}</label>
            <label class="option-label"><input type="radio" name="q_${q.id}" value="D"> D) ${q.option_d}</label>
        </div>
    `).join('');
}

function startTimer() {
    const timerElem = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeLeft--;
        const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const secs = String(timeLeft % 60).padStart(2, '0');
        timerElem.textContent = `Time Left: ${mins}:${secs}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time expired! Submitting exam automatically.');
            submitExam();
        }
    }, 1000);
}

document.getElementById('exam-form').addEventListener('submit', (e) => {
    e.preventDefault();
    clearInterval(timerInterval);
    submitExam();
});

async function submitExam() {
    const answers = {};
    examQuestions.forEach(q => {
        const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
        if (selected) answers[q.id] = selected.value;
    });

    const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, answers })
    });

    const data = await res.json();
    displayResults(data);
}

async function displayResults(currentResult) {
    document.getElementById('exam-card').classList.add('hidden');
    document.getElementById('result-card').classList.remove('hidden');

    document.getElementById('score-display').innerHTML = `
        <div class="score-box">
            <h3>Student: ${currentResult.studentName}</h3>
            <h2>Score: ${currentResult.score} / ${currentResult.total} (${currentResult.percentage}%)</h2>
        </div>
    `;

    const res = await fetch('/api/results');
    const allResults = await res.json();
    
    document.getElementById('results-tbody').innerHTML = allResults.map(r => `
        <tr>
            <td>${r.student_name}</td>
            <td>${r.score}/${r.total}</td>
            <td>${((r.score/r.total)*100).toFixed(1)}%</td>
            <td>${new Date(r.submitted_at).toLocaleString()}</td>
        </tr>
    `).join('');
}