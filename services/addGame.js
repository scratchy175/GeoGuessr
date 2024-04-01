// services/gameService.js
import axios from 'axios';

export const addGame = async (user_id, game_id, map_type, state) => {
  try {
    const response = await axios.post('/api/game', {
      user_id,
      game_id,
      map_type,
      state,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
};

