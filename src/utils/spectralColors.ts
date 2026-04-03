import chroma from 'chroma-js';
import { MAX_RIVALRIES } from '../data/constants';

export function getSpectralScaleColors(count: number): string[] {
  if (count <= 0) return [];
  return chroma.scale('Spectral').mode('lab').colors(count);
}

export type SpectralRowTint = { backgroundColor: string; borderLeftColor: string };

export function spectralHexToRowTint(hex: string): SpectralRowTint {
  const c = chroma(hex);
  return {
    backgroundColor: c.mix('white', 0.7, 'lab').css(),
    borderLeftColor: c.darken(0.35).css(),
  };
}

function shuffleInPlace<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

/** Fixed palette (per page load) so rivalry row colors do not shift when rivalries are added or removed. Order is randomized once at init. */
const rivalryRowTints = getSpectralScaleColors(MAX_RIVALRIES).map(spectralHexToRowTint);
shuffleInPlace(rivalryRowTints);
export const RIVALRY_ROW_TINTS: SpectralRowTint[] = rivalryRowTints;
