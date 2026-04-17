import { useEffect, useState } from 'react';
import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { CoordinateField } from '../utils/types';

type TeamFieldErrors = Record<CoordinateField, boolean>;

type AriaProps = {
  'aria-invalid': boolean;
  'aria-describedby'?: string;
};

export const isValidCoords = (latitude: number, longitude: number) =>
  isValidLatitude(latitude) && isValidLongitude(longitude);

const isValidLatitude = (latitude: number) =>
  Number.isFinite(latitude) && latitude >= MIN_LATITUDE && latitude <= MAX_LATITUDE;

const isValidLongitude = (longitude: number) =>
  Number.isFinite(longitude) && longitude >= MIN_LONGITUDE && longitude <= MAX_LONGITUDE;

export const getCoordinateError = (field: CoordinateField, value: number): boolean => {
  switch (field) {
    case 'latitude':
      return !isValidLatitude(value);
    case 'longitude':
      return !isValidLongitude(value);
    default:
      return false;
  }
};

export const useTeamValidation = (teamId: string, latitude: number, longitude: number) => {
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

  const validateLatLng = (field: CoordinateField, value: number) => {
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
