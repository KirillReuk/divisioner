import React from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import LocationSearchInput from '../components/LocationSearchInput';
import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { CoordinateField, Team } from '../utils/types';
import type { SpectralRowTint } from '../utils/spectralColors';
import { useTeamValidation } from './useTeamValidation';
import { normalizeCoordinate } from '../utils/geocoding';

interface TeamRowProps {
  team: Team;
  rivalryRowStyle: SpectralRowTint | null;
  rowRef?: React.Ref<HTMLTableRowElement>;
  onTeamNameChange: (teamId: string, value: string) => void;
  onLocationSelect: (teamId: string, location: string, latitude: number, longitude: number) => void;
  onLocationFocus: (teamId: string) => void;
  onCoordinateChange: (teamId: string, field: CoordinateField, value: number) => void;
  onRemove: (teamId: string) => void;
}

const TeamRow: React.FC<TeamRowProps> = ({
  team,
  rivalryRowStyle,
  rowRef,
  onTeamNameChange,
  onLocationSelect,
  onLocationFocus,
  onCoordinateChange,
  onRemove,
}) => {
  const normalizedLatitude = normalizeCoordinate(team.latitude);
  const normalizedLongitude = normalizeCoordinate(team.longitude);
  const { errors, validateLatLng, getAriaPropsForField } = useTeamValidation(
    team.id,
    normalizedLatitude,
    normalizedLongitude
  );

  const rowStyle: React.CSSProperties | undefined = rivalryRowStyle
    ? {
        backgroundColor: rivalryRowStyle.backgroundColor,
        borderLeftWidth: 4,
        borderLeftStyle: 'solid',
        borderLeftColor: rivalryRowStyle.borderLeftColor,
      }
    : undefined;

  const fieldBgStyle: React.CSSProperties | undefined = rivalryRowStyle
    ? { backgroundColor: rivalryRowStyle.backgroundColor }
    : undefined;

  return (
    <tr ref={rowRef} className="border-b border-t border-300 border-black last:border-b-0" style={rowStyle}>
      <td>
        <input
          type="text"
          name={`team-name-${team.id}`}
          value={team.name}
          onChange={e => onTeamNameChange(team.id, e.target.value)}
          className={clsx(
            'p-2 rounded w-full duration-300 ease-out',
            rivalryRowStyle ? 'focus:!bg-white hover:!bg-white' : 'bg-gray-100 focus:bg-white hover:bg-white'
          )}
          style={fieldBgStyle}
          placeholder="Team Name"
        />
      </td>
      <td>
        <LocationSearchInput
          key={`location-search-${team.id}`}
          teamId={team.id}
          onSelect={onLocationSelect}
          location={team.location}
          onFocus={() => onLocationFocus(team.id)}
        />
      </td>
      <td className="min-w-[180px]">
        <div className="flex">
          <input
            type="number"
            name={`latitude-${team.id}`}
            value={normalizedLatitude}
            min={MIN_LATITUDE}
            max={MAX_LATITUDE}
            step="0.001"
            onChange={e => {
              const value = parseFloat(e.target.value);
              validateLatLng('latitude', value);
              onCoordinateChange(team.id, 'latitude', value);
            }}
            {...getAriaPropsForField('latitude')}
            className={clsx(
              'rounded w-1/2 min-w-[90px] p-2 duration-300 ease-out',
              errors.latitude ? 'border-2 border-red-500' : '',
              rivalryRowStyle ? 'focus:!bg-white hover:!bg-white' : 'bg-gray-100 focus:bg-white hover:bg-white'
            )}
            style={fieldBgStyle}
            placeholder="Latitude"
          />
          <input
            type="number"
            name={`longitude-${team.id}`}
            value={normalizedLongitude}
            min={MIN_LONGITUDE}
            max={MAX_LONGITUDE}
            step="0.001"
            onChange={e => {
              const value = parseFloat(e.target.value);
              validateLatLng('longitude', value);
              onCoordinateChange(team.id, 'longitude', value);
            }}
            {...getAriaPropsForField('longitude')}
            className={clsx(
              'rounded w-1/2 min-w-[90px] p-2 duration-300 ease-out',
              errors.longitude ? 'border-2 border-red-500' : '',
              rivalryRowStyle ? 'focus:!bg-white hover:!bg-white' : 'bg-gray-100 focus:bg-white hover:bg-white'
            )}
            style={fieldBgStyle}
            placeholder="Longitude"
          />
        </div>
      </td>
      <td className="text-end">
        <button
          type="button"
          onClick={() => onRemove(team.id)}
          className="inline-flex items-center justify-center rounded p-1 text-gray-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black"
          aria-label={`Remove team ${team.name}`}
          title="Remove team"
        >
          <X className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

export default TeamRow;
