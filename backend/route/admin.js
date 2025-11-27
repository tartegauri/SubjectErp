import express from "express";
import {
    getStats,
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    createTeacher,
    getTeachers,
    updateTeacher,
    deleteTeacher,
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject,
    assignSubjectsToTeacher,
    getTeachersWithSubjects,
} from "../controller/admin.js";

const router = express.Router();

router.get("/stats", getStats);

router.post("/create-student", createStudent);
router.get("/students", getStudents);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

router.post("/create-teacher", createTeacher);
router.get("/teachers", getTeachers);
router.put("/teachers/:id", updateTeacher);
router.delete("/teachers/:id", deleteTeacher);
router.get("/teachers-with-subjects", getTeachersWithSubjects);

router.post("/create-subject", createSubject);
router.get("/subjects", getSubjects);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

router.post("/assign-subjects", assignSubjectsToTeacher);

export default router;
