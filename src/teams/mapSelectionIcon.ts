import L from 'leaflet';

const ICON_SIZE = 24;

export function getDivisionerSvgIcon() {
  const src = `${import.meta.env.BASE_URL}divisioner.svg`;

  return L.divIcon({
    className: '',
    html: `
      <img
        src="${src}"
        width="${ICON_SIZE}"
        height="${ICON_SIZE}"
        style="display:block; transform:translate(-50%, -50%);"
        alt=""
      />
    `.trim(),
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [0, 0],
  });
}
