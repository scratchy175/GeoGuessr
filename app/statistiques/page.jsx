"use client";
import React from 'react';

const App = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
      {/* Fond */}
      <img
        src="/statistiques/fondstats.png"
        alt="Fond Liege"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Texte des statistiques */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src="/statistiques/textestats.svg"
          alt="Image par dessus"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Parties jouées */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src="/statistiques/partiesjoues.svg"
          alt="Image par dessus"
          className="w-full h-full object-contain"
        />
        <div
          className="absolute top-1/2 transform -translate-y-1/4 text-6xl text-center"
          style={{
            position: 'absolute',
            top: '45%', // Déplacer la div vers le bas
            left: '14%',
            width: '25%',
          }}>
          <p className="creme font-bold">18476</p>
        </div>
      </div>

      {/* Utilisateurs inscrits */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src="/statistiques/utilisateursinscrits.svg"
          alt="Image par dessus"
          className="w-full h-full object-contain"
        />
        <div
          className="absolute top-1/2 transform -translate-y-1/4 text-6xl text-center"
          style={{
            position: 'absolute',
            top: '45%', // Déplacer la div vers le bas
            left: '39%',
            width: '20%',
          }}>
          <p className="creme font-bold">18476</p>
        </div>
      </div>

      {/* Score moyen */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src="/statistiques/scoremoyen.svg"
          alt="Image par dessus"
          className="w-full h-full object-contain"
        />
        <div
          className="absolute top-1/2 transform -translate-y-1/4 text-6xl text-center"
          style={{
            position: 'absolute',
            top: '45%', // Déplacer la div vers le bas
            left: '61%',
            width: '25%',
          }}>
          <p className="creme font-bold">18476</p>
        </div>
      </div>
    </div>
  );
}

export default App;
