import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Team, Player } from '../types';  // Ensure Player is imported if you're defining it in types
import { Spinner } from 'react-bootstrap';

const TeamDetail: React.FC = () => {
    const { teamId } = useParams();  // Get teamId from URL
    const navigate = useNavigate();  // Use useNavigate for navigation
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!teamId) {
            setError('No team selected');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You are not logged in');
            setLoading(false);
            return;
        }

        // Fetch team data using the teamId
        axios
            .get<Team>(`http://localhost:3000/teams/${teamId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setTeam(response.data);
                setLoading(false);
            })
            .catch((err) => {
                let errorMessage = 'An unknown error occurred.';
                if (err.response) {
                    // Server responded with a status code outside of 2xx range
                    errorMessage = `Error: ${err.response.data.error || 'Something went wrong.'}`;
                } else if (err.request) {
                    // Request was made but no response received
                    errorMessage = 'No response from server.';
                }
                setError(errorMessage);
                setLoading(false);
            });
    }, [teamId]);

    const handleGoBack = () => {
        navigate(-1);  // Use navigate(-1) to go back
    };

    if (loading) return <div className="loading"><Spinner animation="border" variant="primary" /> Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="team-detail">
            <button onClick={handleGoBack} className="btn btn-secondary">Back</button>
            {team && (
                <>
                    <h1>{team.city} {team.name}</h1>
                    <p><strong>Stadium:</strong> {team.stadium}</p>
                    <p><strong>Sport:</strong> {team.sport}</p>

                    <h2>Players</h2>
                    {team.players && team.players.length > 0 ? (
                        <ul>
                            {team.players.map((player: Player) => (
                                <li key={player._id}>
                                    {player.first_name} {player.last_name} - Position: {player.position}
                                    {/* Check if the player has a team and display it */}
                                    {player.team && player.team.name && (
                                        <span> - Team: {player.team.name}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No players available for this team.</p>
                    )}

                    <h2>Schedule</h2>
                    {team.schedule && team.schedule.length > 0 ? (
                        <ul>
                            {team.schedule.map((game, index) => (
                                <li key={index}>
                                    <p><strong>Game {index + 1}:</strong></p>
                                    <p>Date: {new Date(game.date).toLocaleDateString()}</p>
                                    <p>Opponent: {game.away_team ? game.away_team.name : "Unknown Opponent"}</p>
                                    <p>Location: {game.arena} in {game.city}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No games scheduled for this team.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default TeamDetail;
