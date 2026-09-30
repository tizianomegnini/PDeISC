import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Tab 1: pantalla limpia
function HomeScreen() {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeText}>¡Hola Mundo!</Text>
    </View>
  );
}

// Tab 2: mismos componentes, estilos totalmente distintos
function EstilosScreen() {
  return (
    <View style={styles.styledContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Otro estilo 🎨</Text>
        <Text style={styles.cardSubtitle}>
          Fondo oscuro, tarjeta con sombra y bordes redondeados.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>React Native</Text>
        </View>
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#6C63FF',
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        }}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Estilos" component={EstilosScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Tab 1
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: { fontSize: 24, color: '#000' },

  // Tab 2
  styledContainer: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#6C63FF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  cardTitle: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  cardSubtitle: { fontSize: 16, color: '#E0DEFF', lineHeight: 22 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD166',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 18,
  },
  badgeText: { color: '#1E1E2E', fontWeight: '700' },
});