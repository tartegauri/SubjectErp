import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useStudent from '../../services/useStudent'
import { useAuth } from '../../context/AuthContext'
import { FiBook, FiHash, FiAward, FiUser, FiCheck, FiLoader } from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi2'

function StudentEnroll() {
  const { user } = useAuth()
  const student = useStudent()
  const queryClient = useQueryClient()

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['student', 'available-subjects'],
    queryFn: student.getAvailableSubjects,
  })

  const { data: enrolledData, isLoading: enrolledLoading } = useQuery({
    queryKey: ['student', 'enrolled-subjects'],
    queryFn: student.getMyEnrolledSubjects,
  })

  const enrollMutation = useMutation({
    mutationFn: student.enrollInSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'enrolled-subjects'] })
      queryClient.invalidateQueries({ queryKey: ['student', 'available-subjects'] })
      alert('Successfully enrolled in subject!')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Error enrolling in subject')
    },
  })

  const subjects = subjectsData?.subjects || []
  const enrolledSubjects = enrolledData?.subjects || []
  const enrolledSubjectIds = enrolledSubjects.map(s => s.id)

  const isEnrolled = (subjectId) => {
    return enrolledSubjectIds.includes(subjectId)
  }

  const handleEnroll = (subjectId) => {
    enrollMutation.mutate(subjectId)
  }

  if (subjectsLoading || enrolledLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading subjects...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Enroll in Subjects
          </h1>
          <p className="text-gray-600">Browse and enroll in available subjects</p>
        </div>

        {subjects.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <FiBook className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No subjects available for enrollment.</p>
              <p className="text-sm text-gray-400">Contact admin to create subjects.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const enrolled = isEnrolled(subject.id)
              return (
                <div
                  key={subject.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                >
                  {enrolled && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FiCheck className="w-3 h-3" />
                      Enrolled
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl w-fit mb-3">
                      <FiBook className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FiHash className="w-3 h-3" />
                        {subject.code}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiAward className="w-4 h-4 text-yellow-600" />
                      <span>{subject.credits} credits</span>
                    </div>
                    {subject.teacher && subject.teacher !== 'Not assigned' && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HiAcademicCap className="w-4 h-4 text-green-600" />
                        <span>{subject.teacher}</span>
                      </div>
                    )}
                    {subject.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{subject.description}</p>
                    )}
                  </div>

                  {enrolled ? (
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-gray-200 text-gray-600 rounded-xl cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                    >
                      <FiCheck className="w-5 h-5" />
                      Already Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(subject.id)}
                      disabled={enrollMutation.isPending}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {enrollMutation.isPending ? (
                        <>
                          <FiLoader className="w-5 h-5 animate-spin" />
                          <span>Enrolling...</span>
                        </>
                      ) : (
                        <>
                          <FiCheck className="w-5 h-5" />
                          <span>Enroll</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentEnroll
