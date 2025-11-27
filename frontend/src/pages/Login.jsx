import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth as useAuthContext } from '../context/AuthContext'
import useAuthService from '../services/useAuth'
import { FiLogIn, FiMail, FiLock, FiUser, FiShield } from 'react-icons/fi'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login: loginContext } = useAuthContext()
  const { login: loginAPI } = useAuthService()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginAPI(formData.email, formData.password)
      
      if (result.success) {
        const userData = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email
        }
        loginContext(userData, result.user.role)
        
        if (result.user.role === 'admin') {
          navigate('/admin/home')
        } else if (result.user.role === 'teacher') {
          navigate('/teacher/home')
        } else {
          navigate('/student/home')
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <FiShield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Welcome Back</h2>
            <p className="text-indigo-200 text-sm">
              Admin, Teachers, and Students can login here
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-100 px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="text-red-300">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-indigo-100">
                <FiMail className="w-4 h-4" />
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-indigo-100">
                <FiLock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-indigo-200 mt-4">
            Contact your administrator for login credentials
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Login
