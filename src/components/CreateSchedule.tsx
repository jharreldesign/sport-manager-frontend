import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ScheduleFormState, Team } from '../types';

const CreateSchedule = () => {
    const [formData, setFormData] = useState<ScheduleFormState>({
        home_team: '',
        away_team: '',
        date: '',
        arena: '',
        city: ''
    });

    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch teams from the backend
    useEffect(() => {
        const fetchTeams = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            try {
                const response = await axios.get("http://localhost:3000/teams", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTeams(response.data);
            } catch (err: any) {
                setError("Error fetching teams: " + (err.response?.data?.error || err.message));
            }
        };

        fetchTeams();
    }, []);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        // When home team is selected, auto-populate arena and city
        if (name === "home_team" && value) {
            const selectedHomeTeam = teams.find(team => team._id === value);
            if (selectedHomeTeam) {
                setFormData(prevState => ({
                    ...prevState,
                    arena: selectedHomeTeam.stadium,
                    city: selectedHomeTeam.city
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");

            const response = await axios.post(
                "http://localhost:3000/schedules",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess("Schedule created successfully!");
            setError(null);
            console.log(response.data); // Ensure the schedule is returned correctly
        } catch (err: any) {
            setError("Error creating schedule: " + (err.response?.data?.error || err.message));
            setSuccess(null);
        }
    };

    return (
        <div>
            <h2>Create Schedule</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Home Team</label>
                    <select name="home_team" value={formData.home_team} onChange={handleChange}>
                        <option value="">Select Home Team</option>
                        {teams.map(team => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Away Team</label>
                    <select name="away_team" value={formData.away_team} onChange={handleChange}>
                        <option value="">Select Away Team</option>
                        {teams.map(team => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Arena</label>
                    <input
                        type="text"
                        name="arena"
                        value={formData.arena}
                        readOnly
                    />
                </div>

                <div>
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        readOnly
                    />
                </div>

                <button type="submit">Create Schedule</button>
            </form>
        </div>
    );
};

export default CreateSchedule;
