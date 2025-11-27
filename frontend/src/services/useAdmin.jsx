import useRequest from "./useRequest";
import { apiUrls } from "../utils/apiUrls";

const useAdmin = () => {
  const axios = useRequest();

  // Dashboard Stats
  const getStats = async () => {
    const response = await axios.get(apiUrls.adminStats);
    return response;
  };

  // Students
  const createStudent = async (studentData) => {
    const response = await axios.post(apiUrls.adminCreateStudent, studentData);
    return response;
  };

  const getStudents = async () => {
    const response = await axios.get(apiUrls.adminGetStudents);
    return response;
  };

  const updateStudent = async (id, studentData) => {
    const response = await axios.put(apiUrls.adminUpdateStudent(id), studentData);
    return response;
  };

  const deleteStudent = async (id) => {
    const response = await axios.delete(apiUrls.adminDeleteStudent(id));
    return response;
  };

  // Teachers
  const createTeacher = async (teacherData) => {
    const response = await axios.post(apiUrls.adminCreateTeacher, teacherData);
    return response;
  };

  const getTeachers = async () => {
    const response = await axios.get(apiUrls.adminGetTeachers);
    return response;
  };

  const getTeachersWithSubjects = async () => {
    const response = await axios.get(apiUrls.adminGetTeachersWithSubjects);
    return response;
  };

  const updateTeacher = async (id, teacherData) => {
    const response = await axios.put(apiUrls.adminUpdateTeacher(id), teacherData);
    return response;
  };

  const deleteTeacher = async (id) => {
    const response = await axios.delete(apiUrls.adminDeleteTeacher(id));
    return response;
  };

  // Subjects
  const createSubject = async (subjectData) => {
    const response = await axios.post(apiUrls.adminCreateSubject, subjectData);
    return response;
  };

  const getSubjects = async () => {
    const response = await axios.get(apiUrls.adminGetSubjects);
    return response;
  };

  const updateSubject = async (id, subjectData) => {
    const response = await axios.put(apiUrls.adminUpdateSubject(id), subjectData);
    return response;
  };

  const deleteSubject = async (id) => {
    const response = await axios.delete(apiUrls.adminDeleteSubject(id));
    return response;
  };

  // Assign Subjects to Teachers
  const assignSubjectsToTeacher = async (teacherId, subjectIds) => {
    const response = await axios.post(apiUrls.adminAssignSubjects, {
      teacherId,
      subjectIds,
    });
    return response;
  };

  return {
    // Stats
    getStats,
    // Students
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    // Teachers
    createTeacher,
    getTeachers,
    getTeachersWithSubjects,
    updateTeacher,
    deleteTeacher,
    // Subjects
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject,
    // Assign
    assignSubjectsToTeacher,
  };
};

export default useAdmin;
