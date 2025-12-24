// 1. Elements-ah select pannuvom
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate'); // Pudhu Date Input
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const prioritySelect = document.getElementById('prioritySelect');
const taskCount = document.getElementById('taskCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const voiceBtn = document.getElementById('voiceBtn');
const dateDisplay = document.getElementById('dateDisplay');

// 2. Browser-la notification permission kekka
if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

// 3. Inraiya date-ah header-la kaatta
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateDisplay.innerText = new Date().toLocaleDateString(undefined, options);

// 4. LocalStorage-la irundhu tasks-ah edukka
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

// 5. Task-ah Screen-la kaatta
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `${task.priority} ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                <span class="priority-label">${task.priority} Priority ${task.date ? '| Due: ' + task.date : ''}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;

        li.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            toggleTask(index);
        });

        taskList.appendChild(li);
    });
    updateStats();
}

// 6. Pudhu Task add panna
function addTask() {
    const text = taskInput.value.trim();
    const dateValue = taskDate.value;
    
    if (text === '') return;

    const newTask = {
        text: text,
        priority: prioritySelect.value,
        date: dateValue,
        completed: false,
        notified: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskInput.value = '';
    taskDate.value = '';
}

// 7. Remainder Notification Logic
function checkReminders() {
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach(task => {
        // Inraiya date-um task date-um onna irundha notification anuppum
        if (task.date === today && !task.completed && !task.notified) {
            if (Notification.permission === 'granted') {
                new Notification("Task Reminder! 📅", {
                    body: `Don't forget: ${task.text}`,
                    icon: 'icon.png'
                });
                task.notified = true;
                saveAndRender();
            }
        }
    });
}

// Ovvoru 1 minute-kum background-la check pannum
setInterval(checkReminders, 60000);

// 8. Helper Functions
function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function updateStats() {
    taskCount.innerText = tasks.length;
}

// 9. Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

clearAllBtn.addEventListener('click', () => {
    if(confirm("Ellathaiyum clear pannalaama?")) {
        tasks = [];
        saveAndRender();
    }
});

// 10. VOICE COMMAND (MIC)
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.classList.add('recording');
        voiceBtn.style.background = "#ff5e57";
    });

    recognition.onresult = (event) => {
        taskInput.value = event.results[0][0].transcript;
        voiceBtn.classList.remove('recording');
        voiceBtn.style.background = "#ffffff";
        setTimeout(addTask, 500); 
    };

    recognition.onerror = () => {
        voiceBtn.classList.remove('recording');
        voiceBtn.style.background = "#ffffff";
    };
}