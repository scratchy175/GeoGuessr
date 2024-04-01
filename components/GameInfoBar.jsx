// GameInfoBar.jsx
import React from 'react';
import Image from "next/image";
import logo from "@/public/logo2.png";
import Timer from './Timer'; // Adjust import path as necessary

const GameInfoBar = ({ round, totalScore, timeLeft, setTimeLeft, handleTimerComplete }) => {
  return (
    <div className="flex justify-between items-center p-1.5 absolute left-0 right-0 z-10">
      <div className="bg-yellow-800 p-2 rounded-lg shadow-md flex justify-around items-center space-x-4">
        <div className="text-white">
          <div className="text-xs uppercase text-stone-800 font-bold">Carte</div>
          <div className="text-lg font-bold">World</div>
        </div>
        <div className="text-white">
          <div className="text-xs uppercase text-stone-800 font-bold">Round</div>
          <div className="text-lg font-bold">{round}/5</div>
        </div>
        <div className="text-white">
          <div className="text-xs uppercase text-stone-800 font-bold">Score</div>
          <div className="text-lg font-bold">{totalScore}</div>
        </div>
      </div>
      <Timer timeLeft={timeLeft} resetTimer={setTimeLeft} onComplete={handleTimerComplete} />

      <Image className="h-20 w-auto mr-4" src={logo} alt="logo" />
    </div>
  );
};

export default GameInfoBar;
