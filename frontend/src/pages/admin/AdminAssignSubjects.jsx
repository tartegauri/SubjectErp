import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAdmin from '../../services/useAdmin'
import { FiCheck, FiX, FiLink2 } from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi2'

function AdminAssignSubjects() {
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const admin = useAdmin()
  const queryClient = useQueryClient()

  const { data: teachersData } = useQuery({
    queryKey: ['admin', 'teachers-with-subjects'],
    queryFn: admin.getTeachersWithSubjects,
  })

  const { data: subjectsData } = useQuery({
    queryKey: ['admin', 'subjects'],
    queryFn: admin.getSubjects,
  })

  const assignMutation = useMutation({
    mutationFn: ({ teacherId, subjectIds }) => admin.assignSubjectsToTeacher(teacherId, subjectIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers-with-subjects'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'teachers'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'subjects'] })
      alert('Subjects assigned successfully!')
      setSelectedTeacher('')
      setSelectedSubjects([])
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Error assigning subjects')
    },
  })

  const teachers = teachersData?.teachers || []
  const subjects = subjectsData?.subjects || []

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedTeacher) {
      alert('Please select a teacher')
      return
    }
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject')
      return
    }
    assignMutation.mutate({
      teacherId: parseInt(selectedTeacher),
      subjectIds: selectedSubjects.map(id => parseInt(id)),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Assign Subjects to Teachers
          </h1>
          <p className="text-gray-600">Assign subjects to teachers for teaching</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <HiAcademicCap className="w-5 h-5 text-purple-600" />
                Select Teacher
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                required
              >
                <option value="">Choose a teacher...</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                <FiLink2 className="w-5 h-5 text-purple-600" />
                Select Subjects to Assign
              </label>
              {subjects.length === 0 ? (
                <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-xl">No subjects available. Create subjects first.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  {subjects.map((subject) => (
                    <label
                      key={subject.id}
                      className="flex items-center p-4 hover:bg-white rounded-xl cursor-pointer transition-all border border-transparent hover:border-purple-200 hover:shadow-md"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.id)}
                        onChange={() => handleSubjectToggle(subject.id)}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                      />
                      <div className="ml-4 flex-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {subject.name}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({subject.code}) - {subject.credits} credits
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={assignMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FiCheck className="w-5 h-5" />
                {assignMutation.isPending ? 'Assigning...' : 'Assign Subjects'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTeacher('')
                  setSelectedSubjects([])
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></span>
            Current Assignments
          </h2>
          <div className="space-y-4">
            {teachers.length === 0 ? (
              <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-xl">No teachers found. Add teachers first.</p>
            ) : (
              teachers.map((teacher) => (
                <div key={teacher.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <HiAcademicCap className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600 ml-12">
                    {teacher.subjects && teacher.subjects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {teacher.subjects.map((subject) => (
                          <span
                            key={subject.id}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold"
                          >
                            {subject.name} ({subject.code})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No subjects assigned</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAssignSubjects
