"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, getSession } from "next-auth/react";

export default function Profile() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [id, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const session = await getSession();
    setSession(session);

    if (session) {
      setUsername(session.user.username);
      setEmail(session.user.email); // Retrieve email
      setUserId(session.user.id); // Retrieve user ID
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/planete.jpg')" }}>
      <div className="bg-white shadow-md rounded-lg p-6 w-80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">User Data</h2>
        </div>
        <div className="space-y-2">
          <p><span className="font-bold">Username:</span> {username}</p> {/* Display username */}
          <p><span className="font-bold">Email:</span> {email}</p> {/* Display email */}
          <p><span className="font-bold">ID:</span> {id}</p> {/* Display ID */}
        </div>
        <div className="mt-4">
          <Link href="/edit-profile">
            <span className="text-indigo-500 hover:underline cursor-pointer">Edit Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
