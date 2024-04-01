import React, { useState, useEffect, useCallback, useRef } from 'react';

// Import other necessary libraries and utils as before

const StreetViewComponent = ({ onLocationSelected }) => {
  const streetViewElementRef = useRef(null);
  const [initialStreetViewLocation, setInitialStreetViewLocation] = useState(null);
  const streetViewServiceRef = useRef(null);
  const streetViewPanorama = useRef(null);

  // All related functions and state that was previously in GameComponent
  // For example: showRandomStreetView, processSVData, etc.

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
  }, [processSVData]);

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

  useEffect(() => {
    // Initialization logic that was previously in GameComponent
    // Adjust as necessary to only include StreetView related initialization
  }, []);

  // Any additional logic and handlers specific to StreetView

  return (
    <div ref={streetViewElementRef} className={`w-full h-full relative`}>
      {/* Render StreetView and any other related UI here */}
    </div>
  );
};

export default StreetViewComponent;
