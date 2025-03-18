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
import NavButtonGroup from '../NavButtonGroup/NavButtonGroup';
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
  const [routeMode, setRouteMode] = useState<'walking' | 'wheelchair'>('walking');

  // Accessible entry marker accessibility
  const accessibility = [
    { name: 'Carmichael Student Center', coordinates: [-84.5831447839737, 34.038533480073355] },
    { name: 'Carmichael Student Center ', coordinates: [-84.58283364772798, 34.038660170620055] },
    { name: 'Academic Learning Center', coordinates: [-84.58317697048189, 34.03931806936354] },
    { name: 'Academic Learning Center ', coordinates: [-84.58298921585084, 34.03978259614599] },
    { name: 'English', coordinates: [-84.58414524793626, 34.03942475516541] },
    { name: 'English ', coordinates: [-84.5841532945633, 34.03910025210137] },
    { name: 'English ', coordinates: [-84.58402454853059, 34.03979815441523] },
    { name: 'University Hall', coordinates: [-84.58437055349351, 34.038938000103784] },
    { name: 'Willingham Hall', coordinates: [-84.58483189344408, 34.038973562212] },
    { name: 'Social Sciences', coordinates: [-84.58521813154222, 34.03870240076022] },
    { name: "Technology Services", "coordinates": [-84.58511178527453, 34.04324444304241] },
    { name: "Jolley Lodge", "coordinates": [-84.58503997779815, 34.041975382594565] },
    { name: "Bailey Performance Center", "coordinates": [-84.58388467029071, 34.04104538235975] },
    { name: "Zuckerman Museum", "coordinates": [-84.58332319433181, 34.041127569948884] },
    { name: "Prillaman Health Sciences", "coordinates": [-84.5823230947359, 34.04126007515278] },
    { name: "Prillaman Health Sciences 2", "coordinates": [-84.58227837728104, 34.04040804794117] },
    { name: "Prillaman Health Sciences 3", "coordinates": [-84.58162052602621, 34.04049249904415] },
    { name: "Central Parking Deck", "coordinates": [-84.58155510939581, 34.04091628989932] },
    { name: "Visual Arts", "coordinates": [-84.58495900426912, 34.04014013820758] },
    { name: "Wilson Annex", "coordinates": [-84.58407716154898, 34.040382041842314] },
    { name: "Wilson Building", "coordinates": [-84.5831444233547, 34.04021534710124] },
    { name: "Music Building", "coordinates": [-84.58287930990906, 34.040181974276315] },
    { name: "The Commons", "coordinates": [-84.5822049725835, 34.040112254887596] },
    { name: "Burruss Building", "coordinates": [-84.58182548615811, 34.03916307618097] },
    { name: "Burruss Building 2", "coordinates": [-84.58151844214942, 34.039334634541554] },
    { name: "Bagwell Education Building", "coordinates": [-84.58087532494412, 34.0396379119677] },
    { name: "Bagwell Education Building 2", "coordinates": [-84.5809418434928, 34.039037425081695] },
    { name: "Kennesaw Hall", "coordinates": [-84.580944525696, 34.03889684364226] },
    { name: "Kennesaw Hall 2", "coordinates": [-84.5807963755791, 34.037958423913985] },
    { name: "Kennesaw Hall 3", "coordinates": [-84.58038669152127, 34.03813234820042] },
    { name: "Convocation Center", "coordinates": [-84.5804216302843, 34.03739857647659] },
    { name: "Siegel Student Recreation & Activities Center", "coordinates": [-84.58134592872163, 34.03685306796862] },
    { name: "Siegel Student Recreation & Activities Center 2", "coordinates": [-84.58239021303122, 34.03685051220012] },
    { name: "Siegel Student Recreation & Activities Center 3", "coordinates": [-84.58220111729591, 34.03752287232788] },
    { name: 'East Parking Deck', coordinates: [-84.58115296368257, 34.0366216129326] },
    { name: 'University Bookstore', coordinates: [-84.5831169079928, 34.03785497707045] },
    { name: 'Sturgis Library', coordinates: [-84.58373969823, 34.03817439372666] },
    { name: 'Pilcher Building', coordinates: [-84.58447613924874, 34.038288000488095] },
    { name: 'Pilcher Building 2', coordinates: [-84.58431721837084, 34.03806406828368] },
    { name: 'Technology Annex', coordinates: [-84.58464920626845, 34.03786021162154] },
    { name: 'Math & Statistics', coordinates: [-84.58383582638564, 34.03772185089651] },
    { name: 'Public Safety', coordinates: [-84.58507185459054, 34.03779644824888] },
    { name: 'Office of Institutional Research', coordinates: [-84.58675097542397, 34.03693417640655] },
    { name: 'Institute for Cybersecurity Workforce Development', coordinates: [-84.58695333977656, 34.0366027572148] },
    { name: 'Catholic Center at KSU', coordinates: [-84.5868852037043, 34.03634308250317] },
    { name: 'Science Building', coordinates: [-84.5838534655383, 34.036176140973545] },
    { name: 'Clendenin Building', coordinates: [-84.5832859278377, 34.035990222567854] },
    { name: 'Science Laboratory', coordinates: [-84.58378799464447, 34.0358330372012] },
    { name: 'Town Point Office of Undergraduate Admissions', coordinates: [-84.5812208966054, 34.030192038882014] },
    { name: 'Town Point Office of Undergraduate Admissions 2', coordinates: [-84.581545605683, 34.02995662532501] },
    { name: 'Student Athlete Success Services', coordinates: [-84.58461356049521, 34.02971179412259] },
    { name: 'Owl\'s Nest', coordinates: [-84.57001181566912, 34.029991983405665] },
    { name: 'KSU Center', coordinates: [-84.57355444798323, 34.03153703386949] },
    { name: 'KSU Center 2', coordinates: [-84.57475627461659, 34.031628424526644] },
    { name: 'KSU Center 3', coordinates: [-84.5748219887467, 34.030627036521274] },
    { name: 'KSU Center 4', coordinates: [-84.57358939259085, 34.03052548858506] },
    { name: 'Public Safety & University Police', coordinates: [-84.56971263811648, 34.027141980291134] }
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

  const toggleRouteMode = () => {
    setRouteMode(routeMode === 'walking' ? 'wheelchair' : 'walking');
  };

  // Add accessible entries
  const placeMarkers = () => {
    accessibility.forEach((location) => {
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
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  };

  // Find location by name or partial match
  const findLocationByName = (query: string) => {
    if (!query) return null;

    // Try exact match first
    const exactMatch = accessibility.find(loc =>
      loc.name.toLowerCase() === query.toLowerCase()
    );

    if (exactMatch) return exactMatch.coordinates;

    // Try partial match
    const partialMatch = accessibility.find(loc =>
      loc.name.toLowerCase().includes(query.toLowerCase())
    );

    return partialMatch ? partialMatch.coordinates : null;
  };

  // Clear previous routes from the map
  const clearRoutes = () => {
    const features = vectorSourceRef.current.getFeatures();
    features.forEach(feature => {
      // Remove only route lines and previous start/end markers
      if (feature.getGeometry() instanceof LineString || feature.get('type') === 'marker') {
        vectorSourceRef.current.removeFeature(feature);
      }
    });
  };

  const calculateRoute = () => {
    clearRoutes(); // Clear previous routes and markers

    const startCoords = findLocationByName(startLocation);
    const endCoords = findLocationByName(endLocation);

    if (!startCoords || !endCoords) {
      alert('Please enter valid start and end accessibility');
      return;
    }

    // Convert coordinates to OpenLayers format
    const startPoint = fromLonLat(startCoords);
    const endPoint = fromLonLat(endCoords);

    // Create start marker (blue)
    const startMarker = new Feature(new Point(startPoint));
    startMarker.setStyle(
      new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/128/7976/7976202.png', // Blue start icon
          scale: 0.2,
          anchor: [0.5, 1],
        }),
      })
    );
    startMarker.set('type', 'marker'); // Mark it for removal

    // Create end marker (red)
    const endMarker = new Feature(new Point(endPoint));
    endMarker.setStyle(
      new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/128/9131/9131546.png', // Red end icon
          scale: 0.2,
          anchor: [0.5, 1],
        }),
      })
    );
    endMarker.set('type', 'marker'); // Mark it for removal

    // Add markers to the vector source
    vectorSourceRef.current.addFeature(startMarker);
    vectorSourceRef.current.addFeature(endMarker);

    // Zoom to fit both markers
    if (mapInstance.current) {
      const extent = [
        Math.min(startPoint[0], endPoint[0]), // Min Longitude
        Math.min(startPoint[1], endPoint[1]), // Min Latitude
        Math.max(startPoint[0], endPoint[0]), // Max Longitude
        Math.max(startPoint[1], endPoint[1]), // Max Latitude
      ];

      mapInstance.current.getView().fit(extent, {
        padding: [50, 50, 50, 50], // Adds padding around the zoomed area
        duration: 1000, // Smooth zoom animation
        maxZoom: 18, // Prevent excessive zooming
      });
    }

    // Set OpenRouteService options based on route mode
    const routeOptions: any = {
      coordinates: [startCoords, endCoords],
      alternative_routes: { target_count: 3, share_factor: 0.6 },
      profile: routeMode === 'wheelchair' ? 'wheelchair' : 'foot-walking',
      format: 'geojson',
    };

    // Add wheelchair-specific parameters when in wheelchair mode
    if (routeMode === 'wheelchair') {
      routeOptions.options = {
      };
    }

    // Fetch route from OpenRouteService
    orsDirections
      .calculate(routeOptions)
      .then((response: any) => {
        const colors = ['blue', 'grey', 'black'];
        const wheelchairColors = ['blue', 'grey', 'black']; // Different color options for wheelchair routes

        response.features.forEach((feature: any, index: number) => {
          const routeFeature = new Feature({
            geometry: new LineString(feature.geometry.coordinates.map((coord: any) => fromLonLat(coord))),
          });

          routeFeature.setStyle(
            new Style({
              stroke: new Stroke({
                // Choose color based on route mode
                color: routeMode === 'wheelchair'
                  ? wheelchairColors[index % wheelchairColors.length]
                  : colors[index % colors.length],
                width: 4,
                lineDash: routeMode === 'wheelchair' ? [5, 5] : undefined, // Dashed line for wheelchair routes
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
              <div className="route-controls">
                <button
                  type="button"
                  onClick={calculateRoute}
                  className="find-route-button"
                  aria-label="GO"
                >
                  GO
                </button>
                <button
                  type="button"
                  onClick={toggleRouteMode}
                  className={`route-mode-toggle ${routeMode === 'wheelchair' ? 'wheelchair-active' : ''}`}
                  aria-label={`Switch to ${routeMode === 'wheelchair' ? 'standard walking' : 'wheelchair'} route`}
                >
                  {routeMode === 'wheelchair' ? ' Walking' : ' Wheelchair'}
                </button>
              </div>
            </div>
            <NavButtonGroup aria-label="Navigation buttons for the map" />
          </div>

          <div className={`map-root ${className || ''}`}>
            <div
              ref={mapRef}
              className="map-container"
              role="application"
              aria-label="Interactive map displaying user location and navigation"
            />
            <div className="map-controls">
              <button
                type="button"
                onClick={toggleMapView}
                className="map-toggle-button"
              >
                {currentView === 'standard' ? 'Satellite View' : 'Standard View'}
              </button>
              {routeMode === 'wheelchair' && (
                <div className="wheelchair-route-info">
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibleMap;
