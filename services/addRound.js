import axios from "axios";

export const addRound = async (game_id, round_nb, score, distance, time, user_point, map_point) => {
  try {
    const response = await axios.post("/api/round", {
      game_id,
      round_nb,
      score,
      distance,
      time,
      user_point,
      map_point,
        });
    return response.data;
  } catch (error) {
    console.error("Error adding round:", error);
    throw error;
  }
}