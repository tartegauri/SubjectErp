import useRequest from "./useRequest";
import { apiUrls } from "../utils/apiUrls";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const useTeacher = () => {
  const axiosInstance = useRequest();

  const getMySubjects = async () => {
    const response = await axiosInstance.get(apiUrls.teacherGetSubjects);
    return response;
  };

  const getMyStudents = async () => {
    const response = await axiosInstance.get(apiUrls.teacherGetStudents);
    return response;
  };

  const getMyEnrollments = async () => {
    const response = await axiosInstance.get(apiUrls.teacherGetEnrollments);
    return response;
  };

  const uploadAssignment = async (formData) => {
    const token = useAuthStore.getState().token;
    const response = await axios.post(apiUrls.teacherUploadAssignment, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const getAssignments = async (teacherId, subjectId = null) => {
    const params = {};
    if (subjectId) {
      params.subjectId = subjectId;
    }
    const response = await axiosInstance.get(apiUrls.teacherGetAssignments, { params });
    return response;
  };

  const deleteAssignment = async (assignmentId) => {
    const response = await axiosInstance.delete(apiUrls.teacherDeleteAssignment(assignmentId));
    return response;
  };

  return {
    getMySubjects,
    getMyStudents,
    getMyEnrollments,
    uploadAssignment,
    getAssignments,
    deleteAssignment,
  };
};

export default useTeacher;

