document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('taskList');
    const clearBtn = document.getElementById('clear-btn');

    // 1. INITIAL LOAD: Clear the list UI first, then load from storage
    const savedTasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    taskList.innerHTML = ""; // Prevents duplicates on refresh
    savedTasks.forEach(taskText => renderTask(taskText));
    updateCounter(); // Set initial count

    // 2. ADD TASK: Triggered by button click
    addBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        renderTask(taskText); 
        saveTask(taskText);   
        
        // FIX: This clears the text box so "pizza" doesn't stay visible inside the input
        taskInput.value = ""; 
        
        updateCounter(); 
    });

    // 3. ENTER KEY: Allows adding tasks faster
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });

    // 4. CLEAR ALL: Deletes everything
    clearBtn.addEventListener('click', () => {
        if(confirm("Delete everything?")) {
            taskList.innerHTML = "";
            localStorage.removeItem('myTasks');
            updateCounter();
        }
    });
});

// --- GLOBAL FUNCTIONS (Must be outside the block above) ---

function renderTask(text) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.innerHTML = `
        <span onclick="toggleTask(this)">${text}</span>
        <button class="delete-btn" onclick="deleteTask(this)">X</button>
    `;
    taskList.appendChild(li);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks.push(task);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function deleteTask(element) {
    const li = element.parentElement;
    const textToRemove = li.querySelector('span').innerText;
    li.remove(); 

    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks = tasks.filter(t => t !== textToRemove);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    
    updateCounter(); // Important: Update count after deleting!
}

function toggleTask(element) {
    element.classList.toggle('completed');
}

// THE COUNTER: This is the fix for "Tasks remaining: 0"
function updateCounter() {
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    if (taskList && taskCount) {
        taskCount.innerText = taskList.children.length;
    }
}
// Add task logic-ku keela idha podunga
taskInput.value = "";