import React from 'react';
import { Team } from '../data/teams';

interface EditableTeamsProps {
  conferences: Team[][][];
}

const DivisionView: React.FC<EditableTeamsProps> = ({ conferences }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Divisions</h2>
      {conferences.length !== 0 && (
        <div className="flex">
          <div className="flex-1">
            <h2 className="font-bold mb-4">Eastern Conference</h2>
            {conferences[0]?.map((division, index) => (
              <div key={`division-${index}`} className="mb-4">
                <h2 className="font-semibold mb-4">Division {index + 1}</h2>
                <ul>
                  {division.map((team, idx) => (
                    <li key={idx}>{team.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h2 className="font-bold mb-4">Western Conference</h2>
            {conferences[1]?.map((division, index) => (
              <div key={`division-${index}`} className="mb-4">
                <h2 className="font-semibold mb-4">Division {index + 1}</h2>
                <ul>
                  {division.map((team, idx) => (
                    <li key={idx}>{team.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DivisionView;
