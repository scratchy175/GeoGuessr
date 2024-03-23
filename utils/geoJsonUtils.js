import bbox from '@turf/bbox';
import { randomPosition } from '@turf/random';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';


// Fonction asynchrone pour charger les données GeoJSON.
export const fetchGeoJsonData = async () => {
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
export const generateRandomPointInFeature = (feature) => {
  let randomPoint;
  const bboxObj = bbox(feature);
  do {
    randomPoint = randomPosition({ bbox: bboxObj });
  } while (!booleanPointInPolygon(randomPoint, feature));
  return randomPoint;
};