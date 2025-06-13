import { useEffect, useState } from 'react';
import { Division, Rivalry, Tab, Team } from './utils/types';
import MapView from './divisionsTab/MapView';
import TeamView from './inputTab/TeamViewer';
import DivisionView from './divisionsTab/DivisionView';
import './App.css';
import DivisionCountInput from './inputTab/DivisionCountInput';
import Partitioning, { splitIntoConferences } from './utils/partitioning';
import RivalryView from './rivalryTab/RivalryView';
import { DEFAULT_DIVISION_COUNT } from './data/constants';
import PresetModal from './PresetModal';
import IntroModal from './IntroModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('teams');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [conferences, setConferences] = useState<Division[][]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rivalries, setRivalries] = useState<Rivalry[]>([]);
  const [divisionsCount, setDivisionsCount] = useState<number>(DEFAULT_DIVISION_COUNT);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      setShowIntroModal(true);
    }
  }, []);

  const handleCloseIntro = () => {
    setShowIntroModal(false);
    localStorage.setItem('hasSeenIntro', 'true');
  };

  const renderTabButton = (tab: Tab, tabName: string, disabled?: boolean): JSX.Element => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-300'} ${disabled && 'text-gray-400'}`}
      disabled={disabled}
    >
      {tabName}
    </button>
  );

  const generateConferences = (teams: Team[], divisionCount: number, rivalries: Rivalry[]) => {
    const partitioning = new Partitioning(teams, divisionCount, rivalries);
    const divisions = partitioning.getDivisions();
    setDivisions(divisions);
    const conferences = splitIntoConferences(divisions);
    setConferences(conferences);
  };

  return (
    <>
      {showIntroModal && <IntroModal onClose={handleCloseIntro} />}
      <PresetModal
        isOpen={showPresetModal}
        onClose={() => setShowPresetModal(false)}
        onSelectPreset={presetTeams => setTeams(presetTeams)}
      />

      <div className="flex justify-start mb-4 gap-2">
        {renderTabButton('teams', 'Teams')}
        {renderTabButton('rivalries', 'Rivalries')}
        {renderTabButton('divisions', 'Divisions', divisions.length === 0)}
      </div>
      {activeTab === 'teams' && (
        <div className="flex">
          <div className="flex-1">
            <DivisionCountInput
              teams={teams}
              divisionsCount={divisionsCount}
              generateConferences={generateConferences}
              rivalries={rivalries}
              setDivisionsCount={setDivisionsCount}
              setActiveTab={setActiveTab}
            />
            <TeamView teams={teams} setTeams={setTeams} setShowPresetModal={setShowPresetModal} />
          </div>
        </div>
      )}
      {activeTab === 'rivalries' && (
        <div className="flex">
          <div className="flex-1">
            <div className="flex items-center p-4 bg-gray-100 mb-4">
              <button
                onClick={() => {
                  generateConferences(teams, divisionsCount, rivalries);
                  setActiveTab('divisions');
                }}
                className="flex-1 bg-blue-500 text-white rounded h-8"
              >
                Generate Divisions
              </button>
            </div>
            <RivalryView teams={teams} rivalries={rivalries} setRivalries={setRivalries} />
          </div>
        </div>
      )}
      {activeTab === 'divisions' && (
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
