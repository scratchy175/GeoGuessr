"use client";
import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { getFinishGames } from '@/services/getFinishGames';
import { getBestScore } from '@/services/getBestScore';
import { getAverageScore } from '@/services/getAverageScore';

export default function Profile() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [numberOfGames, setNumberOfGames] = useState("Chargement");
  const [bestScore, setBestScore] = useState("Chargement");
  const [averageScore, setAverageScore] = useState("Chargement");

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      setSession(session);

      if (session) {
        setUsername(session.user.username);

        const finishedGamesResponse = await getFinishGames(session.user.id);
        const { result: finishedGames } = finishedGamesResponse;
        setNumberOfGames(finishedGames);

        const bestScoreResponse = await getBestScore(session.user.id);
        setBestScore(Math.round(bestScoreResponse._max.score));

        const averageScoreResponse = await getAverageScore(session.user.id);
        setAverageScore(Math.round(averageScoreResponse._avg.score));
      }
    };

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

        {/* Pseudo */}
        <div className="absolute top-1/2 transform -translate-y-1/4 text-8xl text-center" style={{ position: 'absolute', top: '35%', left: '35%', width: '27%' }}>
          <p className="pseudo-color font-bold">{username}</p>
        </div>

        {/* Affichez le nombre de parties */}
        <div className="absolute" style={{ right: '5%', top: '45%', transform: 'translateY(-45%)', width: '90%' }}>
          <img src="/profil/parties.svg" alt="Globe" style={{ width: '100%' }} />
          <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-md md:text-lg lg:text-xl xl:text-4xl 2xl:text-5xl" style={{ position: 'absolute', top: '53%', left: '11%', width: '25%' }}>
            <p className="creme font-bold">{numberOfGames}</p>
          </div>
        </div>

        {/* Affichez le meilleur score */}
        <div className="absolute" style={{ right: '5%', top: '45%', transform: 'translateY(-45%)', width: '90%' }}>
          <img src="/profil/highscore.svg" alt="Globe" style={{ width: '100%' }} />
          <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-md md:text-lg lg:text-xl xl:text-4xl 2xl:text-5xl" style={{ position: 'absolute', top: '53%', left: '34%', width: '25%' }}>
            <p className="creme font-bold">{bestScore}</p>
          </div>
        </div>

        {/* Affichez le score moyen */}
        <div className="absolute" style={{ right: '5%', top: '45%', transform: 'translateY(-45%)', width: '90%' }}>
          <img src="/profil/moyenne.svg" alt="Globe" style={{ width: '100%' }} />
          <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-md md:text-lg lg:text-xl xl:text-4xl 2xl:text-5xl" style={{ position: 'absolute', top: '53%', left: '58%', width: '25%' }}>
            <p className="creme font-bold">{averageScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
