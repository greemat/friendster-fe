// Entry point for the React Native app; initializes the app root.

import React from 'react';

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default Providers;
