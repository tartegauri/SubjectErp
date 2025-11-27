import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAdmin from '../../services/useAdmin'
import { FiSave, FiX, FiBook, FiHash, FiAward, FiFileText } from 'react-icons/fi'

function AdminSubjectsAdd() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    description: ''
  })
  const navigate = useNavigate()
  const admin = useAdmin()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: admin.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      navigate('/admin/subjects')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Error creating subject')
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
            Create Subject
          </h1>
          <p className="text-gray-600">Add a new subject to the system</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiBook className="w-4 h-4 text-purple-600" />
                Subject Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Mathematics"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiHash className="w-4 h-4 text-purple-600" />
                Subject Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                placeholder="e.g., MATH101"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiAward className="w-4 h-4 text-purple-600" />
                Credits
              </label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                min="1"
                placeholder="e.g., 3"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiFileText className="w-4 h-4 text-purple-600" />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Subject description (optional)"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FiSave className="w-5 h-5" />
                {createMutation.isPending ? 'Creating...' : 'Create Subject'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/subjects')}
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

export default AdminSubjectsAdd
