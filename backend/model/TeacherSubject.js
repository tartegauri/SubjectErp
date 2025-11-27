import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const TeacherSubject = sequelize.define("TeacherSubject", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'TeacherSubjects', // Match Sequelize's default pluralization
    underscored: false, // Use camelCase for column names
    uniqueKeys: {
        teacher_subject_unique: {
            fields: ['teacherId', 'subjectId']
        }
    }
});

export default TeacherSubject;

