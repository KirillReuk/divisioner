import React from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { X } from 'lucide-react';

interface TeamMapPickerProps {
  latitude: number;
  longitude: number;
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

const TeamMapPicker: React.FC<TeamMapPickerProps> = ({ latitude, longitude, onPick, onClose }) => {
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
      <MapContainer center={[latitude, longitude]} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onClick={onPick} />
        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
};

export default TeamMapPicker;
