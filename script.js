const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const prioritySelect = document.getElementById('prioritySelect');
const taskCount = document.getElementById('taskCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const voiceBtn = document.getElementById('voiceBtn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `${task.priority} ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                <span class="priority-label">${task.priority} | Due: ${task.date || 'No Date'}</span>
            </div>
            <button onclick="deleteTask(${index})">✕</button>
        `;
        li.onclick = (e) => { if(e.target.tagName !== 'BUTTON') toggleTask(index); };
        taskList.appendChild(li);
    });
    taskCount.innerText = tasks.length;
}

function addTask() {
    const text = taskInput.value.trim();
    const date = taskDate.value.trim();

    // Box empty-ah irundha alert kaattum
    if (text === '') {
        alert("Please enter the task"); 
        return;
    }

    tasks.push({ 
        text, 
        date, 
        priority: prioritySelect.value, 
        completed: false, 
        notified: false 
    });
    
    saveAndRender();
    taskInput.value = '';
    taskDate.value = '';
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) { tasks.splice(index, 1); saveAndRender(); }
function toggleTask(index) { tasks[index].completed = !tasks[index].completed; saveAndRender(); }

// NOTIFICATION LOGIC (Manual Date Format: DD-MM-YYYY)
setInterval(() => {
    const now = new Date();
    const today = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
    
    tasks.forEach(task => {
        if (task.date === today && !task.completed && !task.notified) {
            if (Notification.permission === 'granted') {
                new Notification("Task Reminder! 📅", { body: `Don't forget: ${task.text}` });
                task.notified = true;
                saveAndRender();
            }
        }
    });
}, 10000);

// VOICE RECOGNITION
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    voiceBtn.onclick = () => {
        recognition.start();
        voiceBtn.classList.add('recording');
    };
    recognition.onresult = (e) => {
        taskInput.value = e.results[0][0].transcript;
        voiceBtn.classList.remove('recording');
        setTimeout(addTask, 500);
    };
    recognition.onerror = () => voiceBtn.classList.remove('recording');
}

addBtn.onclick = addTask;
clearAllBtn.onclick = () => { if(confirm("Clear all?")) { tasks = []; saveAndRender(); } };