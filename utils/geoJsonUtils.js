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