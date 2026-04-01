import { beforeEach, describe, expect, it, vi } from 'vitest';

const divIconMock = vi.fn((options: Record<string, unknown>) => ({ __icon: true, options }));

vi.mock('leaflet', () => ({
  default: {
    divIcon: (options: Record<string, unknown>) => divIconMock(options),
  },
}));

describe('getMarkerIconForDivisionColor', () => {
  let getMarkerIconForDivisionColor: typeof import('./markerIcon').getMarkerIconForDivisionColor;

  beforeEach(async () => {
    vi.resetModules();
    divIconMock.mockClear();
    const mod = await import('./markerIcon');
    getMarkerIconForDivisionColor = mod.getMarkerIconForDivisionColor;
  });

  it('passes icon layout from constants into L.divIcon', async () => {
    const { MARKER_ICON_ANCHOR, MARKER_ICON_SIZE, MARKER_POPUP_ANCHOR } = await import('../data/constants');
    getMarkerIconForDivisionColor('#336699');

    expect(divIconMock).toHaveBeenCalledTimes(1);
    expect(divIconMock.mock.calls[0][0]).toMatchObject({
      className: 'custom-icon',
      iconSize: MARKER_ICON_SIZE,
      iconAnchor: MARKER_ICON_ANCHOR,
      popupAnchor: MARKER_POPUP_ANCHOR,
    });
    const html = divIconMock.mock.calls[0][0].html as string;
    expect(html).toContain('background-color:#336699');
  });

  it('returns the same icon instance when the normalized color key matches', () => {
    const iconA = getMarkerIconForDivisionColor('#abc');
    const iconB = getMarkerIconForDivisionColor('#abc');
    expect(iconA).toBe(iconB);
    expect(divIconMock).toHaveBeenCalledTimes(1);
  });

  it('normalizes cache key with trim and lowercase', () => {
    const iconA = getMarkerIconForDivisionColor('  #FF0000  ');
    const iconB = getMarkerIconForDivisionColor('#ff0000');
    expect(iconA).toBe(iconB);
    expect(divIconMock).toHaveBeenCalledTimes(1);
  });

  it('creates a new icon for a different color', () => {
    const iconA = getMarkerIconForDivisionColor('#111111');
    const iconB = getMarkerIconForDivisionColor('#222222');
    expect(iconA).not.toBe(iconB);
    expect(divIconMock).toHaveBeenCalledTimes(2);
  });
});
