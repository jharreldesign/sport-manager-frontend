import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link for navigation
import { Team } from '../types';
import { Spinner, Card, Button } from 'react-bootstrap';  // Import Bootstrap components

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');  // Get token from localStorage

    if (!token) {
      setError('You are not logged in');
      setLoading(false);
      return;
    }

    // Make an API request with the token
    axios
      .get<Team[]>('http://localhost:3000/teams', {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
        },
      })
      .then((response) => {
        console.log('Backend Response:', response.data);  // Log the full response data to inspect it
        
        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setTeams(response.data);  // Set the teams directly if it's an array
        } else {
          setError('Invalid data format: expected an array of teams.');
        }

        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching teams: ' + error.message);  // Set error message
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading"><Spinner animation="border" variant="primary" /> Loading...</div>;
  if (error) return <div className="error">{error}</div>;  // Show the error message if there is one

  return (
    <div>
      <h1>Team List</h1>

      {/* If no teams, display a message */}
      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <ul>
          {teams.map((team) => (
            <li key={team._id}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{team.city} {team.name}</Card.Title>
                  <Card.Text>
                    {team.stadium} | {team.sport}

                  </Card.Text>
                  <Link to={`/team/${team._id}`}>
                    <Button variant="primary">View Team Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TeamList;
