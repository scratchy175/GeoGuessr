import axios from "axios";

export const getBestScore = async (user_id) => {
  try {
    const response = await axios.get(`/api/bestScore/${user_id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting BestScore:", error);
    throw error;
  }
};
