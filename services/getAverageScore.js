import axios from 'axios';

export async function getAverageScore(userId) {
  try {
    const response = await axios.get(`/api/averageScore/${userId}`);
    return response.data.averageScore;
  } catch (error) {
    console.error("Error getting average score:", error);
    return 0;
  }
}
