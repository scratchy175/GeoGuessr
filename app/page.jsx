"use client"
import './Anastasia.css';
import React from 'react';
const App = () => {
  return (
    <div
      className="relative flex justify-center items-center bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url(/fondliege.svg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Conteneur pour la page par-dessus */}
      <div
        className="relative"
        style={{
          flex: 1,
          maxWidth: '90%',
          maxHeight: '90%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Image par-dessus */}
        <div style={{ position: 'relative', width: '150%', height: '100%' }}>
          <img
            src="/fondpapier.svg"
            alt="Image par dessus"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* SVG "pointilesbouton.svg" par-dessus l'image */}
          <img
            src="/pointilesbouton.svg"
            alt="Pointiles Bouton"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
        {/* Texte "Bienvenue sur" avec la police Anastasia */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
          <h1 style={{ fontFamily: 'Anastasia', color: 'black', fontSize: '77px', textAlign: 'center' }}>Bienvenue sur</h1>

        </div>
      </div>

      {/* SVG du globe */}
      <div
        className="absolute right-0"
        style={{
          right: '-40%', // Ajustement pour une position plus à droite sur de plus petits écrans
          top: '50%', // Centrage vertical
          transform: 'translateY(-45%)', // Centrage vertical
          width: '90%', // Ajustement de la largeur pour la rendre responsive
        }}
      >
        <img src="/globe.svg" alt="Globe" style={{ width: '100%' }} />
      </div>
     
      {/* Contenu de votre application */}
    </div>
  );
};

export default App;
