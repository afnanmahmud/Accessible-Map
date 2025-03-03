// src/components/AccessibleMap/index.tsx
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
import MapSearch from '../MapSearch';
import NavButtonGroup from '../NavButtonGroup';
import 'ol/ol.css';
import './styles.css';
import Openrouteservice from 'openrouteservice-js';

const orsDirections = new Openrouteservice.Directions({
  api_key: '5b3ce3597851110001cf6248a1d686e75cef4e86a9782464ccdb71cf',
});

const startCoordinates = [-84.5831447839737, 34.038533480073355]; // Start: Carmicheal Student Center
const endCoordinates = [-84.58398431539538, 34.038308992850496]; 

const AccessibleMap: React.FC<AccessibleMapProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const [currentView, setCurrentView] = useState<'standard' | 'satellite'>('standard');
  const vectorSourceRef = useRef(new VectorSource());
  const userMarkerRef = useRef(new Feature()); // User's live marker

  // Accessible entry marker locations
  const locations = [
    { name: 'Carmicheal Student Center', coordinates: [-84.5831447839737, 34.038533480073355] },
    { name: 'Georgia Tech', coordinates: [-84.3963, 33.7756] },
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
    drawRoute(); 

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

  //Add accessible entries
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

  // Start live GPS tracking
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

        //Follow user location
        if (mapInstance.current) {
          mapInstance.current.getView().setCenter(coords);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  };
  const drawRoute = () => {
    orsDirections.calculate({
      coordinates: [startCoordinates, endCoordinates],
      alternative_routes: { target_count: 2, share_factor: 0.6 }, // Request alternative routes
      profile: 'foot-walking', 
      format: 'geojson',
    })
    .then((response: any) => {
      const colors = ['blue', 'red', 'green']; // Different colors for alternative routes
  
      response.features.forEach((feature: any, index: number) => {
        const routeFeature = new Feature({
          geometry: new LineString(feature.geometry.coordinates.map((coord: any) => fromLonLat(coord))),
        });
  
        routeFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: colors[index % colors.length], // Assign a different color for each route
              width: index = 3, // Make the primary route thicker
            }),
          })
        );
  
        vectorSourceRef.current.addFeature(routeFeature);
      });
    })
    .catch((err: any) => console.error('Error fetching route:', err));
  };
  
  

  return (
    <div>
      <div className="map-wrapper">
        <div className="map-page">
          <div className="top-bar">
            <MapSearch />
            <NavButtonGroup />
          </div>
          <div className={`map-root ${className || ''}`}>
            <div ref={mapRef} className="map-container" />
            <div className="map-controls">
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
    </div>
  );
};

export default AccessibleMap;
