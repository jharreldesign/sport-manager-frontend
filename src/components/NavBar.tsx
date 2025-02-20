import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const NavBar: React.FC = () => {
  const { token, logout } = useAuth();  // Assuming you have a `useAuth` hook managing login state

  const handleLogout = () => {
    logout(); // Call the logout function from `useAuth` to clear the token
  };

  return (
    <header>
      <h1>Welcome to the Sports App</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/players">Players</Link> |{' '}
        <Link to="/create-player">Create A Player</Link> | <Link to="/teams">Teams</Link> |{' '}
        <Link to="/create-team">Create A Team</Link> 
        {token ? (
          <>
            | <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
          </>
        ) : (
          <>
            | <Link to="/auth/sign-in"><Button variant="primary">Sign In</Button></Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
