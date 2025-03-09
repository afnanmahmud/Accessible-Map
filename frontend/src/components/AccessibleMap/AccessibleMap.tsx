import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Icon, Style, Stroke } from 'ol/style';
import LineString from 'ol/geom/LineString';
import { defaults as defaultControls } from 'ol/control';
import { AccessibleMapProps } from '@/types';
import MapSearch from '../MapSearch/MapSearch';
import NavButtonGroup from '../NavButtonGroup';
import 'ol/ol.css';
import './AccessibleMap.css';
import Openrouteservice from 'openrouteservice-js';

const orsDirections = new Openrouteservice.Directions({
  api_key: '5b3ce3597851110001cf6248a1d686e75cef4e86a9782464ccdb71cf',
});

const AccessibleMap: React.FC<AccessibleMapProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const [currentView, setCurrentView] = useState<'standard' | 'satellite'>('standard');
  const vectorSourceRef = useRef(new VectorSource());
  const userMarkerRef = useRef(new Feature()); // User's live marker
  
  // State for route calculation
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; coordinates: number[] }>>([]);
  
  // Accessible entry marker locations
  const locations = [
    { name: 'Carmicheal Student Center', coordinates: [-84.5831447839737, 34.038533480073355] },
    { name: 'Carmicheal Student Center 2', coordinates: [-84.58283364772798, 34.038660170620055] },
    { name: 'Academic Learning Center', coordinates: [-84.58317697048189, 34.03931806936354] },
    { name: 'Academic Learning Center 2', coordinates: [-84.58298921585084, 34.03978259614599] },
    { name: 'English', coordinates: [-84.58414524793626, 34.03942475516541] },
    { name: 'English 2', coordinates: [-84.5841532945633, 34.03910025210137] },
    { name: 'English 3', coordinates: [-84.58402454853059, 34.03979815441523] },
    { name: 'University Hall', coordinates: [-84.58437055349351, 34.038938000103784] },
    { name: 'Willingham Hall', coordinates: [-84.58483189344408, 34.038973562212] },
    { name: 'Social Sciences', coordinates: [-84.58521813154222, 34.03870240076022] },
  ];

  useEffect(() => {
    if (!mapRef.current) return;

    const vectorLayer = new VectorLayer({ 
      source: vectorSourceRef.current 
    });

    const standardLayer = new TileLayer({ 
      source: new OSM(), visible: true 
    });

    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 19,
      }),
      visible: false,
    });

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [standardLayer, satelliteLayer, vectorLayer],
      view: new View({
        center: fromLonLat([-84.5831, 34.0390]), 
        zoom: 17,
        maxZoom: 19,
      }),
      controls: defaultControls(),
    });
    
    placeMarkers();
    startTracking();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, []);

  const toggleMapView = () => {
    if (!mapInstance.current) return;

    const layers = mapInstance.current.getLayers().getArray();
    const standardLayer = layers[0];
    const satelliteLayer = layers[1];

    if (currentView === 'standard') {
      standardLayer.setVisible(false);
      satelliteLayer.setVisible(true);
      setCurrentView('satellite');
    } else {
      standardLayer.setVisible(true);
      satelliteLayer.setVisible(false);
      setCurrentView('standard');
    }
  };

  // Add accessible entries
  const placeMarkers = () => {
    locations.forEach((location) => {
      const coords = fromLonLat(location.coordinates);
      
      const marker = new Feature(new Point(coords));

      marker.setStyle(
        new Style({
          image: new Icon({
            src: 'https://cdn2.iconfinder.com/data/icons/wsd-map-markers-2/512/wsd_markers_97-512.png', // Custom Marker Icon
            scale: 0.04,
            anchor: [0.5, 1], 
          }),
        })
      );

      // Add the marker to the vector source
      vectorSourceRef.current.addFeature(marker);
    });
  };

  // Start live tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = fromLonLat([longitude, latitude]);

        // Update marker position
        userMarkerRef.current.setGeometry(new Point(coords));

        // Ensure the marker is added only once
        if (!vectorSourceRef.current.hasFeature(userMarkerRef.current)) {
          userMarkerRef.current.setStyle(
            new Style({
              image: new Icon({
                src: 'https://cdn-icons-png.flaticon.com/128/884/884094.png', // User marker icon
                scale: 0.2,
              }),
            })
          );
          vectorSourceRef.current.addFeature(userMarkerRef.current);
        }

        // Follow user location
        if (mapInstance.current) {
          mapInstance.current.getView().setCenter(coords);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000}
    );
  };

  // Find location by name or partial match
  const findLocationByName = (query: string) => {
    if (!query) return null;
    
    // Try exact match first
    const exactMatch = locations.find(loc => 
      loc.name.toLowerCase() === query.toLowerCase()
    );
    
    if (exactMatch) return exactMatch.coordinates;
    
    // Try partial match
    const partialMatch = locations.find(loc => 
      loc.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return partialMatch ? partialMatch.coordinates : null;
  };

  // Clear previous routes from the map
  const clearRoutes = () => {
    const features = vectorSourceRef.current.getFeatures();
    features.forEach(feature => {
      if (feature.getGeometry() instanceof LineString) {
        vectorSourceRef.current.removeFeature(feature);
      }
    });
  };

  // Calculate and draw route between start and end locations
  const calculateRoute = () => {
    // Clear previous routes
    clearRoutes();

    // Find the coordinates for the selected locations
    const startCoords = findLocationByName(startLocation);
    const endCoords = findLocationByName(endLocation);

    if (!startCoords || !endCoords) {
      alert('Please enter valid start and end locations');
      return;
    }

    orsDirections.calculate({
      coordinates: [startCoords, endCoords],
      alternative_routes: { 
        target_count: 3, 
        share_factor: 0.6 
      },
      profile: 'foot-walking', 
      format: 'geojson',
    })
    .then((response: any) => {
      const colors = ['blue', 'grey', 'black']; // Different colors for alternative routes
  
      response.features.forEach((feature: any, index: number) => {
        const routeFeature = new Feature({
          geometry: new LineString(feature.geometry.coordinates.map((coord: any) => fromLonLat(coord))),
        });
  
        routeFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: colors[index % colors.length], // Assign a different color for each route
              width: 3, 
            }),
          })
        );
  
        vectorSourceRef.current.addFeature(routeFeature);
      });
    })
    .catch((err: any) => console.error('Error fetching route:', err));
  };

  // Handle when search inputs change
  const handleStartLocationChange = (value: string) => {
    setStartLocation(value);
  };

  const handleEndLocationChange = (value: string) => {
    setEndLocation(value);
  };
  
  return (
    <div>
      <div className="map-wrapper">
        <div className="map-page">
          <div className="top-bar">
            <div className="search-container">
              <MapSearch 
                onStartChange={handleStartLocationChange}
                onEndChange={handleEndLocationChange}
                onSubmit={calculateRoute}
              />
              <button 
                type="button" 
                onClick={calculateRoute}
                className="find-route-button"
                aria-label="Find route"
              >
                Find Route
              </button>
            </div>
            <NavButtonGroup aria-label="Navigation buttons for the map"/>
          </div>

          <div className={`map-root ${className || ''}`}>
            <div 
              ref={mapRef} 
              className="map-container" 
              role="application"
              aria-label="Interactive map displaying user location and navigation"
            />
            <button
              type="button"
              onClick={toggleMapView}
              className="map-toggle-button"
            >
              {currentView === 'standard' ? 'Satellite View' : 'Standard View'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibleMap;
