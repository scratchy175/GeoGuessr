"use client"
// Importation des bibliothèques et des modules nécessaires.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import distance from '@turf/distance';
import Image from "next/image";
import { fetchGeoJsonData, generateRandomPointInFeature } from '@/utils/geoJsonUtils';
import GameInfoBar from './GameInfoBar';
import MapContainer from './MapContainer';
import { addRound } from '@/services/addRound';
import { getRounds } from '@/services/getRounds';
import { useRouter } from 'next/navigation';
import { useGameActions } from "@/hooks/useGameActions";

import './style.css';


// Importation des images depuis le dossier public.
import back from "@/public/retour.svg";
import map from "@/public/Globe_Light.svg";

// Fonction asynchrone pour charger une bibliothèque Google Maps avancée pour les marqueurs.
async function loadAdvancedMarkerLibrary() {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  return AdvancedMarkerElement;
}

// Le composant principal du jeu.
const GameComponent = ({ params }) => {
  // Utilisation des hooks pour gérer l'état et les références.
  const streetViewElementRef = useRef(null);
  const [globalGeoJsonData, setGlobalGeoJsonData] = useState(null);
  const streetViewServiceRef = useRef(null);
  const streetViewPanorama = useRef(null);


  const round = useRef(1);
  const totalScore = useRef(0);
  const distanceG = useRef(0);
  const score = useRef(0);
  const mapRef = useRef(null);
  const [guessB, isGuessB] = useState(false);
  const [initialStreetViewLocation, setInitialStreetViewLocation] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);



  const mapContainerRef = useRef(null);

  const [showResult, setShowResult] = useState(false);
  const showResultRef = useRef(showResult);
  const [waitingScreen, setWaitingScreen] = useState(true);
  const [currentParentId, setCurrentParentId] = useState('inGame');



  const [endGame, setEndGame] = useState(false);

  const initialTime = 100; // 300 = 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const { handlePlayClick } = useGameActions();

  const [showDetails, setShowDetails] = useState(false);


  const resetTimer = (newTime = initialTime) => {
    setTimeLeft(newTime);
  };

  const handleTimerComplete = () => {
    if (!showResult) {
      console.log('Timer completed!');
      handleGuess();
    }
  };

  useEffect(() => {
    showResultRef.current = showResult;
  }, [showResult]);


  useEffect(() => {
    if (mapRef.current) {
      // Change the cursor style based on whether showResult is true or false.
      mapRef.current.setOptions({
        draggableCursor: showResult ? 'default' : 'crosshair',
      });
    }
  }, [showResult]);

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
          showRoadLabels: false,

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

  const moveMapAndResize = useCallback(() => {

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
  }, [currentParentId, showResult]);

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
      setTimeout(() => {

        streetViewPanorama.current.setPano(data.location.pano);
        streetViewPanorama.current.setVisible(true);
        // log loccation


      }, 1);
      setWaitingScreen(false);



      console.log('Street View data:', data.getLocation().latLng.toJSON());
      console.log('Initial Street View location:', streetViewPanorama.current.getPosition());

    } else if (attempt < 3) {
      showRandomStreetView(features, attempt + 1);
    } else {
      const newFeatures = features.filter((_, index) => index !== randomFeatureIndex);
      showRandomStreetView(newFeatures, 0);
    }
  }, []);




  // Fonction pour gérer le clic sur le bouton "Guess".
  const handleGuess = useCallback(() => {
    moveMapAndResize();



    const bounds = new google.maps.LatLngBounds();
    addResultMarker(initialStreetViewLocation, '/mapPoint.webp');
    if (window.marker) {
      const user_position = {
        lat: window.marker.position.lat,
        lng: window.marker.position.lng
      };
      const from = [user_position.lng, user_position.lat];
      const to = [initialStreetViewLocation.lng, initialStreetViewLocation.lat];
      const options = { units: 'kilometers' };
      const distance2 = distance(from, to, options);
      console.log(distance2);
      score.current = Math.round(5000 * Math.exp(-10 * distance2 / 16000));
      totalScore.current += score.current;
      distanceG.current = Math.round(distance2);

      drawLine(user_position, initialStreetViewLocation);



      bounds.extend(user_position);

    }
    else {
      distanceG.current = 0;
    }
    bounds.extend(initialStreetViewLocation);
    setTimeout(() => {
      mapRef.current.fitBounds(bounds);
    }, 100);
    const mapPointString = `(${initialStreetViewLocation.lat}, ${initialStreetViewLocation.lng})`;
    const userPointString = `(${window.marker?.position.lat}, ${window.marker?.position.lng})`;
    addRound(params.id, round.current, score.current, distanceG.current, initialTime - timeLeft, userPointString, mapPointString)

  }, [initialStreetViewLocation, moveMapAndResize]);

  const drawLine = (user_position, mapLocation) => {
    const lineSymbol = {
      path: "M 0,-1 0,1",
      strokeOpacity: 1,
      scale: 4,
    };

    window.line = new google.maps.Polyline({
      path: [user_position, mapLocation],
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
  };

  const addResultMarker = (location, marker_Path, markerNumber) => {
    // Charger la bibliothèque des marqueurs avancés
    loadAdvancedMarkerLibrary().then(AdvancedMarkerElement => {
      // Créer un conteneur pour le marqueur et le numéro
      const markerContainer = document.createElement('div');
      markerContainer.style.position = 'relative';
      markerContainer.style.display = 'flex';
      markerContainer.style.justifyContent = 'center';
      markerContainer.style.alignItems = 'center';
      markerContainer.style.width = '40px';
      markerContainer.style.height = '40px';
      markerContainer.style.transform = 'translate(0, +20%)';


      // Créer un marqueur pour la position de l'utilisateur
      const markerDiv = document.createElement('img');
      markerDiv.src = marker_Path;
      markerDiv.style.width = '100%'; // Use 100% to fill the container
      markerDiv.style.height = '100%'; // Use 100% to fill the container
      markerDiv.style.borderRadius = '30px';
      markerDiv.style.borderWidth = '4px';
      markerDiv.style.borderColor = 'white';


      // Ajouter le marqueur au conteneur
      markerContainer.appendChild(markerDiv);
      if (markerNumber) {
        // Créer un élément pour le numéro
        const numberDiv = document.createElement('div');
        numberDiv.textContent = markerNumber; // Set the marker number
        numberDiv.style.position = 'absolute'; // Position it over the marker
        numberDiv.style.color = 'black'; // Choose a text color that stands out
        numberDiv.style.fontWeight = 'bold'; // Make the number bold
        numberDiv.style.fontSize = '12px'; // Adjust font size as needed
        numberDiv.style.backgroundColor = 'white'; // Use a white background
        numberDiv.style.borderRadius = '100%'; // Make the background a circle
        numberDiv.style.width = '18px'; // Set the width of the number
        numberDiv.style.height = '18px'; // Set the height of the number
        numberDiv.style.display = 'flex'; // Use flex to center the number
        numberDiv.style.justifyContent = 'center'; // Center the number
        numberDiv.style.alignItems = 'center'; // Center the number
        numberDiv.style.transform = 'translate(75%, 75%)'; // Center the number


        // Ajouter le numéro au conteneur
        markerContainer.appendChild(numberDiv);
      }

      // Creating an instance of AdvancedMarkerElement
      window.marker2 = new AdvancedMarkerElement({
        position: location,
        map: mapRef.current,
        content: markerContainer, // Use the container as the content
      });
    });
  }


  const nextRound = useCallback(() => {
    if (window.marker) {
      window.marker.setMap(null);
      window.marker = null;
      window.line.setMap(null);
    }
    window.marker2.setMap(null);
    if (round.current === 2) {
      setEndGame(true);
      handleEndGame();
      return;
    }
    moveMapAndResize();
    //streetViewPanorama.current.setVisible(false);
    setWaitingScreen(true);
    showRandomStreetView(globalGeoJsonData.features);
    console.log('Next round');


    mapRef.current.setZoom(2);
    mapRef.current.setCenter({ lat: 0, lng: 0 });
    round.current++;
    isGuessB(false);
    resetTimer();
    score.current = 0;
  }, [globalGeoJsonData, moveMapAndResize, showRandomStreetView]);

  const initializeMarker = () => {
    loadAdvancedMarkerLibrary().then(AdvancedMarkerElement => {
      mapRef.current.addListener('click', (e) => {
        if (!showResultRef.current) {
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
        }
      });
    });
  }

  const displayPano = () => {
    streetViewPanorama.current.setPosition(initialStreetViewLocation);
    streetViewPanorama.current.setVisible(true);
  }

  const router = useRouter();


  const quit = () => {
    router.push('/');
  }


  const switchResultMode = () => {
    setShowDetails(!showDetails);

    console.log('Show details');
  }

  // Add key press event listener
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.keyCode === 32) { // Check if the pressed key is space
        event.preventDefault(); // Prevent the default action of the space key (scrolling)
        if (!showResult && guessB) { // Check if the game is in a state where guessing is allowed
          handleGuess();

        } else if (showResult) { // Check if the game is in a state to proceed to the next round
          nextRound();


        }
      }
    };

    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showResult, guessB, handleGuess, nextRound]); // Dependencies: re-attach the listener when these values change


  const handleEndGame = () => {
    const bounds = new google.maps.LatLngBounds();
    getRounds(params.id).then((rounds) => {
      console.log('Rounds:', rounds.result);
      rounds.result.forEach((round) => {
        console.log(round.map_point);
        const locationParts = round.map_point.replace(/[()]/g, '').split(', ');
        const locationObject = {
          lat: parseFloat(locationParts[0]),
          lng: parseFloat(locationParts[1])
        };
        addResultMarker(locationObject, '/mapPoint.webp', round.round_nb);
        const userLocationParts = round.user_point.replace(/[()]/g, '').split(', ');
        const userLocationObject = {
          lat: parseFloat(userLocationParts[0]),
          lng: parseFloat(userLocationParts[1])
        };
        addResultMarker(userLocationObject, '/Marker5.webp');
        drawLine(userLocationObject, locationObject);
        bounds.extend(userLocationObject);

        bounds.extend(locationObject);

        setTimeout(() => {
        const gameDetails = document.getElementById('gameDetails')

        const roundDetailsDiv = createRoundDetailElement(round);
  gameDetails.appendChild(roundDetailsDiv);
        }
        , 1000);

      });
    });
    setTimeout(() => {
      mapRef.current.fitBounds(bounds);
    }, 500);
    console.log('End game');

  }

  const createRoundDetailElement = (round) => {
    // Main container for the round detail
    const roundDetailsDiv = document.createElement('div');
    roundDetailsDiv.className = 'flex items-center bg-purple-950 text-white rounded-lg shadow-lg my-2';
    roundDetailsDiv.style.padding = '0.5rem';
    roundDetailsDiv.style.alignItems = 'center';
    roundDetailsDiv.style.display = 'flex';
    roundDetailsDiv.style.justifyContent = 'space-between';
  
    // Round number
    const roundNumber = document.createElement('div');
    roundNumber.className = 'flex items-center justify-center bg-yellow-400 text-black rounded-full';
    roundNumber.style.width = '2.5rem';
    roundNumber.style.height = '2.5rem';
    roundNumber.textContent = round.round_nb;
    roundDetailsDiv.appendChild(roundNumber);
  
    // Details container
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'flex flex-col flex-grow ml-4 bg-blue-600 rounded-lg';
    detailsContainer.style.padding = '0.5rem';
  
    // Score
    const score = document.createElement('div');
    score.textContent = `${round.score} points`;
    score.className = 'font-bold';
    detailsContainer.appendChild(score);
  
    // Distance and time
    const distanceTime = document.createElement('div');
    distanceTime.textContent = `${round.distance} km - ${round.time}`;
    distanceTime.className = 'text-sm';
    detailsContainer.appendChild(distanceTime);
  
    roundDetailsDiv.appendChild(detailsContainer);
  
    return roundDetailsDiv;
  };
  

  return (



    <div class="flex flex-auto relative h-screen">


      {waitingScreen &&
        <div id="waitingScreen" className="waiting-screen flex flex-col justify-center items-center">
          <div className="loader-container">
            <div className="map-container flex justify-center items-center">
              <Image src={map} alt="map" width={100} height={100} />
            </div>
            <div className="loader"></div>

          </div>
          <div className="text relative b-5 text-white">Chargement de la carte...</div>
        </div>

      }
      <div className={`w-full h-full relative ${showResult || waitingScreen ? 'hidden' : ''}`}>

        <GameInfoBar
          round={round.current}
          totalScore={totalScore.current}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          handleTimerComplete={handleTimerComplete}
        />
        {<div ref={streetViewElementRef}
          className="w-full h-full relative">
        </div>}

        <MapContainer
          mapRef={mapRef}
          mapContainerRef={mapContainerRef}
          handleGuess={handleGuess}
          guessB={guessB}
        />

        <div class="absolute bottom-28 right-2 z-10 flex items-center">
          <div class={`relative bg-black bg-opacity-50 rounded-full mr-2 text-white text-xs font-bold px-2 py-1 transition-opacity duration-300 transition-transform ease-out ${showTooltip
            ? "opacity-100 scale-100" // Tooltip visible
            : "opacity-0 scale-0"}`}>
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
      </div>

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
    </div>
  );
};

export default GameComponent;

