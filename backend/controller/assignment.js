import Assignment from "../model/Assignment.js";
import User from "../model/User.js";
import Subject from "../model/Subject.js";
import TeacherSubject from "../model/TeacherSubject.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const uploadAssignment = async (req, res) => {
  try {
    const { subjectId, title, description } = req.body;
    const file = req.file;
    const teacherId = req.user.id;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!subjectId || !title) {
      return res.status(400).json({ message: "Missing required fields: subjectId, title" });
    }

    const teacherSubject = await TeacherSubject.findOne({
      where: { teacherId: parseInt(teacherId), subjectId: parseInt(subjectId) },
    });

    if (!teacherSubject) {
      return res.status(403).json({ message: "Teacher is not assigned to this subject" });
    }

    const allowedTypes = {
      'application/pdf': 'pdf',
      'image/jpeg': 'image',
      'image/jpg': 'image',
      'image/png': 'image',
      'image/gif': 'image',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    };

    const fileType = allowedTypes[file.mimetype] || 'other';

    const uploadResult = await uploadToCloudinary(file, `assignments/${teacherId}/${subjectId}`, {
      resource_type: fileType === 'image' ? 'image' : 'raw',
      use_filename: true,
      unique_filename: true,
    });

    const assignment = await Assignment.create({
      teacherId: parseInt(teacherId),
      subjectId: parseInt(subjectId),
      title,
      description: description || null,
      fileUrl: uploadResult.secure_url,
      filePublicId: uploadResult.public_id,
      fileName: file.originalname,
      fileType: fileType,
      fileSize: uploadResult.bytes || file.size,
    });

    const assignmentWithRelations = await Assignment.findByPk(assignment.id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
      ],
    });

    return res.status(201).json({
      message: "Assignment uploaded successfully",
      assignment: assignmentWithRelations,
    });
  } catch (error) {
    console.error("Error uploading assignment:", error);
    return res.status(500).json({ message: "Error uploading assignment", error: error.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const teacherId = req.user.id;

    const whereClause = { teacherId: parseInt(teacherId) };
    if (subjectId) {
      whereClause.subjectId = parseInt(subjectId);
    }

    const assignments = await Assignment.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
      ],
      order: [['uploadedAt', 'DESC']],
    });

    return res.status(200).json({
      assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const assignment = await Assignment.findByPk(id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.teacherId !== parseInt(teacherId)) {
      return res.status(403).json({ message: "You don't have permission to delete this assignment" });
    }

    try {
      await deleteFromCloudinary(assignment.filePublicId);
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
    }

    await assignment.destroy();

    return res.status(200).json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return res.status(500).json({ message: "Error deleting assignment", error: error.message });
  }
};

