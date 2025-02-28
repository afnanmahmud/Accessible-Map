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
import { Icon, Style } from 'ol/style';
import { defaults as defaultControls } from 'ol/control';
import { AccessibleMapProps } from '@/types';
import MapSearch from '../MapSearch';
import NavButtonGroup from '../NavButtonGroup';
import 'ol/ol.css';
import './styles.css';

const AccessibleMap: React.FC<AccessibleMapProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const [currentView, setCurrentView] = useState<'standard' | 'satellite'>('standard');
  const vectorSourceRef = useRef(new VectorSource());
  const userMarkerRef = useRef(new Feature()); // User's live marker

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

    // Start live tracking
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
