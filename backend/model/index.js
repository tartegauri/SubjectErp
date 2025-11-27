import sequelize from "../utils/db.js";
import User from "./User.js";
import Subject from "./Subject.js";
import TeacherSubject from "./TeacherSubject.js";
import Enrollment from "./Enrollment.js";
import Assignment from "./Assignment.js";

User.belongsToMany(Subject, { through: TeacherSubject, foreignKey: 'teacherId', as: 'subjects' });
Subject.belongsToMany(User, { through: TeacherSubject, foreignKey: 'subjectId', as: 'teachers' });

User.belongsToMany(Subject, { through: Enrollment, foreignKey: 'studentId', as: 'enrolledSubjects' });
Subject.belongsToMany(User, { through: Enrollment, foreignKey: 'subjectId', as: 'students' });

Assignment.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });
Assignment.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
User.hasMany(Assignment, { foreignKey: 'teacherId', as: 'assignments' });
Subject.hasMany(Assignment, { foreignKey: 'subjectId', as: 'assignments' });

export { User, Subject, TeacherSubject, Enrollment, Assignment };
export default sequelize;

