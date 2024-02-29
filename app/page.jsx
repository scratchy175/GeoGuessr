"use client"
import Image from "next/image";
import { motion } from "framer-motion";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { signOut, getSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import footer from "@/components/footer";




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
  return (
    <>
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/planete.jpg")' }}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Bienvenue dans votre jeu</h1>
            <div>
              <button className="bg-orange-500 hover:bg-blue-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Jouer</button>
            </div>
          </div>
        </div>
      </div>

      {session ? (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-0 right-0 hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
          >
            {username}
          </div>
          {showMenu && (
            <div className="absolute top-0 right-0 mt-16 bg-white shadow-md rounded-md">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">  <Link href="/profile">
                  Voir profil
                </Link></li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => signOut()}
                >
                  Déconnexion
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Paramètres</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link href="/stat">Statistiques</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link href="/classement"> Classement </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link href="/Comment">Comment jouer</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link href="/rules">Règlement</Link>
                </li>
              </ul>
            </div>

          )}
        </div>
      ) : (
       <></>




      )
      }
    </>

  );
}
