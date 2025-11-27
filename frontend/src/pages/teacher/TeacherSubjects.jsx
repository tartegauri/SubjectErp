import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import useTeacher from '../../services/useTeacher'
import { 
  FiBook, 
  FiHash, 
  FiAward, 
  FiFileText, 
  FiUpload, 
  FiDownload, 
  FiTrash2, 
  FiChevronDown, 
  FiChevronUp,
  FiX,
  FiImage,
  FiFile,
  FiFileMinus
} from 'react-icons/fi'

function TeacherSubjects() {
  const { user } = useAuth()
  const teacher = useTeacher()
  const queryClient = useQueryClient()
  const [expandedSubject, setExpandedSubject] = useState(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(null) // subjectId
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null,
  })

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['teacher', 'subjects'],
    queryFn: teacher.getMySubjects,
  })

  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['teacher', 'assignments'],
    queryFn: () => teacher.getAssignments(),
    enabled: !!user?.id,
  })

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return await teacher.uploadAssignment(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'assignments'] })
      setUploadModalOpen(null)
      setUploadForm({ title: '', description: '', file: null })
      alert('Assignment uploaded successfully!')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Error uploading assignment')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (assignmentId) => {
      return await teacher.deleteAssignment(assignmentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'assignments'] })
      alert('Assignment deleted successfully!')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Error deleting assignment')
    },
  })

  const subjects = subjectsData?.subjects || []
  const assignments = assignmentsData?.assignments || []

  const toggleSubject = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only PDF, images, PPT, PPTX, DOC, and DOCX files are allowed.')
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB')
        return
      }

      setUploadForm({ ...uploadForm, file })
    }
  }

  const handleUpload = (e) => {
    e.preventDefault()
    if (!uploadForm.title || !uploadForm.file || !uploadModalOpen) {
      alert('Please fill in all required fields')
      return
    }

    const formData = new FormData()
    formData.append('file', uploadForm.file)
    formData.append('subjectId', uploadModalOpen)
    formData.append('title', uploadForm.title)
    if (uploadForm.description) {
      formData.append('description', uploadForm.description)
    }

    uploadMutation.mutate(formData)
  }

  const getSubjectAssignments = (subjectId) => {
    return assignments.filter(assignment => assignment.subjectId === subjectId)
  }

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FiFile className="w-5 h-5 text-red-600" />
      case 'image':
        return <FiImage className="w-5 h-5 text-green-600" />
      case 'pptx':
      case 'ppt':
        return <FiFileText className="w-5 h-5 text-orange-600" />
      case 'doc':
      case 'docx':
        return <FiFileMinus className="w-5 h-5 text-blue-600" />
      default:
        return <FiFile className="w-5 h-5 text-gray-600" />
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Subjects
          </h1>
          <p className="text-gray-600">Manage assignments for your subjects</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {subjectsLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-500">Loading subjects...</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FiBook className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No subjects assigned yet.</p>
                <p className="text-sm text-gray-400">Contact admin to assign subjects to you.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {subjects.map((subject) => {
                const isExpanded = expandedSubject === subject.id
                const subjectAssignments = getSubjectAssignments(subject.id)
                const isUploadModalOpen = uploadModalOpen === subject.id

                return (
                  <div key={subject.id} className="hover:bg-indigo-50/30 transition-colors">
                    <div
                      className="p-6 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleSubject(subject.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                          <FiBook className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {subject.code}
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <FiAward className="w-4 h-4 text-yellow-600" />
                              {subject.credits} credits
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <FiFileText className="w-4 h-4 text-indigo-600" />
                              {subjectAssignments.length} assignment{subjectAssignments.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadModalOpen(subject.id)
                            setUploadForm({ title: '', description: '', file: null })
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <FiUpload className="w-4 h-4" />
                          Upload Assignment
                        </button>
                        {isExpanded ? (
                          <FiChevronUp className="w-6 h-6 text-gray-600" />
                        ) : (
                          <FiChevronDown className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-6 bg-gray-50/50">
                        {assignmentsLoading ? (
                          <div className="p-8 text-center text-gray-500">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="mt-2">Loading assignments...</p>
                          </div>
                        ) : subjectAssignments.length === 0 ? (
                          <div className="p-8 text-center bg-white rounded-xl border-2 border-dashed border-gray-300">
                            <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">No assignments uploaded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Click "Upload Assignment" to add one</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {subjectAssignments.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between"
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="p-2 bg-gray-100 rounded-lg">
                                    {getFileIcon(assignment.fileType)}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                                    {assignment.description && (
                                      <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                      <span>{assignment.fileName}</span>
                                      <span>•</span>
                                      <span>{formatFileSize(assignment.fileSize)}</span>
                                      <span>•</span>
                                      <span>{new Date(assignment.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={assignment.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="Download"
                                  >
                                    <FiDownload className="w-5 h-5" />
                                  </a>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this assignment?')) {
                                        deleteMutation.mutate(assignment.id)
                                      }
                                    }}
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    title="Delete"
                                    disabled={deleteMutation.isPending}
                                  >
                                    <FiTrash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {uploadModalOpen && (() => {
        const selectedSubject = subjects.find(s => s.id === uploadModalOpen)
        if (!selectedSubject) return null
        
        return createPortal(
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" 
            onClick={() => {
              setUploadModalOpen(null)
              setUploadForm({ title: '', description: '', file: null })
            }}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-[10000] max-h-[90vh] overflow-y-auto" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upload Assignment</h3>
                <button
                  onClick={() => {
                    setUploadModalOpen(null)
                    setUploadForm({ title: '', description: '', file: null })
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-900">{selectedSubject.name} ({selectedSubject.code})</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Assignment title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Assignment description (optional)"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    File <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.doc,.docx"
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FiUpload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {uploadForm.file ? uploadForm.file.name : 'Click to upload file'}
                      </span>
                      <span className="text-xs text-gray-400">
                        PDF, Images, PPT, PPTX, DOC, DOCX (Max 50MB)
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploadMutation.isPending}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadModalOpen(null)
                      setUploadForm({ title: '', description: '', file: null })
                    }}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )
      })()}
    </div>
  )
}

export default TeacherSubjects
