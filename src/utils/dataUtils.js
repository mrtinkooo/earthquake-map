import Papa from 'papaparse';

// Fetch and parse CSV earthquake data
export const fetchEarthquakeData = async () => {
  try {
    const response = await fetch('/query.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const geojson = csvToGeoJSON(results.data);
          resolve(geojson);
        },
        error: (error) => reject(error)
      });
    });
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    throw error;
  }
};

// Convert CSV data to GeoJSON format
const csvToGeoJSON = (data) => {
  const features = data
    .filter(row => row.latitude && row.longitude && row.mag)
    .map(row => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
      },
      properties: {
        time: row.time,
        mag: parseFloat(row.mag),
        depth: parseFloat(row.depth),
        place: row.place,
        magType: row.magType,
        status: row.status,
        id: row.id
      }
    }));

  return {
    type: 'FeatureCollection',
    features
  };
};

// Fetch tectonic lineaments GeoJSON
export const fetchTectonicData = async () => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/drtinkooo/myanmar-earthquake-archive/refs/heads/main/Myanmar_Tectonic_Map_2011.geojson'
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching tectonic data:', error);
    throw error;
  }
};

// Get color based on magnitude
export const getMagnitudeColor = (magnitude) => {
  if (magnitude >= 6) return '#ff0000';      // Red
  if (magnitude >= 5) return '#ff8c00';      // Orange
  if (magnitude >= 4) return '#ffd700';      // Yellow
  return '#00ff00';                          // Green
};

// Get circle radius based on magnitude
export const getMagnitudeRadius = (magnitude) => {
  return Math.pow(2, magnitude) * 0.3;
};
