import express from "express";
import { getMySubjects, getMyStudents, getMyEnrollments } from "../controller/teacher.js";
import { uploadAssignment, getAssignments, deleteAssignment } from "../controller/assignment.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/subjects", getMySubjects);
router.get("/students", getMyStudents);
router.get("/enrollments", getMyEnrollments);

router.post("/assignments/upload", upload.single('file'), uploadAssignment);
router.get("/assignments", getAssignments);
router.delete("/assignments/:id", deleteAssignment);

export default router;
