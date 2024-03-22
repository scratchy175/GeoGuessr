// MapControls.jsx
import React from 'react';
import Image from "next/image";
import plus from "@/public/Plus_black.svg";
import minus from "@/public/Minus_black.svg";
import arrow from "@/public/Arrow.svg";
import stick from "@/public/World_Game_Stick.svg";

const MapControls = ({ isHovered, increaseSize, decreaseSize, ZoomIn, ZoomOut, pinMap, isIncreaseDisabled, isDecreaseDisabled }) => {
  return (
    <div className={`absolute bottom-5 left-5 z-10 ${isHovered ? 'opacity-100' : 'opacity-50'}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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

          <div class="relative z-20">
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
    </div>
  );
};

export default MapControls;
