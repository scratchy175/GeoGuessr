import axios from 'axios';

export async function getAverageScore(userId) {
  try {
    const response = await axios.get(`/api/averageScore/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting total games:", error);
    throw error;
  }
}
