import axios from "axios";

export const getFinishGames = async (user_id) => {
  try {
    // Adjust the URL to match your API route for fetching rounds by game_id
    const response = await axios.get(`/api/resultGames/${user_id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting rounds:", error);
    throw error;
  }
};
