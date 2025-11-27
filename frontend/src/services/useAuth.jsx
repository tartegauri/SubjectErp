import axios from "axios";
import { apiUrls } from "../utils/apiUrls";
import { useAuthStore } from "../store/authStore";

const useAuth = () => {
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        apiUrls.login,
        { email, password }
      );
      
      if (response.data && response.data.user && response.data.token) {
        useAuthStore.getState().setAuth(response.data.user, response.data.token);
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          message: response.data.message || "Login successful"
        };
      }
      
      return {
        success: false,
        message: "Invalid response from server"
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Login failed. Please try again."
      };
    }
  };

  return { login };
};

export default useAuth;
