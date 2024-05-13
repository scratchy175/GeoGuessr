import axios from "axios";

export const getDemo = async () => {
  try {
    const response = await axios.get(`/api/scoreDemo`);
    return response.data;
  } catch (error) {
    console.error("Error getting total games:", error);
    throw error;
  }
};
