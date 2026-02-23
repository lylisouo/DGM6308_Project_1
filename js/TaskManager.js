import { Task } from "./Task.js";

// This class manages all tasks.
export class TaskManager {
tasks;
nextId;

constructor() {
this.tasks = [];
this.nextId = 1;
}

addTask(name) {
const id = "task_" + this.nextId;
this.nextId++;
const task = new Task(id, name);
this.tasks.push(task);
return task;
}

clearCompleted() {
this.tasks = this.tasks.filter(function (t) {
return t.done === false;
});
}

countCompleted() {
let count = 0;
for (let i = 0; i < this.tasks.length; i++) {
if (this.tasks[i].done) count++;
}
return count;
}

findById(id) {
for (let i = 0; i < this.tasks.length; i++) {
if (this.tasks[i].id === id) return this.tasks[i];
}
return null;
}
}