import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import useTeacher from '../../services/useTeacher'
import { FiBook, FiUsers, FiFileText } from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi2'

function TeacherHome() {
  const { user } = useAuth()
  const teacher = useTeacher()

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['teacher', 'subjects'],
    queryFn: teacher.getMySubjects,
  })

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['teacher', 'students'],
    queryFn: teacher.getMyStudents,
  })

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['teacher', 'enrollments'],
    queryFn: teacher.getMyEnrollments,
  })

  const totalSubjects = subjectsData?.subjects?.length || 0
  const totalStudents = studentsData?.students?.length || 0
  const totalEnrollments = enrollmentsData?.subjects?.reduce((sum, subject) => sum + (subject.studentCount || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome, {user?.name || 'Teacher'}!
          </h1>
          <p className="text-gray-600">Manage your classes and students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Assigned Subjects</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {subjectsLoading ? '...' : totalSubjects}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl">
                <FiBook className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">My Students</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {studentsLoading ? '...' : totalStudents}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                <FiUsers className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Enrollments</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {enrollmentsLoading ? '...' : totalEnrollments}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                <FiFileText className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"></span>
            Quick Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-indigo-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FiBook className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">View Subjects</h3>
              </div>
              <p className="text-sm text-gray-600">See all subjects assigned to you</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-indigo-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">View Students</h3>
              </div>
              <p className="text-sm text-gray-600">See students enrolled in your subjects</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-indigo-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FiFileText className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900">View Enrollments</h3>
              </div>
              <p className="text-sm text-gray-600">See enrollment details by subject</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-indigo-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <HiAcademicCap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Note</h3>
              </div>
              <p className="text-sm text-gray-600">Contact admin to get subjects assigned to you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherHome
