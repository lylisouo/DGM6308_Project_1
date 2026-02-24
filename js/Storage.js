import { Task } from "./Task.js";

// Here saves/loads data from localStorage.
export class Storage {
storageKey;
isEnabled;

constructor(key) {
this.storageKey = key;
this.isEnabled = true;
}

save(manager) {
if (!this.isEnabled) return;
const dataToSave = [];
for (let i = 0; i < manager.tasks.length; i++) {
dataToSave.push(manager.tasks[i].toObject());
}

const jsonString = JSON.stringify(dataToSave);
window.localStorage.setItem(this.storageKey, jsonString);
}

load(manager) {
if (!this.isEnabled) return;

const jsonString = window.localStorage.getItem(this.storageKey);
if (!jsonString) return;
try {
const savedData = JSON.parse(jsonString);

for (let i = 0; i < savedData.length; i++) {
const item = savedData[i];
const task = Task.fromObject(item);
manager.tasks.push(task);

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
