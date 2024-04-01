// MapControls.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from "next/image";
import plus from "@/public/Plus_black.svg";
import minus from "@/public/Minus_black.svg";
import arrow from "@/public/Arrow.svg";
import stick from "@/public/World_Game_Stick.svg";

const MapControls = ({ mapRef, mapContainerRef, handleGuess, guessB }) => {
    const [mapSize, setMapSize] = useState({ width: '250', height: '150' });
    const hoverTimeoutRef = useRef(null);
    const [isPinned, setIsPinned] = useState(false);

    const [isHovered, setIsHovered] = useState(false);
    const [isDecreaseDisabled, setIsDecreaseDisabled] = useState(true);
    const [isIncreaseDisabled, setIsIncreaseDisabled] = useState(false);

    // Constants for min and max sizes
    const minWidth = 250;
    const minHeight = 150;
    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;

    // Handlers for button clicks
    const increaseSize = () => adjustMapSize(1.5); // Increase by 50%
    const decreaseSize = () => adjustMapSize(-1.5); // Decrease by 50%, using negative factor for simplicity in calculation


    // Function to update the map size and button states
    const adjustMapSize = (adjustmentFactor) => {
        setMapSize(currentSize => {
            let newWidth = adjustmentFactor > 1 ? parseInt(currentSize.width) * adjustmentFactor : parseInt(currentSize.width) / Math.abs(adjustmentFactor);
            let newHeight = adjustmentFactor > 1 ? parseInt(currentSize.height) * adjustmentFactor : parseInt(currentSize.height) / Math.abs(adjustmentFactor);

            // Clamping the newWidth and newHeight within the min and max boundaries
            newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
            newHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);

            // Determine button enabled states based on the new dimensions
            const isIncreaseDisabled = newWidth === maxWidth || newHeight === maxHeight;
            const isDecreaseDisabled = newWidth === minWidth || newHeight === minHeight;

            // Update the button states
            setIsIncreaseDisabled(isIncreaseDisabled);
            setIsDecreaseDisabled(isDecreaseDisabled);

            return {
                width: newWidth,
                height: newHeight,
            };
        });
    };

    // Fonction pour épingler la carte.
    const pinMap = () => {

        // si la carte est épinglée, faire pivoter l'image vers la droite
        if (isPinned) {
            document.getElementById('pinButton').style.transform = 'rotate(0deg)';
        }
        // sinon, faire pivoter l'image vers la gauche
        else {
            document.getElementById('pinButton').style.transform = 'rotate(90deg)';
        }
        setIsPinned(!isPinned);
    }

    // Fonction pour zoomer sur la carte.
    const ZoomIn = () => {
        mapRef.current.setZoom(mapRef.current.zoom + 1);

    }
    // Fonction pour dézoomer sur la carte.
    const ZoomOut = () => {
        mapRef.current.setZoom(mapRef.current.zoom - 1);

    }

    // Fonction pour gérer le survol de la carte.
    const onMouseEnter = () => {
        if (isPinned) {
            return;
        }
        // Clear any existing timeout to prevent unwanted size reset if we hover again before the timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        setIsHovered(true);
    };

    // Fonction pour gérer la sortie du survol de la carte.
    const onMouseLeave = () => {
        if (isPinned) {
            return;
        }    // Set a timeout to reset the hover state after a delay
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            hoverTimeoutRef.current = null;
        }, 1000); // Attendre 1 seconde avant de masquer les boutons
    };
    return (
        <div className={`absolute bottom-5 left-5 z-10 `}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <div id="mapButtons"
                class="relative p-2 space-x-2 max-w-max max-h-10 rounded-t-lg"
                style={{
                    backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                    transition: 'all 0.3s ease',
                }}>

                <button onClick={increaseSize}
                    disabled={isIncreaseDisabled}
                    style={{
                        backgroundColor: isIncreaseDisabled ? 'gray' : 'white',
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.3s ease',
                        transform: 'rotate(225deg)',
                    }}
                    className="bg-white rounded-full z-30">
                    <Image src={arrow}
                        alt="arrow"
                        width={20}
                        height={20}
                    />
                </button>
                <button onClick={decreaseSize}
                    disabled={isDecreaseDisabled}
                    style={{
                        opacity: isHovered ? 1 : 0,
                        backgroundColor: isDecreaseDisabled ? 'gray' : 'white',
                        transition: 'all 0.3s ease',
                        transform: 'rotate(45deg)',
                    }}
                    className="rounded-full z-30">
                    <Image src={arrow}
                        alt="arrow"
                        width={20}
                        height={20}
                    />
                </button>
                <button id="pinButton"
                    onClick={pinMap}
                    style={{
                        opacity: isHovered ? 1 : 0,
                        transition: 'all 0.3s ease',
                        weight: '20px',
                        height: '20px',

                    }}
                    className="bg-white rounded-full z-30">
                    <Image src={stick}
                        alt="stick"
                        width={20}
                        height={20}
                        color='transparent'
                    />
                </button>
            </div>

            <div class="relative z-20"
            style={
                {
                    opacity: isHovered ? 1 : 0.5,
                }

            }>
                <button onClick={ZoomIn} 
                    style={{
                        transition: 'all 0.3s ease',
                        right: '10px',
                        top: '10px',
                        weight: '20px',
                        height: '20px',
                    }}
                    className="absolute bg-white rounded-full shadow-md">
                    <Image src={plus}
                        alt="plus"
                        width={18}
                        height={18}
                    />
                </button>
                <button onClick={ZoomOut}
                    style={{
                        transition: 'all 0.3s ease',
                        right: '10px',
                        top: '30px',
                        weight: '20px',
                        height: '20px',
                    }}
                    className="absolute rounded-full bg-white shadow-md">
                    <Image src={minus}
                        alt="minus"
                        width={18}
                        height={18}

                    />
                </button>
            </div>

            <div id="inGame" className='relative overflow-hidden rounded-lg' style={{
                width: isHovered ? mapSize.width : '250px',
                height: isHovered ? mapSize.height : '150px',
                transition: 'all 0.3s ease',
                minHeight: '150px',
                minWidth: '250px',
                opacity: isHovered ? 1 : 0.5,

            }}>
                <div ref={mapContainerRef} className=' relative h-full w-full '
                ></div>
            </div>
            <button id="guessButton"
                onClick={handleGuess}
                disabled={!guessB}
                style={{
                    width: isHovered ? mapSize.width : '250px',
                    transition: 'all 0.3s ease',
                    opacity: !guessB ? 0.5 : (isHovered ? 1 : 0.5),
                }}
                className="h-10 w-full py-2 mt-2 text-lg cursor-pointer rounded-full text-white font-bold uppercase shadow-md transition ease-in-out delay-150 bg-yellow-900 hover:scale-110 duration-75 disabled:bg-black disabled:hover:scale-100 disabled:opacity-50">
                Guess
            </button>

        </div>
    );
};

export default MapControls;
