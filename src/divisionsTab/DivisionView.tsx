import React from 'react';
import { Division } from '../data/teams';
import chroma from 'chroma-js';

interface EditableTeamsProps {
  conferences: Division[][];
}

const conferenceNames = ['Eastern Conference', 'Western Conference'];

const DivisionView: React.FC<EditableTeamsProps> = ({ conferences }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex gap-4">
        {conferences.map((conference, conferenceIndex) => (
          <div className="flex-1">
            <h2 className="font-bold mb-4">{conferenceNames[conferenceIndex]}</h2>
            {conference?.map((division, index) => (
              <div
                key={`division-${index}`}
                className="mb-4 py-2 rounded-md"
                style={{ backgroundColor: chroma(division.color).desaturate().name() }}
              >
                <h2 className="font-semibold mb-2 color-black" style={{ backgroundColor: division.color }}>
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
