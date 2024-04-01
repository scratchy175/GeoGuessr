"use client"
import Image from "next/image";
import { motion } from "framer-motion";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { signOut, getSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import footer from "@/components/footer";
import { useGameActions } from "@/hooks/useGameActions";


export default function Home() {
  const [showMenu, setShowMenu] = useState(false);


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

  const router = useRouter();
  const { handlePlayClick } = useGameActions();
  return (
    <>
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/planete.jpg")' }}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Bienvenue</h1>
            <div>
              <button
                onClick={handlePlayClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Play
              </button>
            </div>
          </div>
        </div>
      </div>



   
 : (
       <></>




      )
      
    </>

  );
}
