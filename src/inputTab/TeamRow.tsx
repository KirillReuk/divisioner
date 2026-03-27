import React from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import LocationSearchInput from '../LocationSearchInput';
import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from '../data/constants';
import { CoordinateField, Team } from '../utils/types';

type TeamFieldErrors = Record<CoordinateField, boolean>;

interface TeamRowProps {
  team: Team;
  rowRef?: React.Ref<HTMLTableRowElement>;
  teamErrors?: TeamFieldErrors;
  getAriaPropsForField: (teamId: string, field: CoordinateField) => {
    'aria-invalid': boolean;
    'aria-describedby'?: string;
  };
  onTeamNameChange: (teamId: string, value: string) => void;
  onLocationSelect: (teamId: string, location: string, latitude: number, longitude: number) => void;
  onLocationFocus: (teamId: string) => void;
  onCoordinateChange: (teamId: string, field: CoordinateField, value: number) => void;
  onRemove: (teamId: string) => void;
}

const TeamRow: React.FC<TeamRowProps> = ({
  team,
  rowRef,
  teamErrors,
  getAriaPropsForField,
  onTeamNameChange,
  onLocationSelect,
  onLocationFocus,
  onCoordinateChange,
  onRemove,
}) => {
  return (
    <tr ref={rowRef} className="border-b border-t border-300 border-black last:border-b-0">
      <td>
        <input
          type="text"
          name={`team-name-${team.id}`}
          value={team.name}
          onChange={e => onTeamNameChange(team.id, e.target.value)}
          className="p-2 rounded w-full bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out"
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
      <td>
        <div className="flex flex-col">
          <div className="flex">
            <input
              type="number"
              name={`latitude-${team.id}`}
              value={team.latitude}
              min={MIN_LATITUDE}
              max={MAX_LATITUDE}
              step="0.001"
              onChange={e => {
                const value = parseFloat(e.target.value);
                onCoordinateChange(team.id, 'latitude', value);
              }}
              {...getAriaPropsForField(team.id, 'latitude')}
              className={clsx('rounded w-1/2 p-2 bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out', {
                'border-2 border-red-500': teamErrors?.latitude,
              })}
              placeholder="Latitude"
            />
            <input
              type="number"
              name={`longitude-${team.id}`}
              value={team.longitude}
              min={MIN_LONGITUDE}
              max={MAX_LONGITUDE}
              step="0.001"
              onChange={e => {
                const value = parseFloat(e.target.value);
                onCoordinateChange(team.id, 'longitude', value);
              }}
              {...getAriaPropsForField(team.id, 'longitude')}
              className={clsx('rounded w-1/2 p-2 bg-gray-100 focus:bg-white hover:bg-white duration-300 ease-out', {
                'border-2 border-red-500': teamErrors?.longitude,
              })}
              placeholder="Longitude"
            />
          </div>
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
