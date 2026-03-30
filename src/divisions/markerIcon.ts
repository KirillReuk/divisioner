import L from 'leaflet';
import { MARKER_ICON_ANCHOR, MARKER_ICON_SIZE, MARKER_POPUP_ANCHOR } from '../data/constants';

const iconByColorKey = new Map<string, L.DivIcon>();

export function getMarkerIconForDivisionColor(color: string): L.DivIcon {
  const key = color.trim().toLowerCase();
  const existingIcon = iconByColorKey.get(key);
  if (existingIcon) return existingIcon;

  const newIcon = L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color:${color};width:10px;height:10px;border-radius:50%;border:2px solid rgba(0,0,0,0.55);box-shadow:0 0 0 1px rgba(255,255,255,0.55);"></div>`,
    iconSize: MARKER_ICON_SIZE,
    iconAnchor: MARKER_ICON_ANCHOR,
    popupAnchor: MARKER_POPUP_ANCHOR,
  });
  iconByColorKey.set(key, newIcon);
  return newIcon;
}
