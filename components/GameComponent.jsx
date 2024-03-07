"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import bbox from '@turf/bbox';
import { randomPosition } from '@turf/random';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import Image from "next/image";
import logo from "@/public/logo.png";

const fetchGeoJsonData = async () => {
  try {
    const response = await fetch('/countries.geojson');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading the GeoJSON file:", error);
    throw error; // Re-throw to be caught by calling function
  }
};

const generateRandomPointInFeature = (feature) => {
  let randomPoint;
  const bboxObj = bbox(feature);
  do {
    randomPoint = randomPosition({ bbox: bboxObj });
  } while (!booleanPointInPolygon(randomPoint, feature));
  return randomPoint;
};

async function loadAdvancedMarkerLibrary() {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  return AdvancedMarkerElement;
}

const GameComponent = () => {
  const mapElementRef = useRef(null);
  const streetViewElementRef = useRef(null);
  const [globalGeoJsonData, setGlobalGeoJsonData] = useState(null);
  const streetViewServiceRef = useRef(null);
  const streetViewPanorama = useRef(null);
  const [mapSize, setMapSize] = useState({ width: '250', height: '150' }); // Use string to concatenate easily
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const [isDecreaseDisabled, setIsDecreaseDisabled] = useState(false);
  const imgElement = '<img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png" alt="Google Logo" style="width: 100px; height: 30px;" />';
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: "AIzaSyBAD4-_WMcL2BjZ-DxOURQ3rgfVtNGABvI", // Replace with your actual API key
          version: "weekly",
        });
        await loader.load();
        const { google } = window;
        const map = new google.maps.Map(mapElementRef.current, { center: { lat: 0, lng: 0 }, zoom: 2, mapId: "749a96b8b4bd0e90", disableDefaultUI: true, draggableCursor: 'crosshair', });
        mapRef.current = map; // Store the map object in useRef


        loadAdvancedMarkerLibrary().then(AdvancedMarkerElement => {
          map.addListener('click', (e) => {
            if (window.marker) {
              window.marker.setMap(null);
            }

            // Creating an instance of AdvancedMarkerElement
            window.marker = new AdvancedMarkerElement({
              position: e.latLng,
              map: map,
              title: "Your Title Here", // Optional
              // Additional properties based on AdvancedMarkerElementOptions
            });
            window.marker.content.innerHTML = imgElement


            // Optional: Listen to events on the AdvancedMarkerElement
            window.marker.addListener('click', () => {
              console.log('AdvancedMarker clicked');
              // Handle click event
            });
          });
        });


        streetViewPanorama.current = new google.maps.StreetViewPanorama(streetViewElementRef.current, {
          pov: { heading: 0, pitch: 0 },
          disableDefaultUI: true,
          zoomControl: true,
        });

        streetViewServiceRef.current = new google.maps.StreetViewService();

        const data = await fetchGeoJsonData();
        setGlobalGeoJsonData(data);
        showRandomStreetView(data.features);
      } catch (error) {
        console.error("Failed to initialize map or fetch GeoJSON:", error);
      }
    };

    initMap();
  }, []);

  const showRandomStreetView = useCallback((features, attempt = 0) => {
    if (!features.length) {
      console.error("No features available.");
      return;
    }
    const randomFeatureIndex = Math.floor(Math.random() * features.length);
    const randomFeature = features[randomFeatureIndex];
    const randomLocation = generateRandomPointInFeature(randomFeature);

    if (streetViewServiceRef.current) {
      streetViewServiceRef.current.getPanorama(
        { location: { lat: randomLocation[1], lng: randomLocation[0] }, preference: 'nearest', radius: 100000, source: 'outdoor' },
        (data, status) => processSVData(data, status, features, attempt, randomFeatureIndex)
      );
    }
  }, []);

  const processSVData = useCallback((data, status, features, attempt, randomFeatureIndex) => {
    if (status === 'OK') {
      streetViewPanorama.current.setPano(data.location.pano);
      streetViewPanorama.current.setVisible(true);
    } else if (attempt < 3) {
      showRandomStreetView(features, attempt + 1);
    } else {
      const newFeatures = features.filter((_, index) => index !== randomFeatureIndex);
      showRandomStreetView(newFeatures, 0);
    }
  }, [showRandomStreetView]);

  const increaseMapSize = () => {
    setIsDecreaseDisabled(false);

    setMapSize(currentSize => ({
      width: `${parseInt(currentSize.width) * 1.1}px`, // Increase width by 10%
      height: `${parseInt(currentSize.height) * 1.1}px`, // Increase height by 10%
    }));
  };

  const decreaseMapSize = () => {
    setMapSize(currentSize => {
      const newWidth = parseInt(currentSize.width) / 1.1;
      const newHeight = parseInt(currentSize.height) / 1.1;

      // Check if the new size is below the minimum
      if (newWidth <= 300 || newHeight <= 200) {
        setIsDecreaseDisabled(true); // Disable the decrease button
        // Optionally, you can adjust this to set the size exactly to the minimum if below
        return {
          width: Math.max(newWidth, 300),
          height: Math.max(newHeight, 200),
        };
      }

      // Enable the decrease button if it was previously disabled
      setIsDecreaseDisabled(false);
      return {
        width: newWidth,
        height: newHeight,
      };
    });
  };


  const onMouseEnter = () => {
    // Clear any existing timeout to prevent unwanted size reset if we hover again before the timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    // Set a timeout to reset the hover state after a delay
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 200); // Delay in milliseconds (e.g., 2000ms = 2 seconds)
  };


  //function to change zoom of the map by clicking on a button
  const changeZoom = () => {
    mapRef.current.setZoom(mapRef.current.zoom + 2);
  }
  return (
    <div class="flex h-screen">
      <div class="flex justify-between items-center p-1.5 absolute left-0 right-0 z-10">
        <div class="bg-yellow-800 p-2 rounded-lg shadow-md flex justify-around items-center space-x-4">
          <div class="">
            <div class="text-xs uppercase text-stone-800">Carte</div>
            <div class="text-lg font-bold">World</div>
          </div>
          <div class="text-white">
            <div class="text-xs uppercase text-stone-800">Round</div>
            <div class="text-lg font-bold">4 / 5</div>
          </div>
          <div class="text-white">
            <div class="text-xs uppercase text-stone-800">Score</div>
            <div class="text-lg font-bold">61</div>
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
      {/*<div ref={streetViewElementRef} className="w-full h-full relative"></div>*/}
      <div className="absolute w-1/5 bottom-2.5 left-2.5 z-10 "
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >

        <button onClick={increaseMapSize}
          style={{
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.3s ease',
          }}

          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Increase Map Size
        </button>
        <button onClick={decreaseMapSize}
          disabled={isDecreaseDisabled}
          style={{
            opacity: isHovered ? 1 : 0,
            backgroundColor: isDecreaseDisabled ? 'gray' : 'red',
            transition: 'all 0.3s ease',
          }}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Decrease Map Size
        </button>
        <button onClick={changeZoom}
          style={{
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.3s ease',
          }}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Change Zoom
        </button>

        <div
          ref={mapElementRef}
          style={{
            width: isHovered ? mapSize.width : '250px',
            height: isHovered ? mapSize.height : '150px',
            transition: 'all 0.3s ease',
          }}
          className="map-container"
        >
          {/* Map will be rendered here */}
        </div>
        <button id="guessButton"
          style={{
            width: isHovered ? mapSize.width : '250px',
            transition: 'all 0.3s ease',
          }}


          className="h-10 w-full py-2 mt-2 text-lg cursor-pointer border-none rounded-lg text-stone-800 shadow-md transition ease-in-out delay-150 bg-yellow-900 hover:-translate-y-1 hover:scale-102 hover:bg-yellow-950 duration-75">
          Guess
        </button>
      </div>

    </div>
  );
};

export default GameComponent;
