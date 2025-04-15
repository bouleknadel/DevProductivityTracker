import axiosInstance from "./axiosInstance";
export const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };