import { useState } from 'react';
import { defaultDivisionCount, Team, defaultTeams } from './data/teams';
import MapView from './MapView';
import TeamView from './inputTab/TeamViewer';
import DivisionView from './DivisionView';
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
    <>
      <button onClick={() => setActiveTab(activeTab === 'teams' ? 'divisions' : 'teams')}>Swap Tabs</button>
      {activeTab === 'teams' ? (
        <div className="flex p-4">
          <div className="flex-1 mr-8">
            <DivisionCountInput
              teams={teams}
              divisionsCount={divisionsCount}
              setDivisions={setDivisions}
              setConferences={setConferences}
              setDivisionsCount={setDivisionsCount}
            />
            <TeamView teams={teams} setTeams={setTeams} />
          </div>
        </div>
      ) : (
        <div className="flex p-4">
          <div className="flex-1">
            <DivisionView conferences={conferences} />
          </div>

          <div className="h-[600px] w-full">
            <MapView divisions={divisions} />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
