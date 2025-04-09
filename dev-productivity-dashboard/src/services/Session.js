import axiosInstance from "./axiosInstance";

export const getAllSession = async () => {
  try {
    const response = await axiosInstance.get("/api/sessions");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recupuration des Session:", error);
    throw error;
  }
};