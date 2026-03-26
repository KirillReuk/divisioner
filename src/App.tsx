import { useEffect, useReducer, useState } from 'react';
import { Rivalry, Tab, Team } from './utils/types';
import MapView from './divisionsTab/MapView';
import TeamView from './inputTab/TeamViewer';
import DivisionView from './divisionsTab/DivisionView';
import './App.css';
import DivisionCountInput from './inputTab/DivisionCountInput';
import Partitioning, { splitIntoConferences } from './utils/partitioning';
import PresetModal from './PresetModal';
import IntroModal from './IntroModal';
import RivalryModal from './rivalryTab/RivalryModal';
import { initialTeamBuilderState, teamBuilderReducer } from './state/teamBuilderReducer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('teams');
  const [showRivalry, setShowRivalry] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [state, dispatch] = useReducer(teamBuilderReducer, initialTeamBuilderState);
  const { divisions, conferences, teams, rivalries, divisionsCount, mapPickerIndex } = state;

  const setTeams: React.Dispatch<React.SetStateAction<Team[]>> = value => {
    const nextTeams = typeof value === 'function' ? value(teams) : value;
    dispatch({ type: 'SET_TEAMS', payload: { teams: nextTeams } });
  };

  const setDivisionsCount: React.Dispatch<React.SetStateAction<number>> = value => {
    const nextCount = typeof value === 'function' ? value(divisionsCount) : value;
    dispatch({ type: 'SET_DIVISIONS_COUNT', payload: { count: nextCount } });
  };

  const setMapPickerIndex: React.Dispatch<React.SetStateAction<number | null>> = value => {
    const nextIndex = typeof value === 'function' ? value(mapPickerIndex) : value;
    dispatch({ type: 'SET_MAP_PICKER_INDEX', payload: { index: nextIndex } });
  };

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
    const conferences = splitIntoConferences(divisions);
    dispatch({ type: 'SET_GENERATED_STRUCTURE', payload: { divisions, conferences } });
  };

  return (
    <>
      {showIntroModal && <IntroModal onClose={handleCloseIntro} />}
      <PresetModal
        isOpen={showPresetModal}
        onClose={() => setShowPresetModal(false)}
        onSelectPreset={presetTeams => {
          dispatch({ type: 'APPLY_PRESET', payload: { teams: presetTeams } });
        }}
      />

      <RivalryModal
        isOpen={showRivalry}
        onClose={() => setShowRivalry(false)}
        teams={teams}
        rivalries={rivalries}
        dispatch={dispatch}
      />

      <div className="flex justify-start mb-4 gap-2">
        {renderTabButton('teams', 'Teams')}
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
            <TeamView
              teams={teams}
              setTeams={setTeams}
              setShowPresetModal={setShowPresetModal}
              setShowRivalry={setShowRivalry}
              mapPickerIndex={mapPickerIndex}
              setMapPickerIndex={setMapPickerIndex}
            />
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
