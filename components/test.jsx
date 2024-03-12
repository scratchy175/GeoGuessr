"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';


// Map Component
const Map = ({ shouldReset }) => {
  const mapRef = useRef(null); // To hold the DOM reference for the map container
  const mapInstanceRef = useRef(null); // To hold the map instance

  // Initialize the map once
  useEffect(() => {
    console.log(mapInstanceRef.current);
    if (!mapInstanceRef.current) { // Check if Google Maps is available and if we haven't already created a map instance
      const loader = new Loader({
        apiKey: "AIzaSyBAD4-_WMcL2BjZ-DxOURQ3rgfVtNGABvI", // Replace with your actual API key
        version: "weekly",
      });
      loader.load().then((google) => {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      mapInstanceRef.current = map;
      console.log('Map initialized');
      });
    }
  }, []);

  // Reset the map state
  useEffect(() => {
    if (shouldReset && mapInstanceRef.current) {
      // Logic to reset the map's state (e.g., re-center the map)
      const map = mapInstanceRef.current;
      map.setCenter({ lat: -34.397, lng: 150.644 });
      map.setZoom(8);
      console.log('Map state reset');
    }
  }, [shouldReset]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

// Parent Component
const App = () => {

  const [showResult, setShowResult] = useState(false);
  const [resetMapFlag, setResetMapFlag] = useState(false);

  const nextRound = () => {
    setShowResult(false);
    setResetMapFlag(!resetMapFlag); // Toggle to trigger the map state reset
  };

  return (
    <div>
      {!showResult && (
        <>
          <Map shouldReset={resetMapFlag} />
          
          <button onClick={() => setShowResult(true)} style={{ marginTop: '10px', padding: '10px', backgroundColor: 'blue', color: 'white' }}>
            Show Results
          </button>
        </>
      )}

      {showResult && (
        <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
          <button onClick={nextRound} style={{ backgroundColor: 'yellow', padding: '10px' }}>
            Next Round
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
