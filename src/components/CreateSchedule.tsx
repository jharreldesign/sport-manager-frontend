import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Team } from '../types';
import { Spinner, Modal, Button } from 'react-bootstrap';

const CreateScheduleForm: React.FC = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [awayTeam, setAwayTeam] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [location, setLocation] = useState<string>('home');  // Add location state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || !teamId) {
            setError('No team selected or not logged in');
            setLoading(false);
            return;
        }

        axios
            .get<Team>(`http://localhost:3000/teams/${teamId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setHomeTeam(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load team data');
                setLoading(false);
            });

        axios
            .get<Team[]>(`http://localhost:3000/teams`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const filteredTeams = response.data.filter((team) => team._id !== teamId);
                setAllTeams(filteredTeams);
            })
            .catch((err) => {
                setError('Failed to load teams');
            });
    }, [teamId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!homeTeam || !awayTeam || !date) {
            setError('All fields are required');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('You are not logged in');

            const gameData = {
                home_team: homeTeam._id,
                away_team: awayTeam,
                date,
                location,  // Include location
                city: homeTeam.city,
                arena: homeTeam.stadium,
            };

            const response = await axios.post(
                `http://localhost:3000/teams/${teamId}/schedules`,
                gameData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Game created:', response.data);

            // Re-fetch the team data to update the schedule
            const updatedTeamResponse = await axios.get<Team>(
                `http://localhost:3000/teams/${teamId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setHomeTeam(updatedTeamResponse.data); // Update the home team state
            setShowModal(true); // Show the modal
        } catch (error) {
            console.error('Error creating game:', error);
            setError('Error creating schedule');
        }
    };

    const handleCreateAnother = () => {
        setShowModal(false);
        setAwayTeam('');
        setDate('');
    };

    const handleReturnToTeamDetails = () => {
        setShowModal(false);
        navigate(`/team/${teamId}`);
    };

    if (loading) return <div><Spinner animation="border" variant="primary" /> Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Create a New Game</h2>
            {homeTeam && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Home Team: {homeTeam.name}</label>
                    </div>
                    <div>
                        <label>Away Team:</label>
                        <select
                            value={awayTeam}
                            onChange={(e) => setAwayTeam(e.target.value)}
                        >
                            <option value="">Select Away Team</option>
                            {allTeams.map((team) => (
                                <option key={team._id} value={team._id}>
                                    {team.name} ({team.city})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Location:</label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="home">Home</option>
                            <option value="away">Away</option>
                        </select>
                    </div>
                    <button type="submit">Create Game</button>
                </form>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Game Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Would you like to create another game or return to the team details page?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCreateAnother}>
                        Create Another Game
                    </Button>
                    <Button variant="secondary" onClick={handleReturnToTeamDetails}>
                        Return to Team Details
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateScheduleForm;
