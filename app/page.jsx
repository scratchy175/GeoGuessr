"use client"
import Image from "next/image";
import { motion } from "framer-motion";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { signOut, getSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import footer from "@/components/footer";
import { addGame } from "@/services/addGame";

// Function to generate a random ID (simple example)
function generateRandomID(length = 16) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


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

  const handlePlayClick = async () => {
    const randomID = generateRandomID();
    const mapType = "World"; // Placeholder value
    const state = "active"; // Placeholder value
    const user_id = 1;
  
    if (session) {
      try {
        const gameData = await addGame(session.user.id, randomID, mapType, state);
        console.log("Game added successfully!", gameData);
        router.push(`/game/${randomID}`);
      } catch (error) {
        console.error("Failed to add game:", error);
      }
    } else {
      console.log("No session found, redirecting to login.");
      // Handle the case where there is no user session
    }
  };
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
