import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAdmin from '../../services/useAdmin'
import { FiSave, FiX, FiUser, FiMail, FiLock, FiPhone, FiBriefcase } from 'react-icons/fi'

function AdminTeachersAdd() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: ''
  })
  const navigate = useNavigate()
  const admin = useAdmin()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: admin.createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      alert('Teacher added successfully!')
      navigate('/admin/teachers')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Error creating teacher')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Add Teacher
          </h1>
          <p className="text-gray-600">Register a new teacher account</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiUser className="w-4 h-4 text-purple-600" />
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Teacher's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiMail className="w-4 h-4 text-purple-600" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="teacher@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiLock className="w-4 h-4 text-purple-600" />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Teacher will use this to login"
                required
              />
              <p className="text-xs text-gray-500">Teacher will use this password to login</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiPhone className="w-4 h-4 text-purple-600" />
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Phone number (optional)"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiBriefcase className="w-4 h-4 text-purple-600" />
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Department (optional)"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FiSave className="w-5 h-5" />
                {createMutation.isPending ? 'Adding...' : 'Add Teacher'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/teachers')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminTeachersAdd
