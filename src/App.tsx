import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TeamList from './components/TeamList';
import TeamDetail from './components/TeamDetail';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetails';
import CreateTeam from './components/CreateTeam';
import CreatePlayer from './components/CreatePlayer';
import CreateSchedule from './components/CreateSchedule';
import GameDetail from './components/GameDetail';
import SignIn from './components/Login';  // Renamed Login to SignIn for consistency
import SignUp from './components/SignUp';  // Assuming you have SignUp component
import NavBar from './components/NavBar'; // Import the NavBar
import useAuth from './hooks/useAuth';  // Assuming you have `useAuth` hook for managing user state

const App: React.FC = () => {
  const { token, login, logout } = useAuth(); // Fetch the token using the useAuth hook
  const [loading, setLoading] = useState(true);

  // Check token on initial load to set login state
  useEffect(() => {
    if (token) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <header>
        <h1>Welcome to the Sports App</h1>
        {token ? (
          <div>
            <p>Welcome!</p>
            <button onClick={logout}>Sign Out</button>
          </div>
        ) : (
          <div>
            <Link to="/auth/sign-in">
              <button>Sign In</button>
            </Link>
            <Link to="/auth/sign-up">
              <button>Sign Up</button>
            </Link>
          </div>
        )}
      </header>
      <Routes>
        {/* Public routes for viewing teams and players */}
        <Route path="/" element={<TeamList />} />
        <Route path='/teams' element={<TeamList />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/teams/:teamId" element={<TeamDetail />} />
        <Route path="/players/:playerId" element={<PlayerDetail />} />
        <Route path="/games/:scheduleId" element={<GameDetail />} />

        {/* Protected routes (only available if logged in) */}
        {token && (
          <>
            <Route path="/create-player" element={<CreatePlayer />} />
            <Route path="/create-team" element={<CreateTeam />} />
            <Route path="/create-schedule/:teamId" element={<CreateSchedule />} />
          </>
        )}

        {/* Authentication routes */}
        <Route path="/auth/sign-in" element={<SignIn login={login} />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default App;
