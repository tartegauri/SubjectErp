export const host = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiUrls = {
    login: `${host}/login`,
    
    adminStats: `${host}/admin/stats`,
    
    adminCreateStudent: `${host}/admin/create-student`,
    adminGetStudents: `${host}/admin/students`,
    adminUpdateStudent: (id) => `${host}/admin/students/${id}`,
    adminDeleteStudent: (id) => `${host}/admin/students/${id}`,
    
    adminCreateTeacher: `${host}/admin/create-teacher`,
    adminGetTeachers: `${host}/admin/teachers`,
    adminGetTeachersWithSubjects: `${host}/admin/teachers-with-subjects`,
    adminUpdateTeacher: (id) => `${host}/admin/teachers/${id}`,
    adminDeleteTeacher: (id) => `${host}/admin/teachers/${id}`,
    
    adminCreateSubject: `${host}/admin/create-subject`,
    adminGetSubjects: `${host}/admin/subjects`,
    adminUpdateSubject: (id) => `${host}/admin/subjects/${id}`,
    adminDeleteSubject: (id) => `${host}/admin/subjects/${id}`,
    
    adminAssignSubjects: `${host}/admin/assign-subjects`,
    
    studentGetSubjects: `${host}/student/subjects`,
    studentGetEnrolledSubjects: `${host}/student/enrolled-subjects`,
    studentEnroll: `${host}/student/enroll`,
    studentUnenroll: (subjectId) => `${host}/student/unenroll/${subjectId}`,
    
    teacherGetSubjects: `${host}/teacher/subjects`,
    teacherGetStudents: `${host}/teacher/students`,
    teacherGetEnrollments: `${host}/teacher/enrollments`,
    
    teacherUploadAssignment: `${host}/teacher/assignments/upload`,
    teacherGetAssignments: `${host}/teacher/assignments`,
    teacherDeleteAssignment: (id) => `${host}/teacher/assignments/${id}`,
}