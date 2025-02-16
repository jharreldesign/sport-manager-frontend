import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TeamList from './components/TeamList';
import TeamDetail from './components/TeamDetail';
import PlayerList from './components/PlayerList';
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Welcome to the Baseball App</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/players">Players</Link> | <Link to="/login">Login</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<TeamList />} />
        <Route path="/players" element={<PlayerList />} />
        {/* Route to display team details with team ID in URL */}
        <Route path="/team/:teamId" element={<TeamDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
