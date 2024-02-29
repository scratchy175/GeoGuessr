"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";

export default function Statistics() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const session = await getSession();
    setSession(session);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url("/planete.jpg")' }}>
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Statistics</h2>
              <div>
                {session && (
                  <Link href="/edit-profile">
                    <span className="text-indigo-500 hover:underline cursor-pointer">Edit Profile</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-200 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Total Visits</h3>
                <p className="text-gray-700">1000</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Unique Visitors</h3>
                <p className="text-gray-700">800</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Page Views</h3>
                <p className="text-gray-700">1500</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Bounce Rate</h3>
                <p className="text-gray-700">30%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
