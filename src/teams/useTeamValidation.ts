import { useEffect, useState } from 'react';
import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { CoordinateField } from '../utils/types';
import { normalizeCoordinate } from '../utils/geocoding';

type TeamFieldErrors = Record<CoordinateField, boolean>;

type AriaProps = {
  'aria-invalid': boolean;
  'aria-describedby'?: string;
};

export const hasValidCoords = <T extends { latitude: number | null; longitude: number | null }>(
  item: T
): item is T & { latitude: number; longitude: number } => {
  if (item.latitude == null || item.longitude == null) return false;
  if (!Number.isFinite(item.latitude) || !Number.isFinite(item.longitude)) return false;
  return isValidLatitude(normalizeCoordinate(item.latitude)) && isValidLongitude(normalizeCoordinate(item.longitude));
};

const isValidLatitude = (latitude: number | null): latitude is number =>
  latitude != null && Number.isFinite(latitude) && latitude >= MIN_LATITUDE && latitude <= MAX_LATITUDE;

const isValidLongitude = (longitude: number | null): longitude is number =>
  longitude != null && Number.isFinite(longitude) && longitude >= MIN_LONGITUDE && longitude <= MAX_LONGITUDE;

export const getCoordinateError = (field: CoordinateField, value: number | null): boolean => {
  switch (field) {
    case 'latitude':
      return !isValidLatitude(value);
    case 'longitude':
      return !isValidLongitude(value);
    default:
      return false;
  }
};

export const useTeamValidation = (teamId: string, latitude: number | null, longitude: number | null) => {
  const [errors, setErrors] = useState<TeamFieldErrors>(() => ({
    latitude: getCoordinateError('latitude', latitude),
    longitude: getCoordinateError('longitude', longitude),
  }));

  useEffect(() => {
    setErrors({
      latitude: getCoordinateError('latitude', latitude),
      longitude: getCoordinateError('longitude', longitude),
    });
  }, [latitude, longitude]);

  const validateLatLng = (field: CoordinateField, value: number | null) => {
    setErrors(prev => ({
      ...prev,
      [field]: getCoordinateError(field, value),
    }));
  };

  const getAriaPropsForField = (field: CoordinateField): AriaProps => {
    const isInvalid = Boolean(errors[field]);
    const messageId = `${field}-error-${teamId}`;
    return {
      'aria-invalid': isInvalid,
      ...(isInvalid ? { 'aria-describedby': messageId } : {}),
    };
  };

  return {
    errors,
    validateLatLng,
    getAriaPropsForField,
  };
};
