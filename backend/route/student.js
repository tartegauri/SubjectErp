import express from "express";
import {
    getAvailableSubjects,
    getMyEnrolledSubjects,
    enrollInSubject,
    unenrollFromSubject,
} from "../controller/student.js";

const router = express.Router();

router.get("/subjects", getAvailableSubjects);
router.get("/enrolled-subjects", getMyEnrolledSubjects);
router.post("/enroll", enrollInSubject);
router.delete("/unenroll/:subjectId", unenrollFromSubject);

export default router;
