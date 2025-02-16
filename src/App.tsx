import { useState } from 'react';
import { defaultDivisionCount, Team, defaultTeams, Division } from './data/teams';
import MapView from './divisionsTab/MapView';
import TeamView from './inputTab/TeamViewer';
import DivisionView from './divisionsTab/DivisionView';
import './App.css';
import DivisionCountInput from './inputTab/DivisionCountInput';

export type Tab = 'teams' | 'divisions';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('teams');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [conferences, setConferences] = useState<Division[][]>([]);
  const [teams, setTeams] = useState<Team[]>(defaultTeams);
  const [divisionsCount, setDivisionsCount] = useState<number>(defaultDivisionCount);

  const renderTabButton = (tab: Tab, tabName: string, disabled?: boolean): JSX.Element => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-300'} ${disabled && 'text-gray-400'}`}
      disabled={disabled}
    >
      {tabName}
    </button>
  );

  return (
    <>
      <div className="flex justify-start mb-4 gap-2">
        {renderTabButton('teams', 'Teams')}
        {renderTabButton('divisions', 'Divisions', divisions.length === 0)}
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
    </>
  );
};

export default App;
