"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";

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
    <div className="h-screen w-full bg-gray-50 flex justify-center items-center">
      <div className="h-100 mx-4 w-100 bg-blue-400 rounded-3xl shadow-md sm:w-72 sm:mx-0">
        <div className="h-1/2 w-full flex justify-center items-center px-3 py-5">
          <h1 className="text-white font-bold text-center">WELCOME TO YOUR PROFILE</h1>
        </div>

        <div className="bg-white h-100 w-full rounded-3xl flex flex-col justify-around items-center">
          <div className="w-full h-1/2 flex flex-col justify-center items-center">
            <p className="text-gray-700 font-bold">Username:{username}</p>
            <p className="text-gray-500 text-sm font-bold"></p>
          </div>
          <div className="w-full h-1/2 flex flex-col justify-center items-center">
            <p className="text-gray-700 font-bold">Email:{email}</p>
            <p className="text-gray-500 text-sm font-bold"></p>
            <p className="text-gray-700 font-bold">ID:{id}</p>
          </div>
        </div>
        <div className="mt-4">
          <Link href="/edit-profile">
            <span className="text-white text-center block py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg cursor-pointer">Edit Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
