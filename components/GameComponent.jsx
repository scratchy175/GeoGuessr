"use client"
// Importation des bibliothèques et des modules nécessaires.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import distance from '@turf/distance';
import Image from "next/image";
import { fetchGeoJsonData, generateRandomPointInFeature } from '@/utils/geoJsonUtils';
import GameInfoBar from './GameInfoBar';
import MapContainer from './MapContainer';



// Importation des images depuis le dossier public.
import back from "@/public/retour.svg";

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
  const showResultRef = useRef(showResult);




  const initialTime = 100; // 300 = 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);


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
  }, []);




  // Fonction pour gérer le clic sur le bouton "Guess".
  const handleGuess = () => {
    const bounds = new google.maps.LatLngBounds();
    moveMapAndResize();
    addResultMarker();
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
      score.current = Math.round(5000 * Math.exp(-10 * distance2 / 4000));
      totalScore.current += score.current;
      distanceG.current = Math.round(distance2);

      const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 4,
      };

      window.line = new google.maps.Polyline({
        path: [user_position, initialStreetViewLocation],
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
      bounds.extend(user_position);

    }
    bounds.extend(initialStreetViewLocation);
    setTimeout(() => {
      mapRef.current.fitBounds(bounds);
    }, 100);
  }

  const addResultMarker = () => {
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
        position: initialStreetViewLocation,
        map: mapRef.current,
        content: markerDiv, // Optional
      });
    });

  }

  const nextRound = () => {
    moveMapAndResize();
    showRandomStreetView(globalGeoJsonData.features);
    console.log('Next round');
    if (window.marker) {
      window.marker.setMap(null);
      window.marker = null;
      window.line.setMap(null);
    }
    window.marker2.setMap(null);

    mapRef.current.setZoom(2);
    mapRef.current.setCenter({ lat: 0, lng: 0 });
    round.current++;
    isGuessB(false);
    resetTimer();
  }

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

  return (
    <div class="flex flex-auto relative h-screen">
      <div className={`w-full h-full relative ${showResult ? 'hidden' : ''}`}>

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

