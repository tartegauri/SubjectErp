import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAdmin from '../../services/useAdmin'
import { FiSave, FiX, FiUser, FiMail, FiLock, FiPhone, FiMapPin } from 'react-icons/fi'

function AdminStudentsAdd() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  })
  const navigate = useNavigate()
  const admin = useAdmin()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: admin.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'students'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      alert('Student added successfully! They can now login with their email and password.')
      navigate('/admin/students')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Error creating student')
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
            Add Student
          </h1>
          <p className="text-gray-600">Add a new student to the system</p>
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
                placeholder="Student's full name"
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
                placeholder="student@example.com"
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
                placeholder="Student will use this to login"
                required
              />
              <p className="text-xs text-gray-500">Student will use this password to login</p>
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
                <FiMapPin className="w-4 h-4 text-purple-600" />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Address (optional)"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FiSave className="w-5 h-5" />
                {createMutation.isPending ? 'Adding...' : 'Add Student'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/students')}
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

export default AdminStudentsAdd
