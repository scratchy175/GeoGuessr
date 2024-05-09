"use client";
import React, { useEffect, useState } from "react";
import { getLeaderboardGames } from "@/services/getLeaderboardGames";
const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data = await getLeaderboardGames();
        setLeaderboardData(data.topUsers);

      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
      {/* Fond */}
      <img
        src="/classement/liege2.png"
        alt="Fond Liege"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Image par-dessus */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 md:w-3/4 lg:w-1/2 xl:w-1/3"
        style={{
          width: '90%', // Ajuster la largeur de la div
          height: '90%', // Ajuster la hauteur de la div
        }}
      >
        <img src="/classement/classement.png" alt="Globe" style={{ width: '100%', height: '100%' }} /> {/* Ajuster la largeur et la hauteur de l'image à 100% */}
      </div>

      {/* Première Image par-dessus */}
      <div
        className="absolute"
        style={{
          right: '5%', // Ajustement pour une position plus à droite sur de plus petits écrans
          top: '45%', // Centrage vertical
          transform: 'translateY(-45%)', // Centrage vertical
          width: '90%', // Ajustement de la largeur pour la rendre responsive
        }}
      >
        <img src="/classement/classement1.png" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-xs md:text-sm lg:text-md xl:text-xl 2xl:text-3xl"
          style={{
            position: 'absolute',
            bottom: '0%', // Ajustement pour positionner le texte en bas de l'image
            left: '7%', // Ajustement pour positionner le texte à gauche
            width: '25%', // Ajustement de la largeur pour la rendre responsive
          }}>
          {/* Texte du classement */}
          <p className="or-color font-bold">1 - Bientot disponible</p>
          <p className="argent-color font-bold">2 - Bientot disponible</p>
          <p className="bronze-color font-bold">3 - Bientot disponible</p>
          <p className="text-custom-color">4 - Bientot disponible</p>
          <p className="text-custom-color">5 - Bientot disponible</p>
          <p className="text-custom-color">6 - Bientot disponible</p>
          <p className="text-custom-color">7 - Bientot disponible</p>
          <p className="text-custom-color">8 - Bientot disponible</p>
          <p className="text-custom-color">9 - Bientot disponible</p>
          <p className="text-custom-color">10 - Bientot disponible</p>
          <p className="text-custom-color font-bold">Vous - Bientot disponible</p>
        </div>
      </div>

      {/* Deuxième Image par-dessus */}
      <div
        className="absolute right-0"
        style={{
          right: '5%', // Ajustement pour une position plus à droite sur de plus petits écrans
          top: '45%', // Centrage vertical
          transform: 'translateY(-45%)', // Centrage vertical
          width: '90%', // Ajustement de la largeur pour la rendre responsive
        }}
      >
        <img src="/classement/classement2.png" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-xs md:text-sm lg:text-md xl:text-xl 2xl:text-3xl"
          style={{
            position: 'absolute',
            bottom: '35%', // Ajustement pour positionner le texte au-dessus de l'image
            left: '37%', // Ajustement pour positionner le texte au centre
            width: '25%', // Ajustement de la largeur pour la rendre responsive
          }}>
          {/* Texte du classement */}
          <p className="or-color font-bold">1 - Bientot disponible</p>
          <p className="argent-color font-bold">2 - Bientot disponible</p>
          <p className="bronze-color font-bold">3 - Bientot disponible</p>
          <p className="text-custom-color">4 - Bientot disponible</p>
          <p className="text-custom-color">5 - Bientot disponible</p>
          <p className="text-custom-color">6 - Bientot disponible</p>
          <p className="text-custom-color">7 - Bientot disponible</p>
          <p className="text-custom-color">8 - Bientot disponible</p>
          <p className="text-custom-color">9 - Bientot disponible</p>
          <p className="text-custom-color">10 - Bientot disponible</p>
          <p className="text-custom-color font-bold">Vous - Bientot disponible</p>
        </div>
      </div>

      {/* Troisième Image par-dessus */}
      <div
        className="absolute right-0"
        style={{
          right: '5%', // Ajustement pour une position plus à droite sur de plus petits écrans
          top: '45%', // Centrage vertical
          transform: 'translateY(-45%)', // Centrage vertical
          width: '90%', // Ajustement de la largeur pour la rendre responsive
        }}
      >
        <img src="/classement/classement3.png" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-xs md:text-sm lg:text-md xl:text-xl 2xl:text-3xl"
          style={{
            position: 'absolute',
            top: '43%', // Ajustement pour positionner le texte au-dessus de l'image
            left: '69%', // Ajustement pour positionner le texte au centre
            width: '25%', // Ajustement de la largeur pour la rendre responsive
          }}>
          {/* Texte du classement */}
  <ul>
  {leaderboardData.map((user, index) => (
    <li key={index} style={{ color: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'black', fontWeight: index < 3 ? 'bold' : 'normal' }}>
      Id {user.user_id} : {user._count.state} parties
    </li>
  ))}
  </ul>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;







