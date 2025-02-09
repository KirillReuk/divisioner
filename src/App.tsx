import { useState } from 'react';
import { defaultDivisionCount, Team, defaultTeams } from './data/teams';
import MapView from './divisionsTab/MapView';
import TeamView from './inputTab/TeamViewer';
import DivisionView from './divisionsTab/DivisionView';
import './App.css';
import DivisionCountInput from './inputTab/DivisionCountInput';

type activeTab = 'teams' | 'divisions';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<activeTab>('teams');
  const [divisions, setDivisions] = useState<Team[][]>([]);
  const [conferences, setConferences] = useState<Team[][][]>([]);
  const [teams, setTeams] = useState<Team[]>(defaultTeams);
  const [divisionsCount, setDivisionsCount] = useState<number>(defaultDivisionCount);

  return (
    <div className=" p-4">
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 ${activeTab === 'teams' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Teams
        </button>
        <button
          onClick={() => setActiveTab('divisions')}
          className={`px-4 py-2 ml-2 ${activeTab === 'divisions' ? 'bg-blue-500 text-white' : 'bg-gray-300'} ${divisions.length === 0 && 'text-gray-400'}`}
          disabled={divisions.length === 0}
        >
          Divisions
        </button>
      </div>
      {activeTab === 'teams' ? (
        <div className="flex">
          <div className="flex-1 mr-8">
            <DivisionCountInput
              teams={teams}
              divisionsCount={divisionsCount}
              setDivisions={setDivisions}
              setConferences={setConferences}
              setDivisionsCount={setDivisionsCount}
              setActiveTab={setActiveTab}
            />
            <TeamView teams={teams} setTeams={setTeams} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="h-[600px] w-full">
            <MapView divisions={divisions} />
          </div>
          <div className="flex-1">
            <DivisionView conferences={conferences} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
