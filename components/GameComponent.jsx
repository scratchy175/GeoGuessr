"use client"
// Importation des bibliothèques et des modules nécessaires.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import bbox from '@turf/bbox';
import { randomPosition } from '@turf/random';
import distance from '@turf/distance';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import Image from "next/image";
import { fetchGeoJsonData } from '@/utils/geoJsonUtils';
import Timer from './Timer'; // Adjust the import path as necessary


// Importation des images depuis le dossier public.
import logo from "@/public/logo2.png";
import plus from "@/public/Plus_black.svg";
import minus from "@/public/Minus_black.svg";
import arrow from "@/public/Arrow.svg";
import stick from "@/public/World_Game_Stick.svg";
import back from "@/public/retour.svg";

// Fonction pour générer un point aléatoire à l'intérieur d'une entité (feature) GeoJSON.
const generateRandomPointInFeature = (feature) => {
  let randomPoint;
  const bboxObj = bbox(feature);
  do {
    randomPoint = randomPosition({ bbox: bboxObj });
  } while (!booleanPointInPolygon(randomPoint, feature));
  return randomPoint;
};

// Fonction asynchrone pour charger une bibliothèque Google Maps avancée pour les marqueurs.
async function loadAdvancedMarkerLibrary() {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  return AdvancedMarkerElement;
}

