"use client"
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -34.397,
  lng: 150.644
};

const MapPage = () => {
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMap = () => {
    setLoading(true);
    setTimeout(() => {
      setShowMap(!showMap);
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && !showMap && (
        <button onClick={toggleMap}>Show Map</button>
      )}
      {!loading && showMap && (
        <>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            <Marker position={center} />
          </GoogleMap>
          <button onClick={toggleMap}>Hide Map</button>
        </>
      )}
    </div>
  );
};

const WrappedMapPage = () => (
  <LoadScript googleMapsApiKey="AIzaSyBAD4-_WMcL2BjZ-DxOURQ3rgfVtNGABvI">
    <MapPage />
  </LoadScript>
);

export default WrappedMapPage;
