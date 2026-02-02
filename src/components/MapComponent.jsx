import { useEffect, useState, useRef } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  fetchEarthquakeData, 
  fetchTectonicData, 
  getMagnitudeColor, 
  getMagnitudeRadius 
} from '../utils/dataUtils';
import './MapComponent.css';

const MapComponent = () => {
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [tectonicData, setTectonicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuake, setSelectedQuake] = useState(null);
  const [viewport, setViewport] = useState({
    longitude: 96.0,
    latitude: 21.0,
    zoom: 6
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [quakes, tectonic] = await Promise.all([
          fetchEarthquakeData(),
          fetchTectonicData()
        ]);
        setEarthquakeData(quakes);
        setTectonicData(tectonic);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMapClick = (event) => {
    if (!event.features || event.features.length === 0) {
      setSelectedQuake(null);
      return;
    }

    const feature = event.features[0];
    if (feature.layer.id === 'earthquake-points') {
      setSelectedQuake({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        properties: feature.properties
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading earthquake data...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>Myanmar Earthquake Map</h1>
        <p>Tectonic lineaments and earthquake data (2025)</p>
      </div>
      
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        onClick={handleMapClick}
        interactiveLayerIds={['earthquake-points']}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: 'calc(100vh - 120px)' }}
      >
        {/* Tectonic lineaments layer */}
        {tectonicData && (
          <Source id="tectonic" type="geojson" data={tectonicData}>
            <Layer
              id="tectonic-lines"
              type="line"
              paint={{
                'line-color': '#333333',
                'line-width': 2,
                'line-opacity': 0.6
              }}
            />
          </Source>
        )}

        {/* Earthquake points layer */}
        {earthquakeData && (
          <Source id="earthquakes" type="geojson" data={earthquakeData}>
            <Layer
              id="earthquake-points"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['exponential', 2],
                  ['get', 'mag'],
                  3, 5,
                  4, 8,
                  5, 12,
                  6, 18,
                  7, 25,
                  8, 35
                ],
                'circle-color': [
                  'step',
                  ['get', 'mag'],
                  '#00ff00', 4,
                  '#ffd700', 5,
                  '#ff8c00', 6,
                  '#ff0000'
                ],
                'circle-opacity': 0.7,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }}
            />
          </Source>
        )}

        {/* Popup for selected earthquake */}
        {selectedQuake && (
          <Popup
            longitude={selectedQuake.longitude}
            latitude={selectedQuake.latitude}
            anchor="bottom"
            onClose={() => setSelectedQuake(null)}
            closeOnClick={false}
          >
            <div className="popup-content">
              <h3>Magnitude {selectedQuake.properties.mag} {selectedQuake.properties.magType}</h3>
              <p><strong>Location:</strong> {selectedQuake.properties.place}</p>
              <p><strong>Depth:</strong> {selectedQuake.properties.depth} km</p>
              <p><strong>Date:</strong> {new Date(selectedQuake.properties.time).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(selectedQuake.properties.time).toLocaleTimeString()}</p>
              <p><strong>Status:</strong> {selectedQuake.properties.status}</p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="legend">
        <h4>Magnitude Scale</h4>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#00ff00' }}></span>
          <span>&lt; 4.0</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ffd700' }}></span>
          <span>4.0 - 4.9</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff8c00' }}></span>
          <span>5.0 - 5.9</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff0000' }}></span>
          <span>≥ 6.0</span>
        </div>
        <hr />
        <div className="legend-item">
          <span className="legend-line"></span>
          <span>Tectonic Lineaments</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
