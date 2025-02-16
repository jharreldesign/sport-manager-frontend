import React, { useState } from 'react';
import axios from 'axios';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>(''); // Using username instead of firstName, lastName
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send username and password to the backend
      const response = await axios.post('http://localhost:3000/auth/sign-up', {
        username,
        password,
      });

      console.log(response.data); // Handle the response (e.g., show success message)
      setLoading(false);
      // Redirect to login page or set a success message
    } catch (err) {
      setError('Sign-up failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
