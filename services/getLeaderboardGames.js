import axios from "axios";

export const getLeaderboardGames = async () => {
  try {
    const response = await axios.get(`/api/leaderboardGames`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting total games:", error);
    throw error;
  }
};
