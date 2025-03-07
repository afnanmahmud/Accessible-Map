import React, { useState } from "react";
import { MapSearchInputProps, MapSearchProps } from "@/types";
import "./styles.css";

export const MapSearchInput: React.FC<MapSearchInputProps> = ({
  placeholder,
  location,
  setLocation,
}) => {
  return (
    <div className="input-group">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder={placeholder}
        className="location-input"
      />
    </div>
  );
};

// Update the MapSearchProps interface in your types.ts file:
// interface MapSearchProps {
//   onStartChange?: (value: string) => void;
//   onEndChange?: (value: string) => void;
//   onSubmit?: () => void;
// }

const MapSearch: React.FC<MapSearchProps> = ({ 
  onStartChange, 
  onEndChange,
  onSubmit
}) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');

  // Update parent component when values change
  const handleStartChange = (value: string) => {
    setStartLocation(value);
    if (onStartChange) {
      onStartChange(value);
    }
  };

  const handleEndChange = (value: string) => {
    setEndLocation(value);
    if (onEndChange) {
      onEndChange(value);
    }
  };

  // Handle form submission with Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="route-inputs" onKeyDown={handleKeyDown}>
      <MapSearchInput
        placeholder="Start"
        location={startLocation}
        setLocation={handleStartChange}
      />
      <div className="route-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <MapSearchInput
        placeholder="End"
        location={endLocation}
        setLocation={handleEndChange}
      />
    </div>
  );
};

export default MapSearch;