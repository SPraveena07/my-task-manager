const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const prioritySelect = document.getElementById('prioritySelect');
const taskCount = document.getElementById('taskCount');
const voiceBtn = document.getElementById('voiceBtn');
const langToggle = document.getElementById('langToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentLang = 'ta'; // Default Tamil-la vekkalaam appo dhaan unga akka-vukku easy-ah irukkum

const translations = {
    en: {
        title: "My Day Plan",
        inputPlaceholder: "Add a new task",
        datePlaceholder: "Date (DD-MM-YYYY)",
        addBtn: "Add",
        clearAll: "Clear All",
        warningEmpty: "Please enter the task",
        warningDate: "Warning: Previous date selected!"
    },
    ta: {
        title: "எனது நாள் திட்டம்",
        inputPlaceholder: "புதிய வேலையைச் சேர்க்கவும்",
        datePlaceholder: "தேதி (DD-MM-YYYY)",
        addBtn: "சேர்",
        clearAll: "அனைத்தையும் நீக்கு",
        warningEmpty: "தயவுசெய்து ஒரு வேலையை உள்ளிடவும்",
        warningDate: "எச்சரிக்கை: நீங்கள் பழைய தேதியைத் தேர்ந்தெடுத்துள்ளீர்கள்!"
    }
};

// --- RENDER TASKS ---
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <div style="font-weight:bold">${task.text}</div>
                <div style="font-size:0.8rem; color:#aaa">${task.priority} | Due: ${task.date || 'No Date'}</div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;
        taskList.appendChild(li);
    });
    taskCount.innerText = tasks.length;
}

// --- ADD TASK FUNCTION ---
function addTask() {
    const t = translations[currentLang];
    const text = taskInput.value.trim();
    const dateInput = taskDate.value.trim();

    if (text === '') {
        alert(t.warningEmpty);
        return;
    }

    if (dateInput !== "") {
        const parts = dateInput.split('-');
        const selectedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
            alert(t.warningDate);
            return;
        }
    }

    tasks.push({ text, date: dateInput, priority: prioritySelect.value });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    taskInput.value = '';
    taskDate.value = '';
}

// --- LANGUAGE UPDATE ---
function updateLanguage() {
    const t = translations[currentLang];
    document.querySelector('h1').innerText = t.title;
    taskInput.placeholder = t.inputPlaceholder;
    taskDate.placeholder = t.datePlaceholder;
    addBtn.innerText = t.addBtn;
    document.getElementById('clearAllBtn').innerText = t.clearAll;
}

langToggle.onclick = () => {
    currentLang = (currentLang === 'ta') ? 'en' : 'ta';
    updateLanguage();
};

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Clear All Logic
document.getElementById('clearAllBtn').onclick = () => {
    if (confirm("Are you sure?")) {
        tasks = [];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
};

// Button Events
addBtn.addEventListener('click', addTask); // Click event direct-ah bind panrom
updateLanguage();
renderTasks();