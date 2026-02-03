// This class is for store the task name and whether it's done or not.
class Task {
  id;
  name;
  done;

  // Constructor runs when I create a new task with "new Task(...)", sets up the initial values for the task.
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.done = false;
  }

  // If it was false, make it true. If it was true, make it false.
  toggleDone() {
    this.done = !this.done;
  }

  // Convert this task to a simple object so I can save it
  toObject() {
    return {
      id: this.id,
      name: this.name,
      done: this.done
    };
  }
}

// This class manages all my tasks - adding, removing, counting them.
class TaskManager {
  tasks;
  nextId;

// Start with an empty task list
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

// Add a new task to my list
  addTask(name) {
    const id = "task_" + this.nextId;
    this.nextId++;
    const task = new Task(id, name);
    this.tasks.push(task);
    return task;
  }

// Remove all tasks that are marked as done
  clearCompleted() {
    this.tasks = this.tasks.filter(function(t) {
      return t.done === false;
    });
  }

// This is for count how many tasks are completed
  countCompleted() {
    let count = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].done) {
        count++;
      }
    }
    return count;
  }

  findById(id) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === id) {
        return this.tasks[i];
      }
    }
    return null;
  }
}

// This class saves and loads data using the browser's localStorage. So when I close the browser and come back, my tasks are still there.
class Storage {
  storageKey;
  isEnabled;

  constructor(key) {
    this.storageKey = key;
    this.isEnabled = true;
  }

// Save the task manager's data to localStorage
  save(manager) {
    if (!this.isEnabled) return;
    
    const dataToSave = [];
    for (let i = 0; i < manager.tasks.length; i++) {
      dataToSave.push(manager.tasks[i].toObject());
    }
    
// Save as a JSON string
    const jsonString = JSON.stringify(dataToSave);
    window.localStorage.setItem(this.storageKey, jsonString);
  }

  load(manager) {
    if (!this.isEnabled) return;
    
    const jsonString = window.localStorage.getItem(this.storageKey);
    if (!jsonString) return;
    
    try {
      const savedData = JSON.parse(jsonString);
      
      // Recreate each task from the saved data
      for (let i = 0; i < savedData.length; i++) {
        const item = savedData[i];
        const task = new Task(item.id, item.name);
        task.done = item.done;
        manager.tasks.push(task);
        
        // Update nextId so new tasks don't have duplicate IDs
        const numPart = parseInt(item.id.replace("task_", ""));
        if (numPart >= manager.nextId) {
          manager.nextId = numPart + 1;
        }
      }
    } catch (e) {

      console.log("Could not load saved tasks");
    }
  }
}

// MAIN APP CODE

const manager = new TaskManager();
const storage = new Storage("my_todo_list");

storage.load(manager);

// Find elements by their ID
const form = document.getElementById("taskForm");
const inputField = document.getElementById("taskInput");
const taskListElement = document.getElementById("taskList");
const completedCountElement = document.getElementById("completedCount");
const totalCountElement = document.getElementById("totalCount");
const messageElement = document.getElementById("message");
const clearButton = document.getElementById("clearBtn");

// Find an element with CSS selector
const hideCheckbox = document.querySelector("#hideCompleted");

// Find elements by class name
const cards = document.getElementsByClassName("card");

// Find multiple elements
const allButtons = document.querySelectorAll("button");

// Add a little hover effect to all buttons
for (let i = 0; i < allButtons.length; i++) {
  allButtons[i].addEventListener("mouseenter", function() {
    this.style.transform = "translateY(-2px)";
  });
  allButtons[i].addEventListener("mouseleave", function() {
    this.style.transform = "translateY(0)";
  });
}


// Function to show a message to the user, if a new task is added.
function showMessage(text, color) {
  messageElement.textContent = text;
  messageElement.style.color = color;
}


function render() {
  taskListElement.innerHTML = "";

  const shouldHide = hideCheckbox.checked;
  
  // Go through each task and create an element for it
  for (let i = 0; i < manager.tasks.length; i++) {
    const task = manager.tasks[i];
    
    // Skip completed tasks if "hide completed" is checked
    if (shouldHide && task.done) {
      continue;
    }
    
    // Create a list item
    const li = document.createElement("li");
    li.className = "card";
    if (task.done) {
      li.className = "card done";
    }
    li.dataset.taskId = task.id;
    li.innerHTML = '<span class="task-text"></span><span class="status"></span>';
    li.querySelector(".task-text").textContent = task.name;
    li.querySelector(".status").textContent = task.done ? "✓ Done" : "Click to complete";
    
    taskListElement.appendChild(li);
  }
  
  // Update the counts
  completedCountElement.textContent = manager.countCompleted();
  totalCountElement.textContent = manager.tasks.length;
  
  // Save to localStorage
  storage.save(manager);
}


// When a form is submitted
form.addEventListener("submit", function(evt) {
  evt.preventDefault();
  
  const taskName = inputField.value.trim();
  
  // Check if user actually typed something
  if (taskName === "") {
    showMessage("Please enter a task name!", "#e57373");
    return;
  }
  

  manager.addTask(taskName);
  
  inputField.value = "";
  
  // Show success message
  if (evt.target && evt.target.tagName === "FORM") {
    showMessage("Task added! Click it to mark as done.", "#81c784");
  }
  
  // Re-render the list
  render();
});


// When a task is clicked
taskListElement.addEventListener("click", function(evt) {

  const clickedElement = evt.target;
  const li = clickedElement.closest("li");
  
  if (!li) return;
  
  // Get the task ID
  const taskId = li.dataset.taskId;
  
  // Find the task and toggle its done
  const task = manager.findById(taskId);
  if (task) {
    task.toggleDone();
    render();
  }
});


// When "Hide completed" checkbox changes
hideCheckbox.addEventListener("change", function() {
  render();
});


// When "Clear completed" button is clicked
clearButton.addEventListener("click", function(evt) {
  evt.preventDefault();
  manager.clearCompleted();
  showMessage("Completed tasks cleared!", "#b0bec5");
  render();
});


// When page loads
render();
