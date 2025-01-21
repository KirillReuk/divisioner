import { useState } from 'react';
import { defaultDivisionCount, Team, defaultTeams } from './data/teams';
import MapView from './MapView';
import TeamView from './TeamViewer';
import DivisionView from './DivisionView';
import './App.css';

const App: React.FC = () => {
  const [divisions, setDivisions] = useState<Team[][]>([]);
  const [conferences, setConferences] = useState<Team[][][]>([]);
  const [teams, setTeams] = useState<Team[]>(defaultTeams);
  const [divisionsCount, setDivisionsCount] = useState<number>(defaultDivisionCount);

  return (
    <>
      <div className="flex p-4">
        <div className="flex-1 mr-8">
          <TeamView teams={teams} setTeams={setTeams} />
        </div>

        <div className="flex-1">
          <DivisionView
            teams={teams}
            conferences={conferences}
            divisionsCount={divisionsCount}
            setDivisions={setDivisions}
            setConferences={setConferences}
            setDivisionsCount={setDivisionsCount}
          />
        </div>
      </div>

      <div className="h-[600px] w-full">
        <MapView divisions={divisions} />
      </div>
    </>
  );
};

export default App;
