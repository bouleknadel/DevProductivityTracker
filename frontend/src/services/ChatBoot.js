// api/chatService.js
import axiosInstance from "./axiosInstance";

export const getResponseFromChat = async (question) => {
    try {
      const response = await axiosInstance.post("developer-query", {
        question: question
      });
      return response.data.answer; // Retourne directement la réponse
    } catch (error) {
      console.error("Erreur lors de la récupération getResponseFromChat", error);
      throw error;
    }
};
export const fetchCodingStatistics = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/coding");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    throw error;
  }
};
export const fetchOptimalHours = async () => {
  try {
    const response = await axiosInstance.post('/optimal-hours');
    return await response.data;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};