"use client"
import Image from "next/image";
import { useEffect, useState,useRef } from "react";
import Link from "next/link";
import { signOut, getSession } from "next-auth/react";

export default function Home() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    const session = await getSession();
    setSession(session);

    if (session) {
      setUsername(session.user.username);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Welcome to GeoGuessr!</h1>
      </div>
      <>
                  {session ? (
                    <div>
                      <Link
                        href="#"
                        className="hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Welcome, {username}!
                      </Link>
                      <button
                        className="hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        onClick={() => signOut()}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Signup
                      </Link>
                    </>
                  )}
                  </>
    </header>
    
    <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Replace this section with your content */}
        <div className="px-4 py-6 bg-white shadow sm:rounded-lg">
          <p className="text-lg text-gray-700">This is your home page content. You can customize it to fit your needs.</p>
        </div>
      </div>
    </main>
    
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-400 text-sm">&copy; 2024 GeoGuessr. All rights reserved.</p>
      </div>
    </footer>
  </div>
  );
}
