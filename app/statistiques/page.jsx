"use client";
import React, { useState, useEffect } from 'react';

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
      <div
        className="absolute"
        style={{
          right: '5%',
          top: '45%',
          transform: 'translateY(-45%)',
          width: '90%'
        }}
      >
        <img src="/statistiques/partiesjoues.svg" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-md md:text-lg lg:text-xl xl:text-4xl 2xl:text-5xl"
          style={{
            position: 'absolute',
            top: '45%',
            left: '9%',
            width: '25%',
          }}>
          <p className="creme font-bold">0</p>
        </div>
      </div>

      {/* Utilisateurs inscrits */}
      <div
        className="absolute"
        style={{
          right: '5%',
          top: '45%',
          transform: 'translateY(-45%)',
          width: '90%'
        }}
      >
        <img src="/statistiques/utilisateursinscrits.svg" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-md md:text-lg lg:text-xl xl:text-4xl 2xl:text-5xl"
          style={{
            position: 'absolute',
            top: '45%',
            left: '39%',
            width: '20%',
          }}>
          <p className="creme font-bold">0</p>
        </div>
      </div>

      {/* Score moyen */}
      <div
        className="absolute"
        style={{
          right: '5%',
          top: '45%',
          transform: 'translateY(-45%)',
          width: '90%'
        }}
      >
        <img src="/statistiques/scoremoyen.svg" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-3xl text-center sm:text-md md:text-lg lg:text-xl xl:text-4xl 2xl:text-5xl"
          style={{
            position: 'absolute',
            top: '45%',
            left: '66%',
            width: '25%',
          }}>
          <p className="creme font-bold">0</p>
        </div>
      </div>
    </div>
  );
}

export default App;
