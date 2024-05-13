// services/gameService.js
import axios from 'axios';

export const addDemo = async (pseudo, score) => {
  try {
    const response = await axios.post('/api/demo', {
        pseudo,
        score,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
};

