import { User, Subject, TeacherSubject, Enrollment } from "../model/index.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export const getStats = async (req, res) => {
    try {
        const totalStudents = await User.count({ where: { role: "student" } });
        const totalTeachers = await User.count({ where: { role: "teacher" } });
        const totalSubjects = await Subject.count();
        const totalEnrollments = await Enrollment.count();

        return res.status(200).json({
            totalStudents,
            totalTeachers,
            totalSubjects,
            totalEnrollments,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
};

export const createStudent = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student",
            phone: phone || null,
            address: address || null,
        });

        return res.status(201).json({ message: "Student created successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error creating student", error: error.message });
    }
};

export const getStudents = async (req, res) => {
    try {
        const students = await User.findAll({
            where: { role: "student" },
            attributes: { exclude: ["password"] },
            include: [{
                model: Subject,
                as: "enrolledSubjects",
                through: { attributes: [] },
                attributes: ["id", "name", "code"],
            }],
        });

        const studentsWithCount = students.map(student => ({
            ...student.toJSON(),
            enrolledCount: student.enrolledSubjects?.length || 0,
        }));

        return res.status(200).json({ students: studentsWithCount });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, address } = req.body;

        const updateData = { name, email, phone, address };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await User.update(updateData, { where: { id, role: "student" } });
        const student = await User.findByPk(id, { attributes: { exclude: ["password"] } });

        return res.status(200).json({ message: "Student updated successfully", student });
    } catch (error) {
        return res.status(500).json({ message: "Error updating student", error: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id, role: "student" } });
        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting student", error: error.message });
    }
};

export const createTeacher = async (req, res) => {
    try {
        const { name, email, password, phone, department } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "teacher",
            phone: phone || null,
            department: department || null,
        });

        return res.status(201).json({ message: "Teacher created successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error creating teacher", error: error.message });
    }
};

export const getTeachers = async (req, res) => {
    try {
        const teachers = await User.findAll({
            where: { role: "teacher" },
            attributes: { exclude: ["password"] },
            include: [{
                model: Subject,
                as: "subjects",
                through: { attributes: [] },
                attributes: ["id", "name", "code"],
            }],
        });

        const teachersWithCount = teachers.map(teacher => ({
            ...teacher.toJSON(),
            subjectsCount: teacher.subjects?.length || 0,
        }));

        return res.status(200).json({ teachers: teachersWithCount });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, phone, department } = req.body;

        const updateData = { name, email, phone, department };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await User.update(updateData, { where: { id, role: "teacher" } });
        const teacher = await User.findByPk(id, { attributes: { exclude: ["password"] } });

        return res.status(200).json({ message: "Teacher updated successfully", teacher });
    } catch (error) {
        return res.status(500).json({ message: "Error updating teacher", error: error.message });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id, role: "teacher" } });
        return res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting teacher", error: error.message });
    }
};

export const createSubject = async (req, res) => {
    try {
        const { name, code, credits, description } = req.body;
        
        const existingSubject = await Subject.findOne({ where: { code } });
        if (existingSubject) {
            return res.status(400).json({ message: "Subject code already exists" });
        }

        const subject = await Subject.create({
            name,
            code: code.toUpperCase(),
            credits: parseInt(credits) || 3,
            description: description || null,
        });

        return res.status(201).json({ message: "Subject created successfully", subject });
    } catch (error) {
        return res.status(500).json({ message: "Error creating subject", error: error.message });
    }
};

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            include: [{
                model: User,
                as: "teachers",
                through: { attributes: [] },
                attributes: ["id", "name", "email"],
            }],
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

export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, credits, description } = req.body;

        const updateData = { name, description };
        if (code) {
            updateData.code = code.toUpperCase();
        }
        if (credits) {
            updateData.credits = parseInt(credits);
        }

        await Subject.update(updateData, { where: { id } });
        const subject = await Subject.findByPk(id);

        return res.status(200).json({ message: "Subject updated successfully", subject });
    } catch (error) {
        return res.status(500).json({ message: "Error updating subject", error: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await Subject.destroy({ where: { id } });
        return res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting subject", error: error.message });
    }
};

export const assignSubjectsToTeacher = async (req, res) => {
    try {
        const { teacherId, subjectIds } = req.body;

        if (!teacherId || !Array.isArray(subjectIds) || subjectIds.length === 0) {
            return res.status(400).json({ message: "Teacher ID and subject IDs are required" });
        }

        const teacher = await User.findOne({ where: { id: teacherId, role: "teacher" } });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        await TeacherSubject.destroy({ where: { teacherId } });

        const assignments = subjectIds.map(subjectId => ({
            teacherId,
            subjectId,
        }));

        await TeacherSubject.bulkCreate(assignments);

        const teacherWithSubjects = await User.findByPk(teacherId, {
            attributes: { exclude: ["password"] },
            include: [{
                model: Subject,
                as: "subjects",
                through: { attributes: [] },
                attributes: ["id", "name", "code"],
            }],
        });

        return res.status(200).json({
            message: "Subjects assigned successfully",
            teacher: teacherWithSubjects,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error assigning subjects", error: error.message });
    }
};

export const getTeachersWithSubjects = async (req, res) => {
    try {
        const teachers = await User.findAll({
            where: { role: "teacher" },
            attributes: { exclude: ["password"] },
            include: [{
                model: Subject,
                as: "subjects",
                through: { attributes: [] },
                attributes: ["id", "name", "code"],
            }],
        });

        return res.status(200).json({ teachers });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching teachers", error: error.message });
    }
};
