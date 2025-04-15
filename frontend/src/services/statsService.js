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
export const getInterupptionByWeek = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/weeklyinterruptions");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des seesion by week:", error);
    throw error;
  }
};
export const getCodingHoursByWeek = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/weekly-coding-hours");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des seesion by week:", error);
    throw error;
  }
};
export const getCodingHoursByMonth = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/monthly-coding-hours");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des seesion by week:", error);
    throw error;
  }
};
export const getSessionDurationStats = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/session-duration-stats");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des seesion by week:", error);
    throw error;
  }
};
export const getConcentrationData = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/concentration-data");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des seesion by week:", error);
    throw error;
  }
};
export const getCodeVsErrorsData = async () => {
  try {
    const response = await axiosInstance.get("/api/statistics/daily-code-stats");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des seesion by week:", error);
    throw error;
  }
};