import { MapSearchInputProps, MapSearchProps } from "@/types";
import { useState } from "react";
import "./styles.css"

export const MapSearchInput: React.FC<MapSearchInputProps> = ({
    placeholder,
    location,
    setLocation
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

//map search bar (start and end points)
const MapSearch: React.FC<MapSearchProps> = () => {
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');

    const searchButtonClicked = () => {
        console.log("Search button clicked");
        console.log("startLocation", startLocation)
        console.log("endLocation", endLocation)
        // Uncomment with actual map api function call
        // findShortestDistance(startLocation, endLocation)
    }

    return (
        <div className="route-inputs">
            <MapSearchInput
                placeholder="Start"
                location={startLocation}
                setLocation={setStartLocation}
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
                setLocation={setEndLocation}
            />

            <button onClick={searchButtonClicked} className="goButton">Go</button>

        </div>
    );
};

export default MapSearch;