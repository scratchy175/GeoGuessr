import axios from "axios";

export const getNumberAccounts = async () => {
  try {
    const response = await axios.get(`/api/numberAccounts`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting total games:", error);
    throw error;
  }
};
