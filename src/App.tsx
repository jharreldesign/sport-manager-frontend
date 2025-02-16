import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TeamList from './components/TeamList';
import TeamDetail from './components/TeamDetail';
import PlayerList from './components/PlayerList';
import CreateTeam from './components/CreateTeam';
import CreatePlayer from './components/CreatePlayer';
import CreateSchedule from './components/CreateSchedule';
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Welcome to the Sports App</h1>
        <nav>
          <Link to="/">Home</Link> 
          | <Link to="/players">Players</Link> 
          | <Link to='/teams'>Teams</Link>
          | <Link to="/login">Login</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<TeamList />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/teams" element={<TeamList />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/create-player" element={<CreatePlayer />} />
        <Route path="/create-schedule" element={<CreateSchedule />} />
        {/* Route to display team details with team ID in URL */}
        <Route path="/team/:teamId" element={<TeamDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
