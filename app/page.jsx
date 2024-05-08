"use client";
import React, { useEffect, useState } from 'react';
import { useGameActions } from "@/hooks/useGameActions";

const popupStyle = {
  backgroundImage: "url('/main/fondvierge.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  //maxWidth: '600px',
  width: '50%',
  //height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  color: 'white',
  boxSizing: 'border-box',
};

const GameParametersPopup = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div 
  className="rounded-lg p-5"
  style={popupStyle}
>
        <h2 className='text-black'>Select Game Parameters</h2>

        <div className='space-x-48 flex flex-row'>
          <button onClick={onClose} className='text-black' >Cancel</button>
          <button onClick={onConfirm} className='text-black'>Start Game</button>
        </div>
      </div>
    </div>
  );
};



const App = () => {
  const { handlePlayClick } = useGameActions();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    // Prevent scrolling when the app is fullscreen.
    document.documentElement.style.overflow = 'hidden';

    // Re-enable scrolling when the component is unmounted.
    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const showParametersPopup = () => {
    setIsPopupVisible(true);
  };

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
        <div style={{ position: 'relative', width: '150%', height: '100%' }}>
          <img
            src="/main/fondpapier.png"
            alt="Overlay Image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      <div
        className="absolute right-0"
        style={{
          right: '-41%',
          top: '50%',
          transform: 'translateY(-45%)',
          width: '90%',
        }}
      >
        <img src="/main/globe.svg" alt="Globe" style={{ width: '100%' }} />
        
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-full shadow-md flex justify-center items-center"
        style={{
          bottom: '26%',
          left: '-21%',
          position: 'absolute',
        }}
        onClick={showParametersPopup}
      >
    <p>Démarrer l&apos;exploration</p>
      </button>
      </div>

      {
        isPopupVisible && (
          <GameParametersPopup
            onClose={() => setIsPopupVisible(false)}
            onConfirm={() => {
              handlePlayClick();
              setIsPopupVisible(false);
            }}
          />
        )
      }
    </div>
  );
}

export default App;
