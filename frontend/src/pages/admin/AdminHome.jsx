import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import useAdmin from '../../services/useAdmin'
import { FiUsers, FiBook, FiFileText } from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

function AdminHome() {
  const { user } = useAuth()
  const admin = useAdmin()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: admin.getStats,
  })

  const quickActions = [
    { 
      path: '/admin/subjects/add', 
      title: 'Create Subject', 
      description: 'Add a new subject to the system',
      icon: FiBook,
      gradient: 'from-purple-500 to-indigo-600'
    },
    { 
      path: '/admin/teachers/add', 
      title: 'Add Teacher', 
      description: 'Register a new teacher account',
      icon: HiAcademicCap,
      gradient: 'from-blue-500 to-cyan-600'
    },
    { 
      path: '/admin/assign', 
      title: 'Assign Subjects', 
      description: 'Assign subjects to teachers',
      icon: FiFileText,
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      path: '/admin/students/add', 
      title: 'Add Student', 
      description: 'Add a new student to the system',
      icon: FiUsers,
      gradient: 'from-pink-500 to-rose-600'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome, {user?.name || 'Admin'}!
          </h1>
          <p className="text-gray-600">Manage your school system efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {isLoading ? '...' : stats?.totalStudents || 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                <FiUsers className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Teachers</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {isLoading ? '...' : stats?.totalTeachers || 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                <HiAcademicCap className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Subjects</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {isLoading ? '...' : stats?.totalSubjects || 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                <FiBook className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Enrollments</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {isLoading ? '...' : stats?.totalEnrollments || 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
                <FiFileText className="w-8 h-8 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  to={action.path}
                  className="group relative p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className={`relative p-3 bg-gradient-to-br ${action.gradient} rounded-lg w-fit mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text transition-all">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
