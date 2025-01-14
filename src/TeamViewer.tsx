import React from 'react';
import { Team } from './data/teams';

interface EditableTeamsProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamView: React.FC<EditableTeamsProps> = ({ teams, setTeams }) => {
  const handleInputChange = (index: number, field: keyof Team, value: string | number) => {
    const updatedTeams = [...teams];
    updatedTeams[index] = { ...updatedTeams[index], [field]: value };
    setTeams(updatedTeams);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="w-1/4 border border-gray-300 px-4 py-2 text-left">Latitude</th>
              <th className="w-1/4 border border-gray-300 px-4 py-2 text-left">Longitude</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td>
                  <input
                    type="text"
                    value={team.name}
                    onChange={e => handleInputChange(index, 'name', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-400"
                    placeholder="Team Name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={team.latitude}
                    onChange={e => handleInputChange(index, 'latitude', parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-400"
                    placeholder="Latitude"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={team.longitude}
                    onChange={e => handleInputChange(index, 'longitude', parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-400"
                    placeholder="Longitude"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamView;
