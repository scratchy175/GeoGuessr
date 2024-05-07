"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

export default function Compte() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [id, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const session = await getSession();
    setSession(session);

    if (session) {
      setUsername(session.user.username);
      setEmail(session.user.email); // Récupérer l'e-mail
      setUserId(session.user.id); // Récupérer l'ID de l'utilisateur
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
        src="/compte/fondcompte.png"
        alt="Fond Liege"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Image par-dessus */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src="/compte/compte.png"
          alt="Image par dessus"
          className="w-full h-full object-contain"
        />
      

      {/* Nom d'utilisateur */}
      <div className="absolute top-1/2 transform -translate-y-1/4 text-8xl text-center"
        style={{
          position: 'absolute',
          top: '28%', // Déplacer la div vers le bas
          left: '36%',
          width: '27%',
        }}>
        <p className="creme font-bold">{username}</p>
      </div>  

      {/* Bouton pour changer de pseudo */}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md"
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '21%',
          width: '10%',
          zIndex: 10, // Assure que ce bouton est en avant
        }}
      >
        Changer de pseudo
      </button>

      {/* Deuxième bouton pour changer de mot de passe */}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md"
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '63%',
          width: '10%',
          zIndex: 10, // Assure que ce bouton est en avant
        }}
      >
        Changer de mot de passe
      </button>
    </div>
    </div>
  );
}
