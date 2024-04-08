// edit-profile.js
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { getSession } from "next-auth/react";


export default function EditProfile() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = await getSession();
    if (session) {
      try {
        const response = await axios.post('/api/edit-profile', {
          id: session.user.id,
          username,
        });

        if (response.status === 200) {
          setSuccess(true);
          setError("");
        } else {
          setError("Failed to update profile");
        }
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
      }
    };
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Profile updated successfully!</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter new username"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter new email"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter new password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
