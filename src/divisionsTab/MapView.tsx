import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Division } from '../utils/types';
import { MARKER_ICON_ANCHOR, MARKER_ICON_SIZE, MARKER_POPUP_ANCHOR, TILE_LAYER_URL } from '../data/constants';

interface MapViewProps {
  divisions: Division[];
}

const MapView: React.FC<MapViewProps> = ({ divisions }) => {
  const FitBounds = () => {
    const map = useMap();

    useEffect(() => {
      const allCoordinates: [number, number][] = divisions
        .flatMap(division => division.teams)
        .map(team => [team.latitude, team.longitude]);

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
      <TileLayer url={TILE_LAYER_URL} />

      {divisions.map((division, divisionIndex) =>
        division.teams.map((team, teamIndex) => {
          const icon = L.divIcon({
            className: 'custom-icon',
            html: `<div style="background-color: ${division.color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
            iconSize: MARKER_ICON_SIZE,
            iconAnchor: MARKER_ICON_ANCHOR,
            popupAnchor: MARKER_POPUP_ANCHOR,
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
