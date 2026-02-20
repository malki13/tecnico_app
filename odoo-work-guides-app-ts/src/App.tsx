/**
 * App
 * Punto de entrada de la aplicación
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './navigation';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
};

export default App;
