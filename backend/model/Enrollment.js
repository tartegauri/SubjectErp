import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const Enrollment = sequelize.define("Enrollment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    enrolledAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Enrollments', // Explicitly set table name
    uniqueKeys: {
        student_subject_unique: {
            fields: ['studentId', 'subjectId']
        }
    }
});

export default Enrollment;

