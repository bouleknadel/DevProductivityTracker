import axiosInstance from "./axiosInstance";

export const getSession = async () => {
  try {
    const response = await axiosInstance.get("api/sessions");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions:", error);
    throw error;
  }
};