import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import useAdmin from '../../services/useAdmin'
import { FiPlus, FiEdit, FiTrash2, FiBook, FiUser } from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi2'

function AdminSubjects() {
  const admin = useAdmin()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'subjects'],
    queryFn: admin.getSubjects,
  })

  const deleteMutation = useMutation({
    mutationFn: admin.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })

  const subjects = data?.subjects || []

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Subjects
            </h1>
            <p className="text-gray-600">Manage all subjects in the system</p>
          </div>
          <Link
            to="/admin/subjects/add"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create Subject</span>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-500">Loading subjects...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Assigned Teacher
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {subjects.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <FiBook className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No subjects found.</p>
                          <Link 
                            to="/admin/subjects/add" 
                            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
                          >
                            <FiPlus className="w-4 h-4" />
                            Create your first subject
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    subjects.map((subject) => (
                      <tr key={subject.id} className="hover:bg-purple-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{subject.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <FiBook className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{subject.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {subject.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {subject.credits} credits
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subject.teacher && subject.teacher !== 'Not assigned' ? (
                            <div className="flex items-center gap-2">
                              <HiAcademicCap className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-700">{subject.teacher}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(subject.id)}
                              disabled={deleteMutation.isPending}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSubjects
