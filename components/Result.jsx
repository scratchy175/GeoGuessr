import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameActions } from "@/hooks/useGameActions";


const Result = ({ showResult, endGame, round, totalScore, distanceG, score, nextRound }) => {
    const [showDetails, setShowDetails] = useState(false);
    const { handlePlayClick } = useGameActions();




    const router = useRouter();


    const quit = () => {
        router.push('/');
    }

    const switchResultMode = () => {
        setShowDetails(!showDetails);

        console.log('Show details');
    }

    return (
        <>
            {showResult &&
                <div class="result-container w-full h-full">
                    <div class="top-part h-5/6 relative">
                        <div class="flex flex-col justify-center items-center pt-5 absolute left-0 right-0 z-10">
                            <div class="bg-black py-2 px-4 rounded-lg bg-opacity-30 pointer-events-none">
                                <div class="text-white text-lg font-bold">{endGame ? "Résultats" : `${round.current}/5`}</div>
                            </div>
                        </div>
                        {endGame &&
                            <>
                                <div class={`absolute inset-0 flex flex-col bg-black bg-opacity-50 items-center justify-center left-0 z-10 ${showDetails ? 'hidden' : 'flex'}`}>
                                    <div class="text-white text-2xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">{totalScore.current}</div>
                                    <div class="text-white text-xs px-4 py-2">sur 25 000 points</div>
                                </div>
                                <div id="gameDetails" class={`absolute bottom-0 left-0 text-white p-4 overflow-auto max-h-1/4 z-10 ${showDetails ? 'visible' : 'invisible'}`}>
                                </div>
                            </>
                        }

                        <div id="resultsMap" class="relative h-full"></div>
                    </div>

                    <div class="relative bottom-part h-1/6">
                        <div className={`relative bottom-part h-1/6 bg-purple-950 flex justify-center items-center space-x-2 sm:space-x-8 md:space-x-20 lg:space-x-80 h-full flex-wrap`}>
                            {endGame ? (
                                <>
                                    <button onClick={switchResultMode}
                                        class="relative bg-green-500 py-2 px-4 rounded-full text-xs sm:text-sm md:text-md lg:text-lg text-white shadow-md transition ease-in-out duration-75 my-2 hover:bg-yellow-900 hover:scale-110">
                                        Voir le détail
                                    </button>
                                    <button onClick={handlePlayClick}
                                        class="relative bg-green-500 py-2 px-4 rounded-full text-xs sm:text-sm md:text-md lg:text-lg text-white shadow-md transition ease-in-out duration-75 my-2 hover:bg-yellow-900 hover:scale-110">
                                        Rejouer
                                    </button>
                                    <button onClick={quit}
                                        class="relative bg-green-500 py-2 px-4 rounded-full text-xs sm:text-sm md:text-md lg:text-lg text-white shadow-md transition ease-in-out duration-75 my-2 hover:bg-yellow-900 hover:scale-110">
                                        Quitter
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div class="relative text-white text-center mx-2">
                                        <div class="uppercase font-bold text-xs sm:text-sm md:text-md lg:text-lg">{distanceG.current} km</div>
                                        <div class="text-xs sm:text-sm md:text-base">Depuis la localisation</div>
                                    </div>
                                    <button onClick={nextRound}
                                        class="relative bg-green-500 py-2 px-4 rounded-full text-xs sm:text-sm md:text-md lg:text-lg text-white shadow-md transition ease-in-out duration-75 my-2 hover:bg-yellow-900 hover:scale-110">
                                        {round.current < 5 ? "Suivant" : "Voir les résultats"}
                                    </button>
                                    <div class="relative text-white text-center mx-2">
                                        <div class="uppercase font-bold text-xs sm:text-sm md:text-md lg:text-lg">{score.current}</div>
                                        <div class="text-xs sm:text-sm md:text-base">sur 5 000 points</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Result;