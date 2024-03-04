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
    streetViewServiceRef.current.getPanorama({location: location, preference: 'best', radius: 100000, source: 'outdoor'}, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK) {
        streetViewPanorama.setPano(data.location.pano);
        streetViewPanorama.setVisible(true);
        console.log("Street View panorama found and set.");
      } else {
        console.error("No Street View panorama found for this location.");
      }
    });


  return (
    <div>
      <div ref={mapElementRef} style={{ height: '400px', width: '100%' }}></div>
      <div ref={streetViewElementRef} style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

  return (
    <div>
      <div ref={mapElementRef} style={{ height: '400px', width: '100%' }}></div>
      <div ref={streetViewElementRef} style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default GameComponent;

