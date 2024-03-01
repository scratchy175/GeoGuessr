// pages/api/edit-profile.js

import { updateUserProfile } from '@/services/userService'; // Import your user service functions for updating profiles

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
  }

  // Retrieve username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // Call a function to update the user profile in the database
    const updatedUserProfile = await updateUserProfile(username, email, password);

    // Return a success response with the updated user profile
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUserProfile });
  } catch (error) {
    // Return an error response if something goes wrong
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update profile' });
  }
}
