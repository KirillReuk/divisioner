import { useEffect, useState } from 'react';
import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { Team } from '../utils/types';

type CoordinateField = 'latitude' | 'longitude';
type TeamFieldErrors = Record<CoordinateField, boolean>;
type ErrorsById = Record<string, TeamFieldErrors>;

type AriaProps = {
  'aria-invalid': boolean;
  'aria-describedby'?: string;
};

const getCoordinateError = (field: CoordinateField, value: number): boolean => {
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

export const useTeamValidation = (teams: Team[]) => {
  const [errorsById, setErrorsById] = useState<ErrorsById>({});

  useEffect(() => {
    const validTeamIds = new Set(teams.map(team => team.id));
    setErrorsById(
      prev => Object.fromEntries(Object.entries(prev).filter(([teamId]) => validTeamIds.has(teamId))) as ErrorsById
    );
  }, [teams]);

  const validateLatLng = (teamId: string, field: CoordinateField, value: number) => {
    const defaultErrors = { latitude: false, longitude: false };
    setErrorsById(prev => ({
      ...prev,
      [teamId]: {
        ...(prev[teamId] ?? defaultErrors),
        [field]: getCoordinateError(field, value),
      },
    }));
  };

  const ariaPropsForField = (teamId: string, field: CoordinateField): AriaProps => {
    const isInvalid = Boolean(errorsById[teamId]?.[field]);
    const messageId = `${field}-error-${teamId}`;
    return {
      'aria-invalid': isInvalid,
      ...(isInvalid ? { 'aria-describedby': messageId } : {}),
    };
  };

  return {
    errorsById,
    validateLatLng,
    ariaPropsForField,
  };
};
