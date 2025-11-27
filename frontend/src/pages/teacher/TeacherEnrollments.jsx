import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useTeacher from '../../services/useTeacher'
import { FiBook, FiUsers, FiChevronDown, FiChevronUp, FiCalendar } from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi2'

function TeacherEnrollments() {
  const [expandedSubject, setExpandedSubject] = useState(null)
  const teacher = useTeacher()

  const { data, isLoading } = useQuery({
    queryKey: ['teacher', 'enrollments'],
    queryFn: teacher.getMyEnrollments,
  })

  const subjects = data?.subjects || []

  const toggleSubjectDetails = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Subject Enrollments
          </h1>
          <p className="text-gray-600">View enrollment details by subject</p>
        </div>

        {isLoading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading enrollments...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <FiBook className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No subjects assigned yet.</p>
              <p className="text-sm text-gray-400">Contact admin to assign subjects to you.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl">
                        <FiBook className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {subject.name} ({subject.code})
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <HiAcademicCap className="w-4 h-4" />
                            {subject.credits} credits
                          </span>
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4" />
                            {subject.studentCount} students enrolled
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSubjectDetails(subject.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {expandedSubject === subject.id ? (
                        <>
                          <FiChevronUp className="w-4 h-4" />
                          <span>Hide Students</span>
                        </>
                      ) : (
                        <>
                          <FiChevronDown className="w-4 h-4" />
                          <span>View Students</span>
                        </>
                      )}
                    </button>
                  </div>

                  {expandedSubject === subject.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {subject.students && subject.students.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Enrolled At
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                              {subject.students.map((student) => (
                                <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    #{student.id}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4" />
                                    {student.Enrollment?.enrolledAt
                                      ? new Date(student.Enrollment.enrolledAt).toLocaleDateString()
                                      : 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                            <FiUsers className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">No students enrolled in this subject yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherEnrollments
