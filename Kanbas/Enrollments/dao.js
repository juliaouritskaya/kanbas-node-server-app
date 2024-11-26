import Database from "../Database/index.js";

export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    const newEnrollment = {
        _id: Date.now().toString(),
        user: userId,
        course: courseId,
    };
    Database.enrollments = [...enrollments, newEnrollment];
    return newEnrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = Database;
    Database.enrollments = enrollments.filter(
        (enrollment) => enrollment.user !== userId || enrollment.course !== courseId
    );
}

export function findEnrollmentsForUser(userId) {
    const { enrollments, courses } = Database;
    const userEnrollments = enrollments.filter((enrollment) => enrollment.user === userId);
    return userEnrollments.map((enrollment) =>
                                   courses.find((course) => course._id === enrollment.course)
    );
}

export function findEnrollmentsByCourse(courseId) {
    const { enrollments } = Database;
    console.log("Database enrollments:", enrollments); // Log all enrollments
    return enrollments.filter((enrollment) => enrollment.course === courseId);
}