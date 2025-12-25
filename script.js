const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const prioritySelect = document.getElementById('prioritySelect');
const langToggle = document.getElementById('langToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentLang = 'ta'; 

const translations = {
    en: {
        title: "My Day Plan",
        inputPlaceholder: "Add a new task",
        datePlaceholder: "Date (DD-MM-YYYY)",
        addBtn: "Add",
        clearAll: "Clear All",
        totalText: "Total Tasks: ",
        warningEmpty: "Please enter the task",
        warningDate: "Warning: Previous date selected!",
        priorities: ["Low", "Medium", "High"]
    },
    ta: {
        title: "எனது நாள் திட்டம்",
        inputPlaceholder: "புதிய வேலையைச் சேர்க்கவும்",
        datePlaceholder: "தேதி (DD-MM-YYYY)",
        addBtn: "சேர்",
        clearAll: "அனைத்தையும் நீக்கு",
        totalText: "மொத்த வேலைகள்: ",
        warningEmpty: "தயவுசெய்து ஒரு வேலையை உள்ளிடவும்",
        warningDate: "எச்சரிக்கை: நீங்கள் பழைய தேதியைத் தேர்ந்தெடுத்துள்ளீர்கள்!",
        priorities: ["குறைவு", "நடுத்தரம்", "அதிகம்"]
    }
};

function updateLanguage() {
    const t = translations[currentLang];
    
    // 1. Text content update
    document.querySelector('h1').innerText = t.title;
    taskInput.placeholder = t.inputPlaceholder;
    taskDate.placeholder = t.datePlaceholder;
    addBtn.innerText = t.addBtn;
    document.getElementById('clearAllBtn').innerText = t.clearAll;

    // 2. Stats Text Fix (Inga dhaan error irundhadhu)
    const statsTextDiv = document.getElementById('statsText');
    statsTextDiv.innerHTML = `<span>${t.totalText}</span> <span id="taskCount">${tasks.length}</span>`;

    // 3. Dropdown Fix (Low/Medium/High language update)
    for (let i = 0; i < prioritySelect.options.length; i++) {
        prioritySelect.options[i].text = t.priorities[i];
    }
    
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        // Task display-la priority-ah update panna
        li.innerHTML = `
            <div>
                <div style="font-weight:bold">${task.text}</div>
                <div style="font-size:0.8rem; color:#aaa">${task.priority} | Due: ${task.date || 'No Date'}</div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})" style="background:none; border:none; color:red; font-size:1.2rem; cursor:pointer;">✕</button>
        `;
        taskList.appendChild(li);
    });
    
    const countElement = document.getElementById('taskCount');
    if(countElement) countElement.innerText = tasks.length;
}

function addTask() {
    const t = translations[currentLang];
    const text = taskInput.value.trim();
    const dateInput = taskDate.value.trim();

    if (text === '') {
        alert(t.warningEmpty);
        return;
    }

    // Save task with current priority text
    tasks.push({ 
        text, 
        date: dateInput, 
        priority: prioritySelect.options[prioritySelect.selectedIndex].text 
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    taskDate.value = '';
    renderTasks();
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

// Clear All with language support
document.getElementById('clearAllBtn').onclick = () => {
    if (confirm(currentLang === 'ta' ? "நிச்சயமாக நீக்க வேண்டுமா?" : "Are you sure?")) {
        tasks = [];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
};

addBtn.addEventListener('click', addTask);

// Initial Load
updateLanguage();
// Mic (Speech Recognition) Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    
    // Mic button click panna trigger aagum
    const voiceBtn = document.getElementById('voiceBtn');
    
    voiceBtn.addEventListener('click', () => {
        // Current language-ku thagunthapadi recognition language-ah mathuvom
        recognition.lang = (currentLang === 'ta') ? 'ta-IN' : 'en-US';
        
        recognition.start();
        voiceBtn.style.background = "#ff4b2b"; // Mic on-ah irukkum pothu red color
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('taskInput').value = transcript;
        voiceBtn.style.background = "#888"; // Normal color-ku mathiduvom
    };

    recognition.onerror = () => {
        voiceBtn.style.background = "#888";
        alert("Mic error! Please allow microphone permission in your browser.");
    };

    recognition.onend = () => {
        voiceBtn.style.background = "#888";
    };
} else {
    // Browser support illati mic button-ah hide panniduvom
    document.getElementById('voiceBtn').style.display = 'none';
    console.log("Speech Recognition not supported in this browser.");
}