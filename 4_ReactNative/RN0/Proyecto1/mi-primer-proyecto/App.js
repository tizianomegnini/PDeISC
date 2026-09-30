import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();

// Tab 1: pantalla limpia con Hola Mundo
function HomeScreen() {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeText}>¡Hola Mundo!</Text>
    </View>
  );
}

// Tab 2: mismos elementos, pero con estilos diferentes
function StylesScreen() {
  return (
    <View style={styles.otherContainer}>
      <View style={styles.card}>
        <Text style={styles.otherTitle}>Otro tab</Text>
        <Text style={styles.otherSubtitle}>
          Con colores, tarjeta y tipografía distintos
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#6C5CE7',
          tabBarLabelStyle: { fontSize: 14 },
        }}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Estilos" component={StylesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Estilos tab 1
  homeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: {
    fontSize: 24,
    color: '#222',
  },

  // Estilos tab 2
  otherContainer: {
    flex: 1,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  otherTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#6C5CE7',
    marginBottom: 10,
  },
  otherSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});