import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // For navigation after successful login

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send a request to the backend for login
      const response = await axios.post('http://localhost:3000/auth/sign-in', {
        username,
        password,
      });

      // Check if token exists in the response
      console.log('Token received:', response.data.token);

      if (response.data.token) {
        // Store the received token in localStorage
        localStorage.setItem('authToken', response.data.token);
        console.log('Token saved in localStorage');

        // Redirect to home page (or PlayerList page)
        navigate('/');
      } else {
        setError('Login failed. No token received.');
      }
    } catch (err) {
      setError('Login failed. Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
