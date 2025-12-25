const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const prioritySelect = document.getElementById('prioritySelect');
const taskCount = document.getElementById('taskCount');
const voiceBtn = document.getElementById('voiceBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-info">
                <div style="font-weight:bold">${task.text}</div>
                <div style="font-size:0.8rem; color:#aaa">${task.priority} | Due: ${task.date || 'No Date'}</div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;
        taskList.appendChild(li);
    });
    taskCount.innerText = tasks.length;
}

function addTask() {
    const text = taskInput.value.trim();
    const dateInput = taskDate.value.trim();

    if (text === '') {
        alert("Please enter the task");
        return;
    }

    // --- PREVIOUS DATE WARNING LOGIC ---
    if (dateInput !== "") {
        const selectedDateParts = dateInput.split('-'); // Expected format DD-MM-YYYY
        const selectedDate = new Date(selectedDateParts[2], selectedDateParts[1] - 1, selectedDateParts[0]);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Today's time-ah reset panrom comparison-kaaga

        if (selectedDate < today) {
            alert("Warning: You have entered a previous date!");
            return; // Task add aagatha maathiri block panrom
        }
    }

    tasks.push({ text, date: dateInput, priority: prioritySelect.value, completed: false, notified: false });
    saveAndPush();
    taskInput.value = '';
    taskDate.value = '';
}

function saveAndPush() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndPush();
}

addBtn.onclick = addTask;

// --- MIC (VOICE RECOGNITION) FIX ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Language set panrom
    recognition.interimResults = false;

    voiceBtn.onclick = () => {
        try {
            recognition.start();
            voiceBtn.style.backgroundColor = "#ff5e57"; // Recording start aana red color
        } catch (err) {
            console.error("Speech recognition already started", err);
        }
    };

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        taskInput.value = transcript;
        voiceBtn.style.backgroundColor = "#333"; // Back to normal
        setTimeout(addTask, 500);
    };

    recognition.onerror = (event) => {
        voiceBtn.style.backgroundColor = "#333";
        if(event.error === 'not-allowed') {
            alert("Mic permission denied. Please allow mic in browser settings.");
        } else {
            alert("Mic error: " + event.error);
        }
    };

    recognition.onend = () => {
        voiceBtn.style.backgroundColor = "#333";
    };
} else {
    voiceBtn.onclick = () => alert("Sorry, your browser does not support voice recognition.");
}
// Clear All Button Logic
const clearAllBtn = document.getElementById('clearAllBtn');

clearAllBtn.onclick = () => {
    if (tasks.length === 0) {
        alert("No tasks to clear!");
        return;
    }
    
    // Oru confirmation kettu apparam dhaan delete pannum
    if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = []; // Ella task-ayum kaali pannidhum
        saveAndPush(); // LocalStorage-la update panni screen-ah refresh pannum
    }
};