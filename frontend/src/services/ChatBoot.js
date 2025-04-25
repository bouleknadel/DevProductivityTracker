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