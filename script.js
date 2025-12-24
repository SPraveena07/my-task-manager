const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const dateDisplay = document.getElementById('dateDisplay');

// Show current date
dateDisplay.innerText = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
});

// Add Task Button Click
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;

    // YOUR ALERT LOGIC
    if (text === "") {
        alert("Please enter the task! 😊");
        return;
    }

    createTask(text, priority);
    taskInput.value = ""; // Clear input
    updateCounter();
});

// Create Task Element
function createTask(text, priority) {
    const li = document.createElement('li');
    li.className = priority; // Add priority class for border color

    li.innerHTML = `
        <div class="task-info">
            <span class="task-text">${text}</span>
            <span class="priority-label">${priority} Priority</span>
        </div>
        <button class="delete-btn">✕</button>
    `;

    // Delete Button (Right side)
    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        updateCounter();
    });

    taskList.appendChild(li);
}

// Update Counter
function updateCounter() {
    taskCount.innerText = taskList.children.length;
}

// Clear All Functionality
clearAllBtn.addEventListener('click', () => {
    if (taskList.children.length === 0) return;
    
    if (confirm("Are you sure you want to clear all tasks?")) {
        taskList.innerHTML = "";
        updateCounter();
    }
});