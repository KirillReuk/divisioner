import React from 'react';
import { Division } from '../utils/types';
import chroma from 'chroma-js';
import { CONFERENCE_NAMES } from '../data/constants';
import clsx from 'clsx';

interface EditableTeamsProps {
  conferences: Division[][];
}

const DivisionView: React.FC<EditableTeamsProps> = ({ conferences }) => (
  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
    <div className="flex gap-4">
      {conferences.map((conference, conferenceIndex) => (
        <div className="flex-1" key={`conference-${conferenceIndex}`}>
          <h2 className="font-bold mb-4">{CONFERENCE_NAMES[conferenceIndex]}</h2>
          {conference?.map((division, index) => {
            const backgroundColor = chroma(division.color).desaturate();
            const textColor = backgroundColor.luminance() > 0.3 ? 'text-black' : 'text-gray-50';

            return (
              <div
                key={`division-${index}`}
                className="mb-4 py-2 rounded-md"
                style={{ backgroundImage: `linear-gradient(to bottom, ${division.color}, ${backgroundColor.name()})` }}
              >
                <h2 className={clsx('font-semibold mb-2', textColor)}>Division {index + 1}</h2>
                <ul>
                  {division.teams.map((team, teamIndex) => (
                    <li key={`team-${conferenceIndex}-${index}-${teamIndex}`} className={textColor}>
                      {team.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

export default DivisionView;
