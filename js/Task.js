export class Task {
    id;
name;
done;

constructor(id, name) {
this.id = id;
this.name = name;
this.done = false;
}

toggleDone() {
this.done = !this.done;
}

toObject() {
    return {
id: this.id,
name: this.name,
done: this.done
};
}

static fromObject(obj) {
const task = new Task(obj.id, obj.name);
task.done = obj.done;
return task;
}
}
