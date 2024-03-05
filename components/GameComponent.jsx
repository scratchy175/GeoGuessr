"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import bbox from '@turf/bbox';
import { randomPosition } from '@turf/random';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

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

const GameComponent = () => {
  const mapElementRef = useRef(null);
  const streetViewElementRef = useRef(null);
  const [globalGeoJsonData, setGlobalGeoJsonData] = useState(null);
  const streetViewServiceRef = useRef(null);
  const streetViewPanorama = useRef(null);


  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: "AIzaSyBAD4-_WMcL2BjZ-DxOURQ3rgfVtNGABvI", // Replace with your actual API key
          version: "weekly",
        });
        await loader.load();
        const { google } = window;
        new google.maps.Map(mapElementRef.current, { center: { lat: 0, lng: 0 }, zoom: 2 });
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

  return (
    <div class="h-screen">
      <div class="flex justify-between items-center p-1.5 absolute left-0 right-0 mx-2.5 z-10">
        <span class="bg-blue-500 py-1.5 px-2.5 rounded mx-auto">
          Timer
        </span>
        <span class="bg-green-500 py-1.5 px-2.5 rounded">
          Score
        </span>
      </div>
      <div ref={streetViewElementRef} className="w-full h-full relative">
        <div className="absolute w-1/5 bottom-2.5 left-2.5 z-10">
          <div ref={mapElementRef} className="h-72 w-full rounded-lg shadow-none border-none">
          </div>
          <button id="guessButton" className="w-full py-2.5 mt-2.5 text-lg cursor-pointer border-none rounded-lg bg-blue-600 text-white shadow-md transition ease-in-out delay-150 bg-blue-500 hover:-translate-1 hover:scale-105 hover:bg-indigo-500 duration-75">
            Guess
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
