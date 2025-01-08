import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Team } from './data/teams';

interface MapViewProps {
  divisions: Team[][];
}

const MapView: React.FC<MapViewProps> = ({ divisions }) => {
  const divisionColors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'pink', 'brown', 'cyan', 'lightGreen', 'gray'];

  const SetMapView = () => {
    const map = useMap();
    map.setView([39.8283, -98.5795], 4); // Сделать динамически
    return null;
  };

  return (
    <MapContainer style={{ height: '600px', width: '100%' }}>
      <SetMapView />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {divisions.map((division, divisionIndex) =>
        division.map(team => {
          const icon = L.divIcon({
            className: 'custom-icon',
            html: `<div style="background-color: ${divisionColors[divisionIndex]}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
          });

          return (
            <Marker key={team.name} position={[team.latitude, team.longitude]} icon={icon}>
              <Popup>{team.name}</Popup>
            </Marker>
          );
        })
      )}
    </MapContainer>
  );
};

export default MapView;
