import { useEffect, useState } from 'react';
import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { CoordinateField } from '../utils/types';

type TeamFieldErrors = Record<CoordinateField, boolean>;

type AriaProps = {
  'aria-invalid': boolean;
  'aria-describedby'?: string;
};

export const getCoordinateError = (field: CoordinateField, value: number): boolean => {
  if (isNaN(value)) return true;
  switch (field) {
    case 'latitude':
      return value < MIN_LATITUDE || value > MAX_LATITUDE;
    case 'longitude':
      return value < MIN_LONGITUDE || value > MAX_LONGITUDE;
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
