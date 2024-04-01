"use client"
import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    // Empêcher le défilement lorsque l'application est en plein écran
    document.documentElement.style.overflow = 'hidden';

    // Remettre le défilement lorsque le composant est démonté
    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="relative flex justify-center items-center bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url('/main/fondliege.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
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
            src="/main/fondpapier.png"
            alt="Image par dessus"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* SVG du globe */}
      <div
        className="absolute right-0"
        style={{
          right: '-41%', // Ajustement pour une position plus à droite sur de plus petits écrans
          top: '50%', // Centrage vertical
          transform: 'translateY(-45%)', // Centrage vertical
          width: '90%', // Ajustement de la largeur pour la rendre responsive
        }}
      >
        <img src="/main/globe.svg" alt="Globe" style={{ width: '100%' }} />
      </div>

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md"
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '33%',
          width: '10%',
        }}
      >
        Démarrer l'exploration
      </button>
    </div>
  );
};

export default App;
