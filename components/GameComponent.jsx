"use client"
// Importation des bibliothèques et des modules nécessaires.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import bbox from '@turf/bbox';
import { randomPosition } from '@turf/random';
import distance from '@turf/distance';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import Image from "next/image";

// Importation des images depuis le dossier public.
import logo from "@/public/logo.png";
import plus from "@/public/Plus_black.svg";
import minus from "@/public/Minus_black.svg";
import arrow from "@/public/Arrow.svg";
import stick from "@/public/World_Game_Stick.svg";

// Fonction asynchrone pour charger les données GeoJSON.
const fetchGeoJsonData = async () => {
  try {
    const response = await fetch('/countries.geojson');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading the GeoJSON file:", error);
    throw error; // Re-lancer l'erreur pour qu'elle soit gérée par la fonction appelante.
  }
};

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
  const mapElementRef = useRef(null);
  const streetViewElementRef = useRef(null);
  const [globalGeoJsonData, setGlobalGeoJsonData] = useState(null);
  const streetViewServiceRef = useRef(null);
  const streetViewPanorama = useRef(null);
  const [mapSize, setMapSize] = useState({ width: '250', height: '150' });
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const [isDecreaseDisabled, setIsDecreaseDisabled] = useState(false);
  const mapRef = useRef(null);
  const [isPinned, setIsPinned] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const resultMapRef = useRef(null);
  const round = useRef(1);
  const totalScore = useRef(0);
  const score = useRef(0);

  useEffect(() => {
    // Initialisation de la carte et chargement des données GeoJSON.
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: "AIzaSyBAD4-_WMcL2BjZ-DxOURQ3rgfVtNGABvI", // Remplacer par votre clé API réelle.
          version: "weekly",
        });
        await loader.load();
        const { google } = window;
        console.log('Google Maps API loaded:');
        const map = new google.maps.Map(mapElementRef.current, { center: { lat: 0, lng: 0 }, zoom: 2, mapId: "749a96b8b4bd0e90", disableDefaultUI: true, draggableCursor: 'crosshair', });
        mapRef.current = map; // Store the map object in useRef
        initializeMarker()

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

  // Fonction pour augmenter la taille de la carte.
  const increaseMapSize = () => {
    setIsDecreaseDisabled(false);

    setMapSize(currentSize => ({
      width: `${parseInt(currentSize.width) * 1.5}px`, // augmenter la largeur de 10%
      height: `${parseInt(currentSize.height) * 1.5}px`, // augmenter la hauteur de 10%
    }));
  };
  // Fonction pour diminuer la taille de la carte.
  const decreaseMapSize = () => {
    setMapSize(currentSize => {
      const newWidth = parseInt(currentSize.width) / 1.5;
      const newHeight = parseInt(currentSize.height) / 1.5;

      // Vérifier si la taille est inférieure à la taille minimale
      if (newWidth <= 300 || newHeight <= 200) {
        setIsDecreaseDisabled(true); // Désactiver le bouton de diminution
        return {
          width: Math.max(newWidth, 300),
          height: Math.max(newHeight, 200),
        };
      }

      // Activer le bouton de diminution
      setIsDecreaseDisabled(false);
      return {
        width: newWidth,
        height: newHeight,
      };
    });
  };

  // Fonction pour gérer le survol de la carte.
  const onMouseEnter = () => {
    if (isPinned) {
      return;
    }
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
    }
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
    setIsPinned(!isPinned);
    // si la carte est épinglée, faire pivoter l'image vers la droite
    if (isPinned) {
      document.getElementById('pinButton').style.transform = 'rotate(90deg)';
    }
    // sinon, faire pivoter l'image vers la gauche
    else {
      document.getElementById('pinButton').style.transform = 'rotate(0deg)';
    }
  }

  // Fonction pour gérer le clic sur le bouton "Guess".
  const handleGuess = () => {
    const user_position = { 
      lat: window.marker.position.lat, 
      lng: window.marker.position.lng 
    };
    const map_position = { 
      lat: streetViewPanorama.current.location.latLng.lat(), 
      lng: streetViewPanorama.current.location.latLng.lng() 
    };
    // Calculer la distance entre les deux points
    const distanceG = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(user_position), new google.maps.LatLng(map_position));
    console.log(distanceG/1000);

    const from = [user_position.lng, user_position.lat];
    const to = [map_position.lng, map_position.lat];
    const options = { units: 'kilometers' };
    const distance2 = distance(from, to, options);
    console.log(distance2);
    score.current += 5000 - distance2 * 2000;
    totalScore.current += score.current;
    
    const lineSymbol = {
      path: "M 0,-1 0,1",
      strokeOpacity: 1,
      scale: 4,
    };
    // Dessiner une ligne entre les deux points
    const line = new google.maps.Polyline({
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
      markerDiv.src = '/Marker.svg';
      markerDiv.style.className = 'custom-marker';
      markerDiv.style.width = '30px';
      markerDiv.style.height = '30px';
      markerDiv.style.transform = 'translate(0, +40%)'; // Centrer le marqueur

      // Créer une instance de AdvancedMarkerElement
      const marker = new AdvancedMarkerElement({
        position: map_position,
        map: mapRef.current,
        title: "Your Title Here", // Optional
        content: markerDiv, // Optional
      });
    });
    setTimeout(() => {
    const bounds = new google.maps.LatLngBounds();
      bounds.extend(user_position);
      bounds.extend(map_position);
      console.log(bounds);
      console.log(mapRef.current.getBounds());
      mapRef.current.fitBounds(bounds,100);
      console.log(mapRef.current.getBounds());
    }, 5000);
    setShowResult(!showResult);
    setTimeout(() => {
      moveToContainer('resultMap')

    }, 100);
  }

  // Fonction pour passer au tour suivant.
  const nextRound = () => {
    setShowResult(false);
    console.log('Next round');
    console.log(window.marker);
    mapRef.current.setZoom(2);
    mapRef.current.setCenter({ lat: 0, lng: 0 });
    round.current++;
    setTimeout(() => {
      moveToContainer('map-container')

    }, 100);
  }
  // Fonction pour initialiser le marqueur avancé.
  const initializeMarker = () => {
    loadAdvancedMarkerLibrary().then(AdvancedMarkerElement => {
      mapRef.current.addListener('click', (e) => {
        if (window.marker) {
          window.marker.setMap(null);
        }

        const markerDiv = document.createElement('img');
        markerDiv.src = '/Marker.svg';
        markerDiv.style.className = 'custom-marker';
        markerDiv.style.width = '30px';
        markerDiv.style.height = '30px';
        markerDiv.style.transform = 'translate(0, +40%)'; // Centrer le marqueur




        window.marker = new AdvancedMarkerElement({
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          },
          map: mapRef.current,
          title: "Your Title Here",
          content: markerDiv, 

        });
      });
    });
  }

  // Fonction pour déplacer le contenu de la carte vers un autre conteneur.
  const moveToContainer = (targetContainerId) => {
    const mapDiv = mapElementRef.current; 
    const targetContainer = document.getElementById(targetContainerId); 
    if (mapDiv && targetContainer) {
      google.maps.event.trigger(mapRef.current, 'resize');
      targetContainer.appendChild(mapDiv.childNodes[0]);
      mapElementRef.current = targetContainer

    }
  };

