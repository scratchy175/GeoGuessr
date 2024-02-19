import axios from 'axios';

export const registerUser = async (username, email, password) => {
  try {
        const response = await axios.post('/api/register', {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
