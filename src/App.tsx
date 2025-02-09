import { useState } from 'react';
import { defaultDivisionCount, Team, defaultTeams } from './data/teams';
import MapView from './MapView';
import TeamView from './inputTab/TeamViewer';
import DivisionView from './DivisionView';
import './App.css';
import DivisionCountInput from './inputTab/DivisionCountInput';

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
          <DivisionCountInput
            teams={teams}
            divisionsCount={divisionsCount}
            setDivisions={setDivisions}
            setConferences={setConferences}
            setDivisionsCount={setDivisionsCount}
          />
        </div>

        <div className="flex-1">
          <DivisionView conferences={conferences} />
        </div>
      </div>

      <div className="h-[600px] w-full">
        <MapView divisions={divisions} />
      </div>
    </>
  );
};

export default App;
