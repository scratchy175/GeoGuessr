"use client";
import React, { useEffect, useState } from 'react';
import { useGameActions, generateRandomID } from "@/hooks/useGameActions";
import { useRouter } from 'next/navigation';

const popupStyle = {
  backgroundImage: "url('/profil/fondvierge.png')",
  //backgroundSize: '100% 100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  //maxWidth: '600px',
  width: '30%',
  //height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  color: 'white',
  boxSizing: 'border-box',
};

const GameParametersPopup = ({ onTimeChange, onClose, onConfirm, initialTime }) => {
  const [seconds, setSeconds] = useState(initialTime);

  const handleSliderChange = (event) => {
    const newTime = parseInt(event.target.value, 10);
    setSeconds(newTime);
    onTimeChange(newTime);  // Directly pass the number to onTimeChange
  };

  // Function to format the seconds into a minute:second format
  const formatTime = (totalSeconds) => {
    if (totalSeconds === '0') return 'Unlimited';

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className=" flex flex-col gap-10 rounded-lg p-5"
        style={popupStyle}>
        <h2 className='text-black '>Select Game Parameters</h2>

        <div className="p-4">
          <label htmlFor="time-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
            Game Time
          </label>
          <div className="relative w-full"> {/* Container for the slider with fixed width */}
            <input
              id="time-range"
              type="range"
              min="0"
              max="600"
              step="10"
              value={seconds}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="absolute w-full text-center mt-2 text-sm font-medium text-gray-900 dark:text-black">
              {formatTime(seconds)}
            </div>
          </div>
        </div>



        <div className='space-x-48 flex flex-row'>
          <button
            className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={onClose}>
            Annuler
          </button>

          <button
            className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={onConfirm}>
            Confirmer
          </button>

        </div>
      </div>
    </div>
  );
};

const PseudoPopup = ({ onClose, onConfirm, setPseudo }) => {
  const [pseudo, setPseudoLocal] = useState("");
  const router = useRouter();


  const handleConfirm = () => {
    setPseudo(pseudo);  // Update the pseudo state in parent component
    onConfirm();        // Handle additional actions on confirm
    sessionStorage.setItem('gameTime', 20);
    sessionStorage.setItem('demo', true);
    const randomID = generateRandomID();
    router.push(`/game/${randomID}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col gap-3 bg-white p-4 rounded-lg">
        <input
          type="text"
          placeholder="Enter your pseudo"
          value={pseudo}
          onChange={(e) => setPseudoLocal(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};



const App = () => {
  const { handlePlayClick } = useGameActions();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [gameTime, setGameTime] = useState(300);  // Starting with a default value
  const [isPseudoPopupVisible, setIsPseudoPopupVisible] = useState(false);
  const [pseudo, setPseudo] = useState("");

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
        style={{ position: 'absolute', bottom: '10%' }}
        onClick={() => setIsPseudoPopupVisible(true)}
      >
        Set Pseudonym
      </button>

      {isPseudoPopupVisible && (
        <PseudoPopup
          setPseudo={setPseudo}
          onClose={() => setIsPseudoPopupVisible(false)}
          onConfirm={() => setIsPseudoPopupVisible(false)}
        />
      )}
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
            initialTime={gameTime}
            onTimeChange={setGameTime}
            onClose={() => setIsPopupVisible(false)}
            onConfirm={() => {
              handlePlayClick(gameTime);
              setIsPopupVisible(false);
            }}
          />
        )
      }
    </div>
  );
}

export default App;