// Retourner le contenu du composant.
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

          <span class="bg-yellow-600 py-2 px-4 rounded-lg text-base absolute left-1/2 transform -translate-x-1/2">
            Timer
          </span>
          <Image
            className="h-10 w-auto mr-4"
            src={logo}
            alt="logo"
          />
        </div>
        {<div ref={streetViewElementRef}
          className={`w-full h-full relative ${showResult ? 'hidden' : ''}`}>
        </div>}
        <div className={`absolute bottom-5 left-5 z-10 ${showResult ? 'hidden' : ''}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
          <div id="mapButtons"
            class="relative p-2 space-x-2 max-w-max max-h-10 rounded-t-lg"
            style={{
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
              transition: 'all 0.3s ease',
            }}>

            <button onClick={increaseMapSize}
              style={{
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
            <button onClick={decreaseMapSize}
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

          <div
            id="map-container"
            ref={mapElementRef}
            style={{
              width: isHovered ? mapSize.width : '250px',
              height: isHovered ? mapSize.height : '150px',
              transition: 'all 0.3s ease',
              minHeight: '150px',
              minWidth: '250px',
            }}
            className="relative"
          >
            {/* Map will be rendered here */}
          </div>
          <button id="guessButton"
            onClick={handleGuess}
            style={{
              width: isHovered ? mapSize.width : '250px',
              transition: 'all 0.3s ease',
            }}
            className="h-10 w-full py-2 mt-2 text-lg cursor-pointer border-none rounded-full text-stone-800 font-bold uppercase shadow-md transition ease-in-out delay-150 bg-yellow-900 hover:scale-110 hover:bg-yellow-950 duration-75 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100">
            Guess
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
            <div
              id='resultMap'
              className="w-full h-full flex relative overflow-hidden"
            >
              {/* Map will be rendered here */}
            </div>
          </div>
          <div class="bottom-part h-1/6">
            <div class="flex justify-center items-center relative bg-purple-950 space-x-80 h-full">
            <div class="text-white">
              <div class=" uppercase uppercase font-bold">0 km</div>
              <div class="text-lg font-bold text-xs">Depuis la localisation</div>
            </div>
              <button onClick={nextRound}
                className="bg-green-500 py-2 px-4 rounded-lg text-base">
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