// Le composant principal du jeu.
const GameComponent = () => {
  // Utilisation des hooks pour gérer l'état et les références.
  const streetViewElementRef = useRef(null);
  const [globalGeoJsonData, setGlobalGeoJsonData] = useState(null);
  const streetViewServiceRef = useRef(null);
  const streetViewPanorama = useRef(null);
  const [mapSize, setMapSize] = useState({ width: '250', height: '150' });
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const [isDecreaseDisabled, setIsDecreaseDisabled] = useState(true);
  const [isIncreaseDisabled, setIsIncreaseDisabled] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const round = useRef(1);
  const totalScore = useRef(0);
  const distanceG = useRef(0);
  const score = useRef(0);
  const mapRef = useRef(null);
  const [guessB, isGuessB] = useState(false);
  const [initialStreetViewLocation, setInitialStreetViewLocation] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);



  const mapContainerRef = useRef(null);
  const [currentParentId, setCurrentParentId] = useState('inGame');

  // Constants for min and max sizes
  const minWidth = 250;
  const minHeight = 150;
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;

  const initialTime = 300; // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);


  const resetTimer = (newTime = initialTime) => {
    setTimeLeft(newTime);
  };

  const handleTimerComplete = () => {
    console.log('Timer completed!');
    resetTimer();
    // Execute any actions here, like ending the game round, updating state, etc.
    // Example: endRound();
  };


  useEffect(() => {
    // Initialisation de la carte et chargement des données GeoJSON.
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: "AIzaSyBAD4-_WMcL2BjZ-DxOURQ3rgfVtNGABvI", // Replace with your actual API key
          version: "weekly",
        });
        await loader.load();
        const { google } = window;
        console.log('Google Maps API loaded:');
        const initializedMap = new google.maps.Map(mapContainerRef.current, { center: { lat: 0, lng: 0 }, zoom: 2, mapId: "749a96b8b4bd0e90", disableDefaultUI: true, draggableCursor: 'crosshair', });
        mapRef.current = initializedMap;

        setTimeout(() => {
          initializeMarker()
        }, 1000);



        // Initialisation du panorama Street View.
        streetViewPanorama.current = new google.maps.StreetViewPanorama(streetViewElementRef.current, {
          pov: { heading: 0, pitch: 0 },
          disableDefaultUI: true,
          zoomControl: true,
        });

        streetViewServiceRef.current = new google.maps.StreetViewService();
        // Chargement des données GeoJSON.
        const data = await fetchGeoJsonData();
        setGlobalGeoJsonData(data);
        showRandomStreetView(data.features);
      } catch (error) {
        console.error("Failed to initialize map or fetch GeoJSON:", error);
      }
    };

    initMap();
  }, []);

  const moveMapAndResize = () => {

    setShowResult(!showResult)

    setTimeout(() => {
      const newParentId = currentParentId === 'inGame' ? 'resultsMap' : 'inGame';
      const newParent = document.getElementById(newParentId);
      newParent.appendChild(mapContainerRef.current);

      setCurrentParentId(newParentId);

      if (mapRef) {
        google.maps.event.trigger(mapRef, 'resize');
      }
    }, 100);
  };

  // Fonction pour afficher une vue Street View aléatoire.
  const showRandomStreetView = useCallback((features, attempt = 0) => {
    if (!features.length) {
      console.error("No features available.");
      return;
    }
    const randomFeatureIndex = Math.floor(Math.random() * features.length);
    const randomFeature = features[randomFeatureIndex];
    const randomLocation = generateRandomPointInFeature(randomFeature);
    console.log('Random location:', randomLocation);

    if (streetViewServiceRef.current) {
      console.log('Fetching Street View data...');
      streetViewServiceRef.current.getPanorama(
        { location: { lat: randomLocation[1], lng: randomLocation[0] }, preference: 'nearest', radius: 100000, source: 'outdoor' },
        (data, status) => processSVData(data, status, features, attempt, randomFeatureIndex)
      );
    }
  }, []);

  // Fonction pour traiter les données Street View.
  const processSVData = useCallback((data, status, features, attempt, randomFeatureIndex) => {
    if (status === 'OK') {
      setInitialStreetViewLocation({ lat: data.location.latLng.lat(), lng: data.location.latLng.lng() });
      streetViewPanorama.current.setPano(data.location.pano);
      streetViewPanorama.current.setVisible(true);

      console.log('Street View data:', data);
    } else if (attempt < 3) {
      showRandomStreetView(features, attempt + 1);
    } else {
      const newFeatures = features.filter((_, index) => index !== randomFeatureIndex);
      showRandomStreetView(newFeatures, 0);
    }
  }, [showRandomStreetView]);





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

  // Handlers for button clicks
  const increaseSize = () => adjustMapSize(1.5); // Increase by 50%
  const decreaseSize = () => adjustMapSize(-1.5); // Decrease by 50%, using negative factor for simplicity in calculation


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

  // Fonction pour zoomer sur la carte.
  const ZoomIn = () => {
    mapRef.current.setZoom(mapRef.current.zoom + 1);

  }
  // Fonction pour dézoomer sur la carte.
  const ZoomOut = () => {
    mapRef.current.setZoom(mapRef.current.zoom - 1);

  }
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

  // Fonction pour gérer le clic sur le bouton "Guess".
  const handleGuess = () => {
    moveMapAndResize();
    const user_position = {
      lat: window.marker.position.lat,
      lng: window.marker.position.lng
    };
    const map_position = initialStreetViewLocation;
    //const distanceG = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(user_position), new google.maps.LatLng(map_position));
    //console.log(distanceG / 1000);

    const from = [user_position.lng, user_position.lat];
    const to = [map_position.lng, map_position.lat];
    const options = { units: 'kilometers' };
    const distance2 = distance(from, to, options);
    console.log(distance2);
    score.current = Math.round(5000 * Math.exp(-10 * distance2 / 2000));
    totalScore.current += score.current;
    distanceG.current = Math.round(distance2);

    const lineSymbol = {
      path: "M 0,-1 0,1",
      strokeOpacity: 1,
      scale: 4,
    };

    window.line = new google.maps.Polyline({
      path: [user_position, map_position],
      geodesic: false,
      strokeColor: '#000000',
      strokeOpacity: 0,
      icons: [
        {
          icon: lineSymbol,
          offset: "0",
          repeat: "20px",
        },
      ],
      strokeWeight: 1,
      map: mapRef.current,
    });

    // Charger la bibliothèque des marqueurs avancés
    loadAdvancedMarkerLibrary().then(AdvancedMarkerElement => {
      // Créer un marqueur pour la position de l'utilisateur
      const markerDiv = document.createElement('img');
      markerDiv.src = '/mapPoint.webp';
      markerDiv.style.className = 'custom-marker';
      markerDiv.style.width = '40px';
      markerDiv.style.height = '40px';
      markerDiv.style.transform = 'translate(0, +40%)'; // Center the marker
      markerDiv.style.borderRadius = '30px';
      markerDiv.style.borderWidth = '4px';
      markerDiv.style.borderColor = 'white';

      // Creating an instance of AdvancedMarkerElement
      window.marker2 = new AdvancedMarkerElement({
        position: map_position,
        map: mapRef.current,
        content: markerDiv, // Optional
      });
    });
    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(user_position);
      bounds.extend(map_position);
      mapRef.current.fitBounds(bounds);
    }, 100);
  }


  const nextRound = () => {
    moveMapAndResize();
    showRandomStreetView(globalGeoJsonData.features);
    console.log('Next round');
    window.marker.setMap(null);
    window.marker2.setMap(null);
    window.line.setMap(null);
    mapRef.current.setZoom(2);
    mapRef.current.setCenter({ lat: 0, lng: 0 });
    round.current++;
    isGuessB(false);
  }

  const initializeMarker = () => {
    loadAdvancedMarkerLibrary().then(AdvancedMarkerElement => {
      mapRef.current.addListener('click', (e) => {
        if (window.marker) {
          window.marker.setMap(null);
        }

        const markerDiv = document.createElement('img');
        markerDiv.src = '/Marker5.webp';
        markerDiv.style.className = 'custom-marker';
        markerDiv.style.width = '50';
        markerDiv.style.height = '50px';
        markerDiv.style.transform = 'translate(0, +20%)';


        window.marker = new AdvancedMarkerElement({
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          },
          map: mapRef.current,
          content: markerDiv,

        });
        isGuessB(true);
      });
    });
  }

  const displayPano = () => {
    streetViewPanorama.current.setPosition(initialStreetViewLocation);
    streetViewPanorama.current.setVisible(true);
  }

  const tooltipClasses = showTooltip
  ? "opacity-100 scale-100" // Tooltip visible
  : "opacity-0 scale-0"; // Tooltip hidden


  return (
    <div class="flex flex-auto relative h-screen">
      <>
        <div class={`flex justify-between items-center p-1.5 absolute left-0 right-0 z-10 ${showResult ? 'hidden' : ''}`}>
          <div class="bg-yellow-800 p-2 rounded-lg shadow-md flex justify-around items-center space-x-4">
            <div class="text-white">
              <div class="text-xs uppercase text-stone-800 font-bold">Carte</div>
              <div class="text-lg font-bold">World</div>
            </div>
            <div class="text-white">
              <div class="text-xs uppercase text-stone-800 font-bold">Round</div>
              <div class="text-lg font-bold">{round.current}/5</div>
            </div>
            <div class="text-white">
              <div class="text-xs uppercase text-stone-800 font-bold">Score</div>
              <div class="text-lg font-bold">{totalScore.current}</div>
            </div>
          </div>
          <Timer timeLeft={timeLeft} resetTimer={setTimeLeft} onComplete={handleTimerComplete} />

          <Image
            className="h-20 w-auto mr-4"
            src={logo}
            alt="logo"
          />
        </div>
        {<div ref={streetViewElementRef}
          className={`w-full h-full relative ${showResult ? 'hidden' : ''}`}>
        </div>}
        <div className={`absolute bottom-5 left-5 z-10 ${showResult ? 'hidden' : ''} ${isHovered ? 'opacity-100' : 'opacity-50'}`}
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

          <div id="inGame" className='relative overflow-hidden rounded-lg' style={{
            width: isHovered ? mapSize.width : '250px',
            height: isHovered ? mapSize.height : '150px',
            transition: 'all 0.3s ease',
            minHeight: '150px',
            minWidth: '250px',
          }}>
            <div ref={mapContainerRef} className=' relative h-full w-full '></div>

          </div>
          <button id="guessButton"
            onClick={handleGuess}
            disabled={!guessB}
            style={{
              width: isHovered ? mapSize.width : '250px',
              transition: 'all 0.3s ease',
            }}
            className="h-10 w-full py-2 mt-2 text-lg cursor-pointer rounded-full text-white font-bold uppercase shadow-md transition ease-in-out delay-150 bg-yellow-900 hover:scale-110 duration-75 disabled:bg-black disabled:hover:scale-100 disabled:opacity-50">
            Guess
          </button>

        </div>
        <div class="absolute bottom-28 right-2 z-10 flex items-center">
          <div class={`relative bg-black bg-opacity-50 rounded-full mr-2 text-white text-xs font-bold px-2 py-1 transition-opacity duration-300 transition-transform ease-out ${tooltipClasses}`}>
            Revenir au point de départ
          </div>
          <button onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)} onClick={displayPano} title="Revenir au point de départ" class="relative rounded-full bg-black bg-opacity-50 hover:bg-opacity-100 h-10 w-10 flex items-center justify-center">
            <Image src={back}
              alt="return"
              width={30}
              height={30}
            />
          </button>
        </div>
      </>


      {showResult &&
        <div class="result-container w-full h-full">
          <div class="top-part h-5/6">
            <div class="flex justify-center items-center pt-5 absolute left-0 right-0 z-10">
              <div class="bg-black py-2 px-4 rounded-lg bg-opacity-30 pointer-events-none">
                <div class="text-white text-lg font-bold">Tour {round.current}/5</div>
              </div>
            </div>
            <div id="resultsMap" className="relative h-full">

            </div>
          </div>
          <div class="bottom-part h-1/6">
            <div class="flex justify-center items-center relative bg-purple-950 space-x-80 h-full">
              <div class="text-white">
                <div class=" uppercase uppercase font-bold">{distanceG.current} km</div>
                <div class="text-lg font-bold text-xs">Depuis la localisation</div>
              </div>
              <button onClick={nextRound}
                className="bg-green-500 py-2 px-4 rounded-full text-lg text-white shadown-md transition ease-in-out delay-150 bg-yellow-900 hover:scale-110 duration-75">
                Next Round
              </button>
              <div class="text-white">
                <div class=" uppercase font-bold">{score.current}</div>
                <div class="text-lg font-bold text-xs">sur 5 000 points</div>
              </div>
            </div>
          </div>
        </div>}
    </div>
  );
};

export default GameComponent;

