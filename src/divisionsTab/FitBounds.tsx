import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface FitBoundsProps {
  latLngs: readonly [number, number][];
}

const FitBounds = ({ latLngs }: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (latLngs.length === 0) return;
    const bounds = L.latLngBounds([...latLngs]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [latLngs, map]);

  return null;
};

export default FitBounds;
