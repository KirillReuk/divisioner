import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Division } from '../data/teams';
import { shadeHue } from '../utils/partitioning';

interface MapViewProps {
  divisions: Division[];
}

const MapView: React.FC<MapViewProps> = ({ divisions }) => {
  const FitBounds = () => {
    const map = useMap();

    useEffect(() => {
      const allCoordinates = divisions
        .map(division => division.teams)
        .flat()
        .map(team => [team.latitude, team.longitude] as [number, number]);

      if (allCoordinates.length > 0) {
        const bounds = L.latLngBounds(allCoordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [divisions, map]);

    return null;
  };

  return (
    <MapContainer style={{ height: '600px', width: '100%' }}>
      <FitBounds />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {divisions.map((division, divisionIndex) =>
        division.teams.map((team, teamIndex) => {
          const icon = L.divIcon({
            className: 'custom-icon',
            html: `<div style="background-color: ${shadeHue(division.hue, 90, 50)}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
          });

          return (
            <Marker key={`team-${divisionIndex}-${teamIndex}`} position={[team.latitude, team.longitude]} icon={icon}>
              <Popup>{team.name}</Popup>
            </Marker>
          );
        })
      )}
    </MapContainer>
  );
};

export default MapView;
