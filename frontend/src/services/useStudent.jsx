import useRequest from "./useRequest";
import { apiUrls } from "../utils/apiUrls";

const useStudent = () => {
  const axios = useRequest();

  // Get all available subjects
  const getAvailableSubjects = async () => {
    const response = await axios.get(apiUrls.studentGetSubjects);
    return response;
  };

  // Get enrolled subjects for logged-in student
  const getMyEnrolledSubjects = async () => {
    const response = await axios.get(apiUrls.studentGetEnrolledSubjects);
    return response;
  };

  // Enroll in a subject
  const enrollInSubject = async (subjectId) => {
    const response = await axios.post(apiUrls.studentEnroll, { subjectId });
    return response;
  };

  // Unenroll from a subject
  const unenrollFromSubject = async (subjectId) => {
    const response = await axios.delete(apiUrls.studentUnenroll(subjectId));
    return response;
  };

  return {
    getAvailableSubjects,
    getMyEnrolledSubjects,
    enrollInSubject,
    unenrollFromSubject,
  };
};

export default useStudent;

