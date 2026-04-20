import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Division } from '../utils/types';
import { TILE_LAYER_URL } from '../data/constants';
import FitBounds from './FitBounds';
import { getMarkerIconForDivisionColor } from './markerIcon';
import { normalizeCoordinate } from '../utils/geocoding';

interface MapViewProps {
  divisions: Division[];
}

interface MapMarkerItem {
  key: string;
  position: [number, number];
  icon: L.DivIcon;
  tooltipLabel: string;
  tooltipDirection: 'left' | 'right';
}

const MapView: React.FC<MapViewProps> = ({ divisions }) => {
  const markers = useMemo((): MapMarkerItem[] => {
    const items: MapMarkerItem[] = [];
    divisions.forEach((division, divisionIndex) => {
      division.teams.forEach((team, teamIndex) => {
        items.push({
          key: `team-${divisionIndex}-${teamIndex}`,
          position: [normalizeCoordinate(team.latitude), normalizeCoordinate(team.longitude)],
          icon: getMarkerIconForDivisionColor(division.color),
          tooltipLabel: team.shortName ?? team.name,
          tooltipDirection: (divisionIndex + teamIndex) % 2 === 0 ? 'right' : 'left',
        });
      });
    });
    return items;
  }, [divisions]);

  const fitBoundsLatLngs = useMemo(() => markers.map(m => m.position), [markers]);

  return (
    <MapContainer style={{ height: '600px', width: '100%' }}>
      <FitBounds latLngs={fitBoundsLatLngs} />
      <TileLayer url={TILE_LAYER_URL} />

      {markers.map(marker => (
        <Marker key={marker.key} position={marker.position} icon={marker.icon}>
          <Tooltip
            permanent
            direction={marker.tooltipDirection}
            offset={[0, 0]}
            opacity={1}
            interactive={false}
            className="team-label-tooltip"
          >
            {marker.tooltipLabel}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
