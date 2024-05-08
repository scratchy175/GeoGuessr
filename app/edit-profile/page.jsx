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
    <div className="min-h-screen flex flex-col justify-center items-center relative">
  <img
    src="/compte/fondcompte.png"
    alt="Fond Liege"
    className="absolute inset-0 w-full h-full object-cover z-0"
  />
  <form onSubmit={handleSubmit} className="w-full max-w-md z-10">
    <h1 className="text-3xl font-bold mb-4">Modifier le Pseudo</h1>

    {error && <p className="text-red-500 mb-4">{error}</p>}
    {success && <p className="text-green-500 mb-4">Pseudo changé avec succès!</p>}

    <div className="mb-4">
      <label htmlFor="username" className="block text-gray-600">Le nouveau Pseudo</label>
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
    
    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
    >
      Modifier 
    </button>
  </form>
</div>

  
  );
}
    