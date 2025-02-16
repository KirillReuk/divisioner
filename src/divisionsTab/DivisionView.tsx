import React from 'react';
import { Division } from '../data/teams';
import { shadeHue } from '../utils/partitioning';

interface EditableTeamsProps {
  conferences: Division[][];
}

const conferenceNames = ['Eastern Conference', 'Western Conference'];

const DivisionView: React.FC<EditableTeamsProps> = ({ conferences }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Divisions</h2>
      <div className="flex gap-4">
        {conferences.map((conference, conferenceIndex) => (
          <div className="flex-1">
            <h2 className="font-bold mb-4">{conferenceNames[conferenceIndex]}</h2>
            {conference?.map((division, index) => (
              <div
                key={`division-${index}`}
                className="mb-4 p-2 rounded-md text-stone-200"
                style={{ backgroundColor: shadeHue(division.hue, 70, 40) }}
              >
                <h2 className="font-semibold mb-2" style={{ backgroundColor: shadeHue(division.hue, 60, 40) }}>
                  Division {index + 1}
                </h2>
                <ul>
                  {division.teams.map((team, teamIndex) => (
                    <li key={`team-${conferenceIndex}-${index}-${teamIndex}`}>{team.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DivisionView;
