import axios from "axios";

export const getTotalGames = async () => {
  try {
    const response = await axios.get(`/api/totalGames`);
    return response.data;
  } catch (error) {
    console.error("Error getting total games:", error);
    throw error;
  }
};
