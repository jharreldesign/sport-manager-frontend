// hooks/useAuth.ts
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsAuthenticated(true); // User is authenticated if token exists
    } else {
      setIsAuthenticated(false); // No token, user is not authenticated
    }
  }, []); // Empty dependency array means this effect runs once on mount

  return isAuthenticated;
};

export default useAuth;
