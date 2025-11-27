import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useStudent from '../../services/useStudent'
import { FiBook, FiFileText, FiAward, FiCalendar, FiPlus } from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi2'

function StudentHome() {
  const { user } = useAuth()
  const student = useStudent()

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'enrolled-subjects'],
    queryFn: student.getMyEnrolledSubjects,
  })

  const enrolledSubjects = data?.subjects || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600">Manage your enrolled subjects</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></span>
              My Enrolled Subjects
            </h2>
            <Link
              to="/student/enroll"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FiPlus className="w-4 h-4" />
              <span>Enroll in Subject</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Loading...</p>
            </div>
          ) : enrolledSubjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                <FiBook className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">You haven't enrolled in any subjects yet.</p>
              <Link
                to="/student/enroll"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <FiPlus className="w-5 h-5" />
                Enroll in a subject →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-6 bg-gradient-to-br from-white to-blue-50/50 border border-gray-200 rounded-xl hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                      <FiBook className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {subject.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{subject.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiAward className="w-4 h-4 text-yellow-600" />
                      <span>{subject.credits} credits</span>
                    </div>
                    {subject.description && (
                      <p className="text-sm text-gray-500 mt-2">{subject.description}</p>
                    )}
                    {subject.Enrollment?.enrolledAt && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
                        <FiCalendar className="w-3 h-3" />
                        <span>Enrolled: {new Date(subject.Enrollment.enrolledAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/student/enroll"
              className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all bg-gradient-to-br from-white to-blue-50/30 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FiFileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Enroll in Subject</h3>
              </div>
              <p className="text-sm text-gray-600">Browse and enroll in available subjects</p>
            </Link>
            <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <HiAcademicCap className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900">View Enrollments</h3>
              </div>
              <p className="text-sm text-gray-600">See all your enrolled subjects above</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentHome
