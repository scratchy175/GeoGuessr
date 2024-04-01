"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

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
    <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
      {/* Fond */}
      <img
        src="/profil/fondprofil.png"
        alt="Fond Liege"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Image par-dessus */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src="/profil/profil.png"
          alt="Image par dessus"
          className="w-full h-full object-contain"
        />

        {/* Parties */}
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src="/profil/parties.svg"
            alt="Image par dessus"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-1/2 transform -translate-y-1/4 text-6xl text-center" style={{ position: 'absolute', top: '53%', left: '16%', width: '25%' }}>
            <p className="creme font-bold">849</p>
          </div>
        </div>

        {/* Highscore */}
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src="/profil/highscore.svg"
            alt="Image par dessus"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-1/2 transform -translate-y-1/4 text-6xl text-center" style={{ position: 'absolute', top: '53%', left: '33%', width: '25%' }}>
            <p className="creme font-bold">25000</p>
          </div>
        </div>

        {/* Moyenne */}
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src="/profil/moyenne.svg"
            alt="Image par dessus"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-1/2 transform -translate-y-1/4 text-6xl text-center" style={{ position: 'absolute', top: '53%', left: '54%', width: '25%' }}>
            <p className="creme font-bold">18476</p>
          </div>
        </div>

        {/* Pseudo */}
        <div className="absolute top-1/2 transform -translate-y-1/4 text-8xl text-center" style={{ position: 'absolute', top: '35%', left: '35%', width: '27%' }}>
          <p className="pseudo-color font-bold">{username}</p>
        </div>
      </div>
    </div>
  );
}
