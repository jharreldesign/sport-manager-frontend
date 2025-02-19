import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Team, Game } from '../types'; // Ensure the types are correct and imported
import { Spinner } from 'react-bootstrap';
import '../components/css/TeamDetail.css';

const TeamDetail: React.FC = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        console.log("Attempting to fetch team with teamId:", teamId); // Debugging teamId

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

        axios
            .get<Team>(`http://localhost:3000/teams/${teamId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log("Team data fetched successfully:", response.data); // Debugging response
                setTeam(response.data);
                setLoading(false);
            })
            .catch((err) => {
                let errorMessage = 'An unknown error occurred.';
                if (err.response) {
                    errorMessage = `Error: ${err.response.data.error || 'Something went wrong.'}`;
                    console.error("API error response:", err.response); // Debugging error response
                } else if (err.request) {
                    errorMessage = 'No response from server.';
                    console.error("No response from server:", err.request); // Debugging no response
                }
                setError(errorMessage);
                setLoading(false);
            });
    }, [teamId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const formatDateString = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    // Updated getGamesForDate to work with schedule
    const getGamesForDate = (date: string) => {
        if (team && team.schedule) {
            return team.schedule.filter((game: Game) => {
                const formattedGameDate = formatDateString(game.date);
                return formattedGameDate === date;
            });
        }
        return [];
    };

    if (loading) return <div className="loading"><Spinner animation="border" variant="primary" /> Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

    return (
        <div className="team-detail">
            <button onClick={handleGoBack} className="btn btn-secondary">Back</button>
            {team && (
                <>
                    {team.stadium_photo && (
                        <img src={team.stadium_photo} alt={`${team.stadium} photo`} className="stadium-photo" />
                    )}
                    <h1>{team.city} {team.name}</h1>
                    <p><strong>Stadium:</strong> {team.stadium}</p>
                    <p><strong>Sport:</strong> {team.sport}</p>

                    <h2>Players</h2>
                    {team.players && team.players.length > 0 ? (
                        <ul>
                            {team.players.map((player) => (
                                <li key={player._id}>
                                    <Link to={`/players/${player._id}`}>
                                        {player.first_name} {player.last_name} - Position: {player.position}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No players available for this team.</p>
                    )}

                    <h2>Schedule</h2>

                    <div className="calendar">
                        <div className="calendar-header">
                            <button onClick={handlePrevMonth}>Previous</button>
                            <span>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</span>
                            <button onClick={handleNextMonth}>Next</button>
                        </div>
                        <div className="calendar-grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div className="calendar-cell header" key={day}>
                                    {day}
                                </div>
                            ))}

                            {Array(firstDayOfMonth).fill(null).map((_, idx) => (
                                <div className="calendar-cell" key={idx}></div>
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, idx) => {
                                const date = `${currentYear}-${currentMonth + 1}-${idx + 1}`;
                                const formattedDate = formatDateString(date);
                                const gamesOnDay = getGamesForDate(formattedDate);

                                return (
                                    <div className="calendar-cell" key={idx}>
                                        <div className="date">{idx + 1}</div>
                                        {gamesOnDay.length > 0 && (
                                            <div className="games">
                                                {gamesOnDay.map((game) => (
                                                    <div key={game._id}>
                                                        <Link to={`/games/${game._id}`}>{game.home_team.name} vs. {game.away_team.name}</Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeamDetail;
