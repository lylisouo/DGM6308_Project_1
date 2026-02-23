import { TaskManager } from "./TaskManager.js";
import { Storage } from "./Storage.js";

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
allButtons[i].addEventListener("mouseenter", function () {
this.style.transform = "translateY(-2px)";
});
allButtons[i].addEventListener("mouseleave", function () {
this.style.transform = "translateY(0)";
});
}

function showMessage(text, color) {
messageElement.textContent = text;
messageElement.style.color = color;
}

function render() {
taskListElement.innerHTML = "";
const shouldHide = hideCheckbox.checked;

for (let i = 0; i < manager.tasks.length; i++) {
const task = manager.tasks[i];
if (shouldHide && task.done) continue;
const li = document.createElement("li");
li.className = task.done ? "card done" : "card";
li.dataset.taskId = task.id;
li.innerHTML = '<span class="task-text"></span><span class="status"></span>';
li.querySelector(".task-text").textContent = task.name;
li.querySelector(".status").textContent = task.done ? "✓ Done" : "Click to complete";
taskListElement.appendChild(li);
}

completedCountElement.textContent = manager.countCompleted();
totalCountElement.textContent = manager.tasks.length;
storage.save(manager);
}

// Project 2 requirement: invalid action + throw + try/catch + show message on page
function validateTaskName(taskName) {
if (taskName === "") {
throw new Error("Task name cannot be empty.");
}
if (taskName.length > 60) {
throw new Error("Task name is too long (max 60 characters).");
}
}

form.addEventListener("submit", function (evt) {
evt.preventDefault();

try {
const taskName = inputField.value.trim();
validateTaskName(taskName); // can throw error
manager.addTask(taskName);
inputField.value = "";

if (evt.target && evt.target.tagName === "FORM") {
showMessage("Task added! Click it to mark as done.", "#81c784");
}
render();
} catch (error) {
// Show exception message on actual webpage (not only console)
showMessage(error.message, "#e57373");
}
});

taskListElement.addEventListener("click", function (evt) {
    const clickedElement = evt.target;
const li = clickedElement.closest("li");
if (!li) return;

const taskId = li.dataset.taskId;
const task = manager.findById(taskId);
if (task) {
task.toggleDone();
render();
}
});

hideCheckbox.addEventListener("change", function () {
render();
});
clearButton.addEventListener("click", function (evt) {
evt.preventDefault();
manager.clearCompleted();
showMessage("Completed tasks cleared!", "#b0bec5");
render();
});

render();
