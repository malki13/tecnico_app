// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { AuthProvider } from './src/context/AuthContext';
// import Navigation from './src/navigation';

// const App: React.FC = () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <AuthProvider>
//           <Navigation />
//           <StatusBar style="auto" />
//         </AuthProvider>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// };

// export default App;


/**
 * App
 * Punto de entrada de la aplicación
 */

import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
};

export default App;
