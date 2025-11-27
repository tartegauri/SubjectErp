import { User, Subject, TeacherSubject, Enrollment } from "../model/index.js";
import { Op } from "sequelize";

export const getMySubjects = async (req, res) => {
    try {
        const teacherId = req.user.id;

        const teacher = await User.findByPk(teacherId, {
            include: [{
                model: Subject,
                as: "subjects",
                through: { attributes: [] },
                attributes: ["id", "name", "code", "credits", "description"],
            }],
        });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        return res.status(200).json({ subjects: teacher.subjects || [] });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching subjects", error: error.message });
    }
};

export const getMyStudents = async (req, res) => {
    try {
        const teacherId = req.user.id;

        
        const teacher = await User.findByPk(teacherId, {
            include: [{
                model: Subject,
                as: "subjects",
                through: { attributes: [] },
                attributes: ["id"],
            }],
        });

        if (!teacher || !teacher.subjects || teacher.subjects.length === 0) {
            return res.status(200).json({ students: [] });
        }

        const assignedSubjectIds = teacher.subjects.map(subject => subject.id);

        const enrollments = await Enrollment.findAll({
            where: {
                subjectId: {
                    [Op.in]: assignedSubjectIds,
                },
            },
        });

        const studentIds = [...new Set(enrollments.map(e => e.studentId))];

        if (studentIds.length === 0) {
            return res.status(200).json({ students: [] });
        }

        const students = await User.findAll({
            where: {
                id: { [Op.in]: studentIds },
                role: "student",
            },
            attributes: ["id", "name", "email", "phone"],
            include: [{
                model: Subject,
                as: "enrolledSubjects",
                through: { attributes: [] },
                where: {
                    id: { [Op.in]: assignedSubjectIds },
                },
                attributes: ["id", "name", "code", "credits"],
                required: false,
            }],
        });

        const formattedStudents = students.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            enrolledSubjects: student.enrolledSubjects || [],
        }));

        return res.status(200).json({ students: formattedStudents });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};

export const getMyEnrollments = async (req, res) => {
    try {
        const teacherId = req.user.id;

        
        const teacher = await User.findByPk(teacherId, {
            include: [{
                model: Subject,
                as: "subjects",
                through: { attributes: [] },
                attributes: ["id", "name", "code", "credits"],
                include: [{
                    model: User,
                    as: "students",
                    through: { attributes: ["enrolledAt"] },
                    attributes: ["id", "name", "email"],
                    required: false,
                }],
            }],
        });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const subjectsWithEnrollments = (teacher.subjects || []).map(subject => ({
            id: subject.id,
            name: subject.name,
            code: subject.code,
            credits: subject.credits,
            students: subject.students || [],
            studentCount: subject.students ? subject.students.length : 0,
        }));

        return res.status(200).json({ subjects: subjectsWithEnrollments });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching enrollments", error: error.message });
    }
};

