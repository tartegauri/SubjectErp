import { User, Subject, Enrollment } from "../model/index.js";
import { Op } from "sequelize";

export const getAvailableSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            include: [{
                model: User,
                as: "teachers",
                through: { attributes: [] },
                attributes: ["id", "name", "email"],
                required: false,
            }],
            order: [['name', 'ASC']],
        });

        const subjectsWithTeacher = subjects.map(subject => {
            const subjectData = subject.toJSON();
            return {
                ...subjectData,
                teacher: subjectData.teachers && subjectData.teachers.length > 0
                    ? subjectData.teachers[0].name
                    : "Not assigned",
            };
        });

        return res.status(200).json({ subjects: subjectsWithTeacher });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching subjects", error: error.message });
    }
};

export const getMyEnrolledSubjects = async (req, res) => {
    try {
        const studentId = req.user.id;

        const student = await User.findByPk(studentId, {
            include: [{
                model: Subject,
                as: "enrolledSubjects",
                through: { attributes: ["enrolledAt"] },
                attributes: ["id", "name", "code", "credits", "description"],
            }],
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json({ subjects: student.enrolledSubjects || [] });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching enrolled subjects", error: error.message });
    }
};

export const enrollInSubject = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { subjectId } = req.body;

        if (!subjectId) {
            return res.status(400).json({ message: "Subject ID is required" });
        }

        const subject = await Subject.findByPk(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        const existingEnrollment = await Enrollment.findOne({
            where: {
                studentId,
                subjectId,
            },
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this subject" });
        }

        const enrollment = await Enrollment.create({
            studentId,
            subjectId,
        });

        // Return updated enrolled subjects
        const student = await User.findByPk(studentId, {
            include: [{
                model: Subject,
                as: "enrolledSubjects",
                through: { attributes: ["enrolledAt"] },
                attributes: ["id", "name", "code", "credits", "description"],
            }],
        });

        return res.status(201).json({
            message: "Successfully enrolled in subject",
            enrollment,
            subjects: student.enrolledSubjects || [],
        });
    } catch (error) {
        return res.status(500).json({ message: "Error enrolling in subject", error: error.message });
    }
};

export const unenrollFromSubject = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { subjectId } = req.params;

        const enrollment = await Enrollment.findOne({
            where: {
                studentId,
                subjectId,
            },
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        await enrollment.destroy();

        const student = await User.findByPk(studentId, {
            include: [{
                model: Subject,
                as: "enrolledSubjects",
                through: { attributes: ["enrolledAt"] },
                attributes: ["id", "name", "code", "credits", "description"],
            }],
        });

        return res.status(200).json({
            message: "Successfully unenrolled from subject",
            subjects: student.enrolledSubjects || [],
        });
    } catch (error) {
        return res.status(500).json({ message: "Error unenrolling from subject", error: error.message });
    }
};

