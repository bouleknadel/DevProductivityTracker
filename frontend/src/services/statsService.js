// src/services/statsService.js
import axiosInstance from "./axiosInstance";

export const getCodingStats = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/coding");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    throw error;
  }
};
export const getSessionByWeek = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/weeklysessions-java");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des seesion by week:", error);
    throw error;
  }
};