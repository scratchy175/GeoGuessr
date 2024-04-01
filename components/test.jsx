'use client';

import React, { useEffect, useRef, useState } from 'react';

// Placeholder for dynamically loading the Google Maps API
function loadGoogleMapsAPI(key) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.addEventListener('load', () => resolve());
    document.head.appendChild(script);
  });
}

function generateRandomMarkers(map) {
  // Clear previous markers
  if (window.markers) {
    window.markers.forEach(marker => marker.setMap(null));
  }

  // Generate two random locations
  const locations = [
    { lat: Math.random() * 180 - 90, lng: Math.random() * 360 - 180 },
    { lat: Math.random() * 180 - 90, lng: Math.random() * 360 - 180 },
  ];

  // Create markers and adjust map bounds
  const bounds = new window.google.maps.LatLngBounds();
  window.markers = locations.map(location => {
    const marker = new window.google.maps.Marker({
      position: location,
      map,
    });
    bounds.extend(marker.getPosition());
    return marker;
  });

  map.fitBounds(bounds);
}

export default function App() {
  const mapContainerRef = useRef(null);
  const [currentParentId, setCurrentParentId] = useState('placeholder1');
  const [map, setMap] = useState(null);

  useEffect(() => {
    loadGoogleMapsAPI('AIzaSyBAD4-_WMcL2BjZ-DxOURQ3rgfVtNGABvI').then(() => {
      const initializedMap = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });
      setMap(initializedMap);
    });
  }, []);

  const moveMapAndResize = () => {
    const newParentId = currentParentId === 'placeholder1' ? 'placeholder2' : 'placeholder1';
    const newParent = document.getElementById(newParentId);
    newParent.appendChild(mapContainerRef.current);

    // Check the target parent to determine the size
    if (newParentId === 'placeholder2') {
      // Full screen
      mapContainerRef.current.style.width = '100vw';
      mapContainerRef.current.style.height = '100vh';
      mapContainerRef.current.style.position = 'fixed';
      mapContainerRef.current.style.top = '0';
      mapContainerRef.current.style.left = '0';
    } else {
      // Small size
      mapContainerRef.current.style.width = '400px';
      mapContainerRef.current.style.height = '300px';
      mapContainerRef.current.style.position = 'relative';
    }

    setCurrentParentId(newParentId);

    if (map) {
      // Trigger resize to adapt the map to its new container size
      google.maps.event.trigger(map, 'resize');
      generateRandomMarkers(map);
    }
  };

  return (
    <div>
      <div id="placeholder1" style={{ height: '300px', margin: '20px' }}></div>
      <div id="placeholder2"></div> {/* This div becomes the full-screen container */}
      <div ref={mapContainerRef} style={{ width: '400px', height: '300px' }}></div>
      <button onClick={moveMapAndResize}
      className='relative z-50'
      
      >Toggle Full Screen</button>
    </div>
  );
}
