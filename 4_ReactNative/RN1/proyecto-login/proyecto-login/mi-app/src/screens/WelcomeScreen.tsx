import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../types';

// Datos recibidos por Props desde App.tsx
interface WelcomeScreenProps {
  user: User;
  onLogout: () => void;
}

export default function WelcomeScreen({ user, onLogout }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👋</Text>
      <Text style={styles.title}>¡Bienvenido, {user.nombre}!</Text>
      <Text style={styles.text}>ID de usuario: {user.id}</Text>
      <Text style={styles.text}>Correo: {user.email}</Text>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '700', color: '#064e3b', marginBottom: 12, textAlign: 'center' },
  text: { fontSize: 16, color: '#374151', marginBottom: 4 },
  button: { marginTop: 28, backgroundColor: '#059669', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 28 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
