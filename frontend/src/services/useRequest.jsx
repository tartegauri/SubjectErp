import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useAuthStore} from "../store/authStore";
const useAxios = () => {
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      if (error.response && error.response.status === 403) {
        useAuthStore.getState().logout();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};

export default useAxios;
