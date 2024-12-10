import model from "./model.js";

export async function createAssignment(assignment) {
    try {
        const newAssignment = await model.create(assignment);
        return newAssignment;
    } catch (error) {
        console.error("Error creating assignment:", error);
        throw error;
    }
}

export async function findAssignmentsForCourse(courseId) {
    try {
        const assignments = await model.find({ course: courseId });
        return assignments;
    } catch (error) {
        console.error("Error finding assignments for course:", error);
        throw error;
    }
}

export async function updateAssignment(assignmentId, assignmentUpdates) {
    try {
        const updatedAssignment = await model.findByIdAndUpdate(
            assignmentId,
            assignmentUpdates,
            { new: true }
        );
        return updatedAssignment;
    } catch (error) {
        console.error("Error updating assignment:", error);
        throw error;
    }
}

export async function deleteAssignment(assignmentId) {
    try {
        await model.findByIdAndDelete(assignmentId);
    } catch (error) {
        console.error("Error deleting assignment:", error);
        throw error;
    }
}