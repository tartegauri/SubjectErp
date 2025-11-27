import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import TeacherLayout from './components/TeacherLayout'
import StudentLayout from './components/StudentLayout'
import AdminHome from './pages/admin/AdminHome'
import AdminSubjects from './pages/admin/AdminSubjects'
import AdminSubjectsAdd from './pages/admin/AdminSubjectsAdd'
import AdminTeachers from './pages/admin/AdminTeachers'
import AdminTeachersAdd from './pages/admin/AdminTeachersAdd'
import AdminAssignSubjects from './pages/admin/AdminAssignSubjects'
import AdminStudents from './pages/admin/AdminStudents'
import AdminStudentsAdd from './pages/admin/AdminStudentsAdd'
import TeacherHome from './pages/teacher/TeacherHome'
import TeacherSubjects from './pages/teacher/TeacherSubjects'
import TeacherSubjectsAdd from './pages/teacher/TeacherSubjectsAdd'
import TeacherStudents from './pages/teacher/TeacherStudents'
import TeacherStudentsAdd from './pages/teacher/TeacherStudentsAdd'
import TeacherEnrollments from './pages/teacher/TeacherEnrollments'
import StudentHome from './pages/student/StudentHome'
import StudentEnroll from './pages/student/StudentEnroll'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/admin"
        element={
          <AdminLayout />
        }
      >
        <Route index element={<Navigate to="/admin/home" replace />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="subjects/add" element={<AdminSubjectsAdd />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="teachers/add" element={<AdminTeachersAdd />} />
        <Route path="assign" element={<AdminAssignSubjects />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="students/add" element={<AdminStudentsAdd />} />
      </Route>
      
      <Route
        path="/teacher"
        element={
          <TeacherLayout />
        }
      >
        <Route index element={<Navigate to="/teacher/home" replace />} />
        <Route path="home" element={<TeacherHome />} />
        <Route path="subjects" element={<TeacherSubjects />} />
        <Route path="subjects/add" element={<TeacherSubjectsAdd />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="students/add" element={<TeacherStudentsAdd />} />
        <Route path="enrollments" element={<TeacherEnrollments />} />
      </Route>

      <Route
        path="/student"
        element={
          <StudentLayout />
        }
      >
        <Route index element={<Navigate to="/student/home" replace />} />
        <Route path="home" element={<StudentHome />} />
        <Route path="enroll" element={<StudentEnroll />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
