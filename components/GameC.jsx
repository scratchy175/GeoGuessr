"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import turfBbox from '@turf/bbox';
import { randomPoint } from '@turf/random';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';

const GameComponent = () => {
  const mapElementRef = useRef(null);
  const streetViewElementRef = useRef(null);
  const [globalGeoJsonData, setGlobalGeoJsonData] = useState(null);
  const streetViewServiceRef = useRef(null);
  
  const fetchGeoJsonData = async () => {
    console.log("Fetching GeoJSON data...");
    try {
          const response = await fetch('/countries.geojson') // Make sure this path is correct and accessible
              ;
          const data = await response.json();
          console.log("Fetched GeoJSON Data:", data); // Verify data is fetched
          setGlobalGeoJsonData(data);
          return data;
      } catch (error) {
          return console.error("Error loading the GeoJSON file:", error);
      }
  };
  
  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyBAD4-_WMcL2BjZ-DxOURQ3rgfVtNGABvI", // Use your actual API key
      version: "weekly",
    });
  
    loader.load().then(() => {
      const { google } = window;
      const map = new google.maps.Map(mapElementRef.current, { center: { lat: 0, lng: 0 }, zoom: 2 });
      const streetViewPanorama = new google.maps.StreetViewPanorama(streetViewElementRef.current, {
        pov: { heading: 0, pitch: 0 },
        disableDefaultUI: true,
        zoomControl: true,
      });
      console.log("Map and Street View Panorama initialized.uvyjgjgyig");
      streetViewServiceRef.current = new google.maps.StreetViewService();
      console.log(globalGeoJsonData);
      // Fetch and use the GeoJSON data
      fetchGeoJsonData().then((data) => {
        // Use the data directly after it's fetched
        console.log("GeoJSON data loaded.", data, globalGeoJsonData);
        if (data) {
          showRandomStreetView(data.features);
        }
      });
    });
  }, []);
  



  const showRandomStreetView = (features) => {
    if (!features.length) {
      console.error("No features available in GeoJSON data.");
      return;
    }
    const randomFeature = features[Math.floor(Math.random() * features.length)];
    const bbox = turfBbox(randomFeature);
    const randomPt = randomPoint(1, { bbox: bbox }).features[0];
    const location = { lat: randomPt.geometry.coordinates[1], lng: randomPt.geometry.coordinates[0] };
    streetViewServiceRef.current.getPanorama({ location: location, radius: 5000 }, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK) {
        streetViewPanorama.setPano(data.location.pano);
        streetViewPanorama.setVisible(true);
        console.log("Street View panorama found and set.");
      } else {
        console.error("No Street View panorama found for this location.");
      }
    });
  };

  return (
    <div>
      <div ref={mapElementRef} style={{ height: '400px', width: '100%' }}></div>
      <div ref={streetViewElementRef} style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default GameComponent;

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
          ++
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
        <button onClick={ZoomIn}
          style={{
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.3s ease',
          }}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
          <Image src={plus}
            alt="plus"
            width={10}
            height={10}
          />
        </button>
        <button onClick={ZoomOut}
          className="absolute mt-5 rounded-full bg-red-500 z-20">
          <Image src={minus}
            alt="minus"
            width={20}
            height={20}
          />
        </button>

        <div
          ref={mapElementRef}
          style={{
            width: isHovered ? mapSize.width : '250px',
            height: isHovered ? mapSize.height : '150px',
            transition: 'all 0.3s ease',
          }}
          className="relative map-container"
        >
          {/* Map will be rendered here */}
        </div>
        <button id="guessButton"
          style={{
            width: isHovered ? mapSize.width : '250px',
            transition: 'all 0.3s ease',
          }}
          className="h-10 w-full py-2 mt-2 text-lg cursor-pointer border-none rounded-full text-stone-800 shadow-md transition ease-in-out delay-150 bg-yellow-900 hover:-translate-y-1 hover:scale-102 hover:bg-yellow-950 duration-75">
          Guess
        </button>
      </div>

    </div>