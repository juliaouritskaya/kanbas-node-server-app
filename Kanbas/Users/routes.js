import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const findAllUsers = (req, res) => {
        const users = dao.findAllUsers();
        res.json(users);
    };

    const findUsersByCourse = (req, res) => {
        const { courseId } = req.params;

        console.log("Request received for courseId:", courseId);

        const enrollments = enrollmentsDao.findEnrollmentsByCourse(courseId);
        console.log("Enrollments for course:", enrollments);

        if (!enrollments || enrollments.length === 0) {
            console.error("No enrollments found for this course");
            return res.status(404).json({ message: "No enrollments found for this course" });
        }

        const enrolledUsers = enrollments
            .map((enrollment) => dao.findUserById(enrollment.user))
            .filter((user) => user !== undefined);

        console.log("Enrolled users:", enrolledUsers);

        if (enrolledUsers.length === 0) {
            console.error("No users found for this course");
            return res.status(404).json({ message: "No users found for this course" });
        }

        res.json(enrolledUsers);
    };

    const findUserById = (req, res) => {
        const { userId } = req.params;
        const user = dao.findUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send("User not found");
        }
    };

    const createUser = (req, res) => {
        const newUser = dao.createUser(req.body);
        res.status(201).json(newUser);
    };

    const deleteUser = (req, res) => {
        const { userId } = req.params;
        dao.deleteUser(userId);
        res.status(204).send();
    };
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = (req, res) => {
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };

    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };

    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/course/:courseId", findUsersByCourse);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}

