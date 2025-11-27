import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedRole = localStorage.getItem('role')
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }
  }, [])

  const login = (userData, userRole) => {
    setUser(userData)
    setRole(userRole)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', userRole)
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem('user')
    localStorage.removeItem('role')
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

