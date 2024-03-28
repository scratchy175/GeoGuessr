"use client"
import React from 'react';

const App = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
      {/* Fond */}
      <img
        src="/fondregles.svg"
        alt="Fond Liege"
        className="absolute inset-0 w-full h-full object-cover"
      />

          {/* Image par-dessus */}
          <div className="absolute inset-0 flex justify-center items-center">
        <img
          src="/regles.png"
          alt="Image par dessus"
          className="w-full h-full object-contain"
        />
      </div>


    </div>
  );
}

export default App;