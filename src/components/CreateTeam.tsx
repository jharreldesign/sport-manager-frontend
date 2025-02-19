import React, { useState } from "react";
import axios from "axios";
import { TeamFormState } from "../types";  

const CreateTeam = () => {
  const [formData, setFormData] = useState<TeamFormState>({
    name: "",
    city: "",
    stadium: "",
    sport: "Baseball",
    stadium_photo: "", // Add stadium_photo to the initial state
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Make sure the user is logged in or the token is passed somehow
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        "http://localhost:3000/teams",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Team created successfully!");
      setError(null);
      console.log(response.data);
    } catch (err: any) {
      setError("Error creating team: " + err.response?.data?.error || err.message);
      setSuccess(null);
    }
  };

  return (
    <div>
      <h2>Create a New Team</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Team Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="stadium">Stadium:</label>
          <input
            type="text"
            id="stadium"
            name="stadium"
            value={formData.stadium}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="sport">Sport:</label>
          <select
            name="sport"
            id="sport"
            value={formData.sport}
            onChange={handleChange}
            required
          >
            <option value="Baseball">Baseball</option>
            <option value="Basketball">Basketball</option>
            <option value="Hockey">Hockey</option>
            <option value="Football">Football</option>
            <option value="Soccer">Soccer</option>
          </select>
        </div>
        <div>
          <label htmlFor="stadium_photo">Stadium Photo URL:</label>
          <input
            type="text"
            id="stadium_photo"
            name="stadium_photo"
            value={formData.stadium_photo}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
};

export default CreateTeam;