import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TeamList from './components/TeamList';
import TeamDetail from './components/TeamDetail';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetails';
import CreateTeam from './components/CreateTeam';
import CreatePlayer from './components/CreatePlayer';
import CreateSchedule from './components/CreateSchedule';
import GameDetail from './components/GameDetail';
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Welcome to the Sports App</h1>
        <nav>
          <Link to="/">Home</Link> 
          | <Link to="/players">Players</Link>
          | <Link to="/create-player">Create A Player</Link>
          | <Link to='/teams'>Teams</Link>
          | <Link to='/create-team'>Create A Team</Link>
          | <Link to="/login">Login</Link>
        </nav>
      </header>

      <Routes>
        {/* Route for the Home page with list of teams */}
        <Route path="/" element={<TeamList />} />
        
        {/* Route for displaying list of players */}
        <Route path="/players" element={<PlayerList />} />
        
        {/* Route for displaying list of teams */}
        <Route path="/teams" element={<TeamList />} />
        
        {/* Route to create a new team */}
        <Route path="/create-team" element={<CreateTeam />} />
        
        {/* Route to create a new player */}
        <Route path="/create-player" element={<CreatePlayer />} />
        
        {/* Route for creating a schedule for a specific team */}
        <Route path="/create-schedule/:teamId" element={<CreateSchedule />} />

        {/* Route for displaying team details, with dynamic teamId */}
        <Route path="/team/:teamId" element={<TeamDetail />} />

        {/* Route for displaying player details, with dynamic playerId */}
        <Route path="/players/:playerId" element={<PlayerDetail />} />

        <Route path='/games/:scheduleId' element={<GameDetail />} />
        
        {/* Route for the Login page */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;