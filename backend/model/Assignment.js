import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Assignment = sequelize.define("Assignment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Subjects',
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filePublicId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: false, // pdf, image, doc, pptx
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true, // Size in bytes
    },
    uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Assignments',
    timestamps: true,
});

export default Assignment;

