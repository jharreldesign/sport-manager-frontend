import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Player } from '../types'; // Ensure the types are correct and imported
import { Spinner } from 'react-bootstrap';
import '../components/css/PlayerDetails.css';

const PlayerDetail: React.FC = () => {
    const { playerId } = useParams(); // Get the playerId from the URL
    const navigate = useNavigate();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!playerId) {
            setError('No player selected');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You are not logged in');
            setLoading(false);
            return;
        }

        // Fetch player data from the backend
        axios
            .get<Player>(`http://localhost:3000/players/${playerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setPlayer(response.data);
                setLoading(false);
                console.log("Player data fetched:", response.data); // Log the player data
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
    }, [playerId]);

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    if (loading) return <div className="loading"><Spinner animation="border" variant="primary" /> Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="player-detail">
            <button onClick={handleGoBack} className="btn btn-secondary">Back</button>
            {player && (
                <>
                    <div className="player-header">
                        {player.headshot && (
                            <img src={player.headshot} alt={`${player.first_name} ${player.last_name} photo`} className="player-headshot" />
                        )}
                        <h1>{player.first_name} {player.last_name}</h1>
                        <p><strong>Position:</strong> {player.position}</p>
                        <p><strong>Number:</strong> {player.player_number}</p>
                        {player.team && (
                            <p><strong>Team:</strong> {player.team.name}</p>
                        )}
                    </div>

                    <div className="player-stats">
                        <h2>Statistics</h2>
                        {/* Add player statistics here */}
                        <p>Batting Average: .300</p>
                        <p>Home Runs: 25</p>
                        <p>RBIs: 80</p>
                    </div>

                    <div className="player-bio">
                        <h2>Biography</h2>
                        <p>
                            {player.first_name} {player.last_name} is a professional {player.position} currently playing for {player.team ? player.team.name : 'an unspecified team'}.
                        </p>
                    </div>

                    <div className="player-games">
                        <h2>Recent Games</h2>
                        {/* Add recent games here */}
                        <ul>
                            <li>Game 1: 3 hits, 1 HR</li>
                            <li>Game 2: 2 hits, 2 RBIs</li>
                            <li>Game 3: 1 hit, 1 RBI</li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default PlayerDetail;