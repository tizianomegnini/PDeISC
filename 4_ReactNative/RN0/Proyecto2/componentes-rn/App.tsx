import React, { useState, ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ---------- Componente reutilizable para cada tarjeta ----------
type SectionProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

const Section = ({ title, description, children }: SectionProps) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{description}</Text>
    {children ? <View style={styles.demo}>{children}</View> : null}
  </View>
);

const LOGO = 'https://reactnative.dev/img/tiny_logo.png';
const FRUTAS = ['🍎 Manzana', '🍌 Banana', '🍇 Uva', '🍓 Frutilla', '🍊 Naranja'];

// Componentes que solo describimos (no hace falta demo)
const OTROS = [
  { name: 'SectionList', desc: 'Lista virtualizada agrupada por secciones con encabezados (ej: contactos por letra).' },
  { name: 'SafeAreaView', desc: 'Respeta las zonas seguras (notch, barra de estado). Se recomienda react-native-safe-area-context.' },
  { name: 'VirtualizedList', desc: 'Base de FlatList y SectionList. Sirve para estructuras de datos personalizadas.' },
  { name: 'TouchableHighlight', desc: 'Como TouchableOpacity pero oscurece el fondo al presionar.' },
  { name: 'Alert (API)', desc: 'No es visual: lanza diálogos nativos del sistema.' },
];

export default function App() {
  const [texto, setTexto] = useState('');
  const [switchOn, setSwitchOn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contador, setContador] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Componentes de React Native</Text>
          <Text style={styles.headerSub}>
            Deslizá hacia abajo para probar RefreshControl 👇
          </Text>
        </View>

        <Section
          title="View"
          description="El contenedor básico, equivalente a un <div>. Sirve para agrupar y maquetar con flexbox."
        >
          <View style={styles.row}>
            <View style={[styles.box, { backgroundColor: '#F87171' }]} />
            <View style={[styles.box, { backgroundColor: '#FBBF24' }]} />
            <View style={[styles.box, { backgroundColor: '#34D399' }]} />
          </View>
        </Section>

        <Section
          title="Text"
          description="Único componente que puede mostrar texto. Todo texto debe ir dentro de un <Text>."
        >
          <Text style={{ fontSize: 18 }}>
            Texto <Text style={{ fontWeight: 'bold' }}>en negrita</Text> y{' '}
            <Text style={{ color: '#4F46E5' }}>de color</Text>.
          </Text>
        </Section>

        <Section
          title="Image"
          description="Muestra imágenes locales (require) o remotas (uri)."
        >
          <Image source={{ uri: LOGO }} style={styles.logo} />
        </Section>

        <Section
          title="ImageBackground"
          description="Como Image, pero permite poner contenido encima (ideal para fondos)."
        >
          <ImageBackground
            source={{ uri: 'https://picsum.photos/400/200' }}
            style={styles.imageBg}
            imageStyle={{ borderRadius: 12 }}
          >
            <Text style={styles.imageBgText}>Texto sobre la imagen</Text>
          </ImageBackground>
        </Section>

        <Section
          title="TextInput"
          description="Campo para que el usuario escriba. Soporta teclados, placeholder, contraseñas, etc."
        >
          <TextInput
            style={styles.input}
            placeholder="Escribí algo..."
            value={texto}
            onChangeText={setTexto}
          />
          <Text style={styles.muted}>Escribiste: {texto || '—'}</Text>
        </Section>

        <Section
          title="Button"
          description="Botón nativo simple. Poco personalizable: su aspecto depende de la plataforma."
        >
          <Button title="Botón nativo" onPress={() => Alert.alert('¡Hola!', 'Tocaste el Button')} />
        </Section>

        <Section
          title="TouchableOpacity"
          description="Área táctil personalizable que baja su opacidad al presionar."
        >
          <TouchableOpacity style={styles.customBtn} onPress={() => setContador(contador + 1)}>
            <Text style={styles.customBtnText}>Tocado {contador} veces</Text>
          </TouchableOpacity>
        </Section>

        <Section
          title="Pressable"
          description="El reemplazo moderno de los Touchable*. Da control total sobre estados (presionado, long press, etc.)."
        >
          <Pressable
            onPress={() => Alert.alert('Pressable', 'Press normal')}
            onLongPress={() => Alert.alert('Pressable', 'Press largo')}
            style={({ pressed }) => [
              styles.customBtn,
              { backgroundColor: pressed ? '#3730A3' : '#4F46E5' },
            ]}
          >
            <Text style={styles.customBtnText}>Presioná (o mantené)</Text>
          </Pressable>
        </Section>

        <Section
          title="Switch"
          description="Interruptor de encendido/apagado (booleano)."
        >
          <View style={styles.row}>
            <Switch value={switchOn} onValueChange={setSwitchOn} />
            <Text style={styles.muted}>  {switchOn ? 'Activado' : 'Desactivado'}</Text>
          </View>
        </Section>

        <Section
          title="ActivityIndicator"
          description="Spinner de carga. Se usa mientras se esperan datos."
        >
          <ActivityIndicator size="large" color="#4F46E5" />
        </Section>

        <Section
          title="FlatList"
          description="Lista performante que renderiza solo lo visible. Ideal para listas largas."
        >
          <FlatList
            horizontal
            data={FRUTAS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.chip}>
                <Text>{item}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </Section>

        <Section
          title="ScrollView"
          description="Contenedor con scroll. Toda esta pantalla es un ScrollView. Renderiza todo de una vez, así que no es para listas largas."
        >
          <ScrollView horizontal style={{ maxHeight: 60 }} showsHorizontalScrollIndicator={false}>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={[styles.box, { backgroundColor: `hsl(${i * 45}, 70%, 60%)`, marginRight: 8 }]} />
            ))}
          </ScrollView>
        </Section>

        <Section
          title="Modal"
          description="Ventana que se muestra por encima del resto de la pantalla."
        >
          <Button title="Abrir Modal" onPress={() => setModalVisible(true)} />
        </Section>

        <Section
          title="RefreshControl / StatusBar / KeyboardAvoidingView"
          description="RefreshControl: pull-to-refresh (probalo arriba). StatusBar: controla la barra superior del sistema. KeyboardAvoidingView: evita que el teclado tape los inputs."
        />

        {/* Otros componentes, solo descripción */}
        <Text style={styles.subheading}>Otros componentes</Text>
        {OTROS.map((o) => (
          <Section key={o.name} title={o.name} description={o.desc} />
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.cardTitle}>¡Soy un Modal!</Text>
            <Text style={styles.cardDesc}>Se dibuja encima de todo lo demás.</Text>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: { paddingBottom: 40 },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 16,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  headerSub: { color: '#C7D2FE', marginTop: 6 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  cardDesc: { fontSize: 14, color: '#6B7280', marginTop: 4, lineHeight: 20 },
  demo: { marginTop: 12 },
  subheading: { fontSize: 20, fontWeight: '700', margin: 16, color: '#111827' },
  row: { flexDirection: 'row', alignItems: 'center' },
  box: { width: 50, height: 50, borderRadius: 10, marginRight: 8 },
  logo: { width: 60, height: 60 },
  imageBg: { height: 120, justifyContent: 'center', alignItems: 'center' },
  imageBgText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  muted: { color: '#6B7280', marginTop: 6 },
  customBtn: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  customBtnText: { color: '#fff', fontWeight: '600' },
  chip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 12 },
});