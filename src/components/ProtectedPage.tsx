// src/components/ProtectedPage.tsx
import React from 'react';

const ProtectedPage: React.FC = () => {
  return (
    <div>
      <h2>Welcome to the Protected Page!</h2>
      <p>This page is only accessible if you're logged in.</p>
    </div>
  );
};

export default ProtectedPage;
