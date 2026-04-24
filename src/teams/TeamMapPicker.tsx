import React, { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { X } from 'lucide-react';
import { getDivisionerSvgIcon } from './mapSelectionIcon';

interface TeamMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  initialCenter: [number, number];
  onPick: (lat: number, lng: number) => void;
  onClose: () => void;
}

const MapClickHandler: React.FC<{
  onClick: (lat: number, lng: number) => void;
}> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    },
  });
  return null;
};

const RecenterOnCoordinates: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitude, longitude], undefined, { duration: 0.6 });
  }, [latitude, longitude, map]);

  return null;
};

const TeamMapPicker: React.FC<TeamMapPickerProps> = ({ latitude, longitude, initialCenter, onPick, onClose }) => {
  const hasCoords = latitude != null && longitude != null;
  return (
    <div className="relative h-96 w-full rounded border mt-2 overflow-hidden">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-2 top-2 z-[1000] inline-flex items-center justify-center rounded bg-white/90 p-1 text-gray-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-black"
        aria-label="Close map"
        title="Close map"
      >
        <X className="h-4 w-4" />
      </button>
      <MapContainer center={initialCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onClick={onPick} />
        {hasCoords && (
          <>
            <RecenterOnCoordinates latitude={latitude} longitude={longitude} />
            <Marker position={[latitude, longitude]} icon={getDivisionerSvgIcon()} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default TeamMapPicker;
