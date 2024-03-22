"use client"
import React from 'react';

const App = () => {
  return (
    <div className="relative w-screen min-h-screen overflow-hidden flex justify-center items-center">
      <img
        src="/fondliege.svg"
        alt="Fond Liege"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          minWidth: '100%',
          minHeight: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
        {/* Image par-dessus */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src="/fondabout.svg"
            alt="Image par dessus"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
  );
}

export default App;
