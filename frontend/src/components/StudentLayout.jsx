import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  FiHome, 
  FiFileText, 
  FiUser, 
  FiLogOut, 
  FiMenu,
  FiX
} from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi2'

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/student/home', label: 'Home', icon: FiHome },
    { path: '/student/enroll', label: 'Enroll in Subject', icon: FiFileText },
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-900 text-white transition-all duration-300 flex flex-col shadow-2xl relative z-10`}
      >
        <div className="p-4 flex items-center justify-between border-b border-blue-700/50">
          <div className={`${sidebarOpen ? 'flex items-center gap-3' : 'hidden'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <HiAcademicCap className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Student Portal
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg transform scale-105'
                    : 'hover:bg-white/10 hover:transform hover:translate-x-1'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-200'}`} />
                <span className={`${sidebarOpen ? 'block' : 'hidden'} font-medium ${isActive ? 'text-white' : 'text-blue-100'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-blue-700/50">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl`}>
            <p className="text-xs text-blue-300 mb-1">Logged in as</p>
            <p className="font-semibold text-white flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              {user?.name || 'Student'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FiLogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default StudentLayout
