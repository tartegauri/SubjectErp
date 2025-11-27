import { useState, Fragment, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import useTeacher from '../../services/useTeacher'
import { FiUsers, FiMail, FiPhone, FiBook, FiChevronDown } from 'react-icons/fi'

function TeacherStudents() {
  const [expandedStudent, setExpandedStudent] = useState(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState('all')
  const teacher = useTeacher()

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['teacher', 'students'],
    queryFn: teacher.getMyStudents,
  })

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['teacher', 'subjects'],
    queryFn: teacher.getMySubjects,
  })

  const allStudents = studentsData?.students || []
  const allSubjects = subjectsData?.subjects || []

  const filteredStudents = useMemo(() => {
    if (selectedSubjectId === 'all') {
      return allStudents
    }

    const subjectId = parseInt(selectedSubjectId)
    return allStudents.filter(student => {
      return student.enrolledSubjects?.some(
        subject => subject.id === subjectId
      )
    })
  }, [allStudents, selectedSubjectId])

  const toggleStudentDetails = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
              My Students
            </h1>
            <p className="text-gray-600">Students enrolled in your assigned subjects</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FiBook className="w-4 h-4 text-indigo-600" />
              Filter by Subject:
            </label>
            <div className="relative">
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="appearance-none px-6 py-3 pr-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white font-medium text-gray-700 cursor-pointer hover:border-indigo-300"
                disabled={subjectsLoading}
              >
                <option value="all">All Subjects</option>
                {allSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {selectedSubjectId !== 'all' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl">
            <p className="text-sm text-indigo-800 flex items-center gap-2">
              <FiBook className="w-4 h-4" />
              Showing students enrolled in: <span className="font-semibold">
                {allSubjects.find(s => s.id === parseInt(selectedSubjectId))?.name || 'Selected Subject'}
              </span>
            </p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {studentsLoading || subjectsLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-blue-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <FiUsers className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">
                            {selectedSubjectId === 'all'
                              ? 'No students enrolled in your subjects yet.'
                              : 'No students enrolled in the selected subject.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <Fragment key={student.id}>
                        <tr className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{student.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FiUsers className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiMail className="w-4 h-4" />
                              {student.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.phone ? (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiPhone className="w-4 h-4" />
                                {student.phone}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleStudentDetails(student.id)}
                              className="px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors font-medium flex items-center gap-2"
                            >
                              <FiBook className="w-4 h-4" />
                              {expandedStudent === student.id ? 'Hide' : 'View'} Enrollments
                            </button>
                          </td>
                        </tr>
                        {expandedStudent === student.id && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
                              <div className="ml-8">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <FiBook className="w-4 h-4 text-indigo-600" />
                                  Enrolled Subjects:
                                </h4>
                                {student.enrolledSubjects && student.enrolledSubjects.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {student.enrolledSubjects.map((subject) => (
                                      <span
                                        key={subject.id}
                                        className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold flex items-center gap-2"
                                      >
                                        {subject.name} ({subject.code}) - {subject.credits} credits
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No enrollments yet</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!studentsLoading && !subjectsLoading && (
          <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
            {selectedSubjectId !== 'all' && ` enrolled in selected subject`}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherStudents
