import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { User } from './src/types';

export default function App() {
  // Si user es null -> mostramos Login. Si tiene datos -> mostramos Bienvenida.
  const [user, setUser] = useState<User | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {user ? (
        // Paso de datos por PROPS a la página de bienvenida
        <WelcomeScreen user={user} onLogout={() => setUser(null)} />
      ) : (
        <LoginScreen onLoginSuccess={setUser} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1 } });
