import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requiredRole }) {
  const { role } = useAuth()

  if (!role) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'teacher' ? '/teacher/home' : '/student/home'} replace />
  }

  return children
}

export default ProtectedRoute

