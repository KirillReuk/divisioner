import { useEffect, useReducer, useState } from 'react';
import { Rivalry, Tab, Team } from '../utils/types';
import MapView from '../divisions/MapView';
import TeamView from '../teams/TeamViewer';
import DivisionView from '../divisions/DivisionView';
import './App.css';
import DivisionCountInput from '../teams/DivisionCountInput';
import Partitioning, { splitIntoConferences } from '../utils/partitioning';
import PresetModal from '../components/Modal/PresetModal';
import IntroModal from '../components/Modal/IntroModal';
import RivalryModal from '../components/Modal/RivalryModal';
import { initialTeamBuilderState, teamBuilderReducer } from '../app/teamBuilderReducer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('teams');
  const [showRivalry, setShowRivalry] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetModalWelcome, setPresetModalWelcome] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [state, dispatch] = useReducer(teamBuilderReducer, initialTeamBuilderState);
  const { divisions, conferences, teams, rivalries, divisionsCount, mapPickerTeamId } = state;

  const setTeams: React.Dispatch<React.SetStateAction<Team[]>> = value => {
    const nextTeams = typeof value === 'function' ? value(teams) : value;
    dispatch({ type: 'SET_TEAMS', payload: { teams: nextTeams } });
  };

  const setDivisionsCount: React.Dispatch<React.SetStateAction<number>> = value => {
    const nextCount = typeof value === 'function' ? value(divisionsCount) : value;
    dispatch({ type: 'SET_DIVISIONS_COUNT', payload: { count: nextCount } });
  };

  const setMapPickerTeamId: React.Dispatch<React.SetStateAction<string | null>> = value => {
    const nextTeamId = typeof value === 'function' ? value(mapPickerTeamId) : value;
    dispatch({ type: 'SET_MAP_PICKER_TEAM_ID', payload: { teamId: nextTeamId } });
  };

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      setShowIntroModal(true);
    } else {
      setPresetModalWelcome(true);
      setShowPresetModal(true);
    }
  }, []);

  const handleCloseIntro = () => {
    setShowIntroModal(false);
    localStorage.setItem('hasSeenIntro', 'true');
    setPresetModalWelcome(true);
    setShowPresetModal(true);
  };

  const openPresetModalPlain = () => {
    setPresetModalWelcome(false);
    setShowPresetModal(true);
  };

  const closePresetModal = () => {
    setShowPresetModal(false);
    setPresetModalWelcome(false);
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
        variant={presetModalWelcome ? 'welcome' : 'plain'}
        onClose={closePresetModal}
        onSelectPreset={({ teams: presetTeams, divisionsCount }) => {
          dispatch({ type: 'APPLY_PRESET', payload: { teams: presetTeams, divisionsCount } });
        }}
      />

      <RivalryModal
        isOpen={showRivalry}
        onClose={() => setShowRivalry(false)}
        teams={teams}
        divisionsCount={divisionsCount}
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
              rivalries={rivalries}
              setTeams={setTeams}
              onOpenPresetModal={openPresetModalPlain}
              setShowRivalry={setShowRivalry}
              mapPickerTeamId={mapPickerTeamId}
              setMapPickerTeamId={setMapPickerTeamId}
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
