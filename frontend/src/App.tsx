import React from 'react';
import AccessibleMap from './components/AccessibleMap';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1 className="app-title">Accessible Interactive Map</h1>
      <div className="map-wrapper">
        <AccessibleMap />
      </div>
    </div>
  );
};

export default App;