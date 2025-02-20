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

        // Optionally check for a token but don't require it for fetching player details
        const token = localStorage.getItem('authToken');

        // Fetch player data from the backend
        axios
            .get<Player>(`http://localhost:3000/players/${playerId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}, // Only send token if available
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
                <div className="player-container">
                    <div className="player-header" style={{ backgroundImage: `url(${player.headshot || 'default-image.jpg'})` }}>
                        <div className="player-header--vitals">
                            <div className="player-info">
                                <img src={player.headshot} alt={`${player.first_name} ${player.last_name}`} className="player-headshot" />
                                <h1>{player.first_name} {player.last_name}</h1>
                                <p className="player-position"><strong>Position:</strong> {player.position}</p>
                                <p className="player-number"><strong>Number:</strong> {player.player_number}</p>
                                {player.team && (
                                    <p className="player-team"><strong>Team:</strong> {player.team.name}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="player-stats">
                        <h2>Statistics</h2>
                        <div className="stats-item"><strong>Batting Average:</strong> .300</div>
                        <div className="stats-item"><strong>Home Runs:</strong> 25</div>
                        <div className="stats-item"><strong>RBIs:</strong> 80</div>
                    </div>

                    <div className="player-bio">
                        <h2>Biography</h2>
                        <p>{player.first_name} {player.last_name} is a professional {player.position} currently playing for {player.team ? player.team.name : 'an unspecified team'}.</p>
                    </div>

                    <div className="player-games">
                        <h2>Recent Games</h2>
                        <ul>
                            <li>Game 1: 3 hits, 1 HR</li>
                            <li>Game 2: 2 hits, 2 RBIs</li>
                            <li>Game 3: 1 hit, 1 RBI</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerDetail;
