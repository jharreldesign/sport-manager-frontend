import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Game } from '../types';
import '../components/css/GameDetail.css';

const GameDetail: React.FC = () => {
    const { scheduleId } = useParams(); // Get the scheduleId from the URL
    const navigate = useNavigate();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!scheduleId) {
            setError('No game selected');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You are not logged in');
            setLoading(false);
            return;
        }

        // Fetch the game details from the backend using the scheduleId
        axios
            .get<Game>(`http://localhost:3000/schedules/${scheduleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setGame(response.data); // Set the game data
                setLoading(false);
            })
            .catch((err) => {
                let errorMessage = 'An unknown error occurred.';
                if (err.response) {
                    errorMessage = `Error: ${err.response.data.error || 'Something went wrong.'}`;
                } else if (err.request) {
                    errorMessage = 'No response from server.';
                }
                setError(errorMessage);
                setLoading(false);
            });
    }, [scheduleId]);

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    if (loading) return <div className="loading"><Spinner animation="border" variant="primary" /> Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="game-detail">
            <button onClick={handleGoBack} className="btn btn-secondary">Back</button>
            {game && (
                <>
                    <div className="game-header">
                        <h1>{game.home_team.name} vs. {game.away_team.name}</h1>
                        <p><strong>Date:</strong> {new Date(game.date).toLocaleString()}</p>
                        <p><strong>Arena:</strong> {game.arena}</p>
                        <p><strong>Location:</strong> {game.city}</p>
                        <p><strong>Status:</strong> {game.status}</p>
                    </div>

                    <div className="game-teams">
                        <h2>Team Details</h2>
                        <div className="team-info">
                            <h3>Home Team: {game.home_team.name}</h3>
                            <p>{game.home_team.city} | {game.home_team.stadium}</p>
                        </div>

                        <div className="team-info">
                            <h3>Away Team: {game.away_team.name}</h3>
                            <p>{game.away_team.city} | {game.away_team.stadium}</p>
                        </div>
                    </div>

                    <div className="game-summary">
                        <h2>Game Summary</h2>
                        <p>
                            The game between {game.home_team.name} and {game.away_team.name} is scheduled to take place on {new Date(game.date).toLocaleDateString()} at {game.arena} in {game.city}.
                        </p>
                    </div>

                    <div className="game-stats">
                        <h2>Game Statistics</h2>
                        {/* Add more game stats as needed */}
                        <p>Score: {game.home_team.name} {game.home_score} - {game.away_team.name} {game.away_score}</p>
                        <p>Attendance: {game.attendance}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default GameDetail;
