import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlayerFormState, Team } from "../types";

const positions = [
  "Pitcher",
  "Catcher",
  "First Base",
  "Second Base",
  "Shortstop",
  "Third Base",
  "Left Field",
  "Center Field",
  "Right Field",
  "Designated Hitter",
  "Goalkeeper",
  "Forward",
  "Defender",
  "Midfielder",
];

const CreatePlayer = () => {
  const [formData, setFormData] = useState<PlayerFormState>({
    player_number: 0,
    first_name: "",
    last_name: "",
    hometown: "",
    position: "",
    team: "",
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        "http://localhost:3000/players",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Player created successfully!");
      setError(null);
      console.log(response.data); // Ensure the team field is returned correctly
    } catch (err: any) {
      setError("Error creating player: " + (err.response?.data?.error || err.message));
      setSuccess(null);
    }
  };

  return (
    <div>
      <h2>Create a New Player</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="player_number">Player Number:</label>
          <input
            type="number"
            id="player_number"
            name="player_number"
            value={formData.player_number}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="hometown">Hometown:</label>
          <input
            type="text"
            id="hometown"
            name="hometown"
            value={formData.hometown}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="position">Position:</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="">Select a Position</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="team">Team:</label>
          <select
            id="team"
            name="team"
            value={formData.team}
            onChange={handleChange}
            required
          >
            <option value="">Select a Team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Create Player</button>
      </form>
    </div>
  );
};

export default CreatePlayer;
