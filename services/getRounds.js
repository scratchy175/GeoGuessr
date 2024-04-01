import axios from "axios";

export const getRounds = async (game_id) => {
  try {
    // Adjust the URL to match your API route for fetching rounds by game_id
    const response = await axios.get(`/api/result/${game_id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting rounds:", error);
    throw error;
  }
};
