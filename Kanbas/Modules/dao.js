import Database from "../Database/index.js";

export function updateModule(moduleId, moduleUpdates) {
    const { modules } = Database;

    const module = modules.find((module) => module._id === moduleId);
    Object.assign(module, moduleUpdates);
    return module;
}

export function deleteModule(moduleId) {
    const { modules } = Database;
    Database.modules = modules.filter((module) => module._id !== moduleId);
}

export function createModule(module) {
    const newModule = { ...module, _id: Date.now().toString(), editing: false };
    Database.modules = [...Database.modules, newModule];
    console.log("Modules after creation:", Database.modules); // Debug log
    return newModule;
}

export function findModulesForCourse(courseId) {
    const { modules } = Database;
    return modules.filter((module) => module.course === courseId);
}
