import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Card, Button } from 'react-bootstrap';
import { Team } from '../types';
import { Link } from 'react-router-dom';

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make the API call without authorization headers
        const response = await axios.get('http://localhost:3000/teams');
        
        // Check the structure of the response to ensure it's an array
        if (Array.isArray(response.data.teams)) {
          setTeams(response.data.teams); // Assuming the teams array is under the "teams" key
        } else {
          setError('Unexpected response structure: No teams found.');
        }
      } catch (error: any) {
        setError('Error fetching teams: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <div className="loading"><Spinner animation="border" variant="primary" /> Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h1>Team List</h1>
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
                  <Link to={`/teams/${team._id}`}>
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
