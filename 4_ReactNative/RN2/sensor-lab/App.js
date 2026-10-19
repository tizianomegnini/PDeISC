import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, ScrollView,
  SafeAreaView, StatusBar, Platform, Alert, Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as LocalAuthentication from 'expo-local-authentication';

const C = {
  bg: '#EEF1F6', ink: '#14213D', mute: '#5B6B88', card: '#FFFFFF',
  accent: '#2F6FED', ok: '#1E9E6A', bad: '#D64545', line: '#D5DBE7',
};

const TABS = [
  { id: 'camera', label: 'Cámara' },
  { id: 'scan', label: 'Escáner' },
  { id: 'gps', label: 'GPS' },
  { id: 'motion', label: 'Movimiento' },
  { id: 'bio', label: 'Biometría' },
];

/* ---------- Componentes base ---------- */
const Btn = ({ title, onPress, kind = 'primary', style }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[s.btn, kind === 'ghost' && s.btnGhost, style]}
  >
    <Text style={[s.btnText, kind === 'ghost' && { color: C.accent }]}>{title}</Text>
  </TouchableOpacity>
);

const PermissionGate = ({ permission, request, children, what }) => {
  if (!permission) return <Text style={s.mute}>Comprobando permisos…</Text>;
  if (!permission.granted) {
    return (
      <View style={s.card}>
        <Text style={s.h2}>Necesitamos acceso a {what}</Text>
        <Text style={s.mute}>Sin este permiso no podemos mostrar esta función.</Text>
        <Btn title="Dar permiso" onPress={request} style={{ marginTop: 12 }} />
        {!permission.canAskAgain && (
          <Btn title="Abrir ajustes" kind="ghost" onPress={() => Linking.openSettings()} style={{ marginTop: 8 }} />
        )}
      </View>
    );
  }
  return children;
};

/* ---------- Cámara ---------- */
function CameraScreen() {
  const [perm, request] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [photo, setPhoto] = useState(null);
  const ref = useRef(null);

  const take = async () => {
    try {
      const p = await ref.current?.takePictureAsync({ quality: 0.6 });
      if (p?.uri) setPhoto(p.uri);
    } catch (e) {
      Alert.alert('No se pudo tomar la foto', String(e.message || e));
    }
  };

  return (
    <PermissionGate permission={perm} request={request} what="la cámara">
      <View style={s.cameraBox}>
        <CameraView ref={ref} style={StyleSheet.absoluteFill} facing={facing} />
      </View>
      <View style={s.row}>
        <Btn title="Tomar foto" onPress={take} style={{ flex: 1 }} />
        <Btn title="Girar" kind="ghost" onPress={() => setFacing(f => (f === 'back' ? 'front' : 'back'))} style={{ flex: 1 }} />
      </View>
      {photo && (
        <View style={s.card}>
          <Text style={s.h2}>Última foto</Text>
          <Image source={{ uri: photo }} style={s.preview} />
        </View>
      )}
    </PermissionGate>
  );
}

/* ---------- Lector de códigos ---------- */
function ScanScreen() {
  const [perm, request] = useCameraPermissions();
  const [result, setResult] = useState(null);
  const locked = useRef(false);

  const onScan = ({ type, data }) => {
    if (locked.current) return;
    locked.current = true;
    setResult({ type, data });
  };
  const reset = () => { locked.current = false; setResult(null); };

  return (
    <PermissionGate permission={perm} request={request} what="la cámara">
      <View style={s.cameraBox}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={onScan}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'pdf417'],
          }}
        />
        <View style={s.frame} pointerEvents="none" />
      </View>
      <View style={s.card}>
        {result ? (
          <>
            <Text style={s.h2}>Código leído</Text>
            <Text style={s.mute}>Tipo: {String(result.type)}</Text>
            <Text selectable style={s.value}>{result.data}</Text>
            <View style={s.row}>
              {/^https?:\/\//i.test(result.data) && (
                <Btn title="Abrir enlace" onPress={() => Linking.openURL(result.data)} style={{ flex: 1 }} />
              )}
              <Btn title="Escanear otro" kind="ghost" onPress={reset} style={{ flex: 1 }} />
            </View>
          </>
        ) : (
          <Text style={s.mute}>Apuntá la cámara a un QR o código de barras.</Text>
        )}
      </View>
    </PermissionGate>
  );
}

/* ---------- Ubicación ---------- */
function GpsScreen() {
  const [pos, setPos] = useState(null);
  const [err, setErr] = useState(null);
  const [watching, setWatching] = useState(false);
  const sub = useRef(null);

  const ensure = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setErr('Permiso de ubicación denegado.'); return false; }
    setErr(null); return true;
  };

  const once = async () => {
    if (!(await ensure())) return;
    try {
      const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setPos(p);
    } catch (e) { setErr('No se pudo obtener la ubicación. ¿Está el GPS activado?'); }
  };

  const toggle = async () => {
    if (watching) { sub.current?.remove(); sub.current = null; setWatching(false); return; }
    if (!(await ensure())) return;
    sub.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 2, timeInterval: 1000 },
      setPos
    );
    setWatching(true);
  };

  useEffect(() => () => sub.current?.remove(), []);

  const c = pos?.coords;
  const mapUrl = c ? `https://www.google.com/maps?q=${c.latitude},${c.longitude}` : null;

  return (
    <View>
      <View style={s.row}>
        <Btn title="Ubicación actual" onPress={once} style={{ flex: 1 }} />
        <Btn title={watching ? 'Detener' : 'Seguir'} kind="ghost" onPress={toggle} style={{ flex: 1 }} />
      </View>
      {err && <Text style={[s.mute, { color: C.bad, marginTop: 8 }]}>{err}</Text>}
      <View style={s.card}>
        {c ? (
          <>
            <Row k="Latitud" v={c.latitude.toFixed(6)} />
            <Row k="Longitud" v={c.longitude.toFixed(6)} />
            <Row k="Precisión" v={`${Math.round(c.accuracy ?? 0)} m`} />
            <Row k="Altitud" v={c.altitude != null ? `${Math.round(c.altitude)} m` : '—'} />
            <Row k="Velocidad" v={c.speed != null && c.speed >= 0 ? `${(c.speed * 3.6).toFixed(1)} km/h` : '—'} />
            <Btn title="Ver en Google Maps" kind="ghost" onPress={() => Linking.openURL(mapUrl)} style={{ marginTop: 12 }} />
          </>
        ) : (
          <Text style={s.mute}>Todavía no hay datos de ubicación.</Text>
        )}
      </View>
    </View>
  );
}

/* ---------- Acelerómetro y giroscopio ---------- */
const Axis = ({ label, value, max }) => {
  const pct = Math.min(Math.abs(value) / max, 1) * 50;
  return (
    <View style={s.axis}>
      <Text style={s.axisLabel}>{label}</Text>
      <View style={s.track}>
        <View style={[s.fill, value >= 0 ? { left: '50%', width: `${pct}%` } : { right: '50%', width: `${pct}%` }]} />
        <View style={s.zero} />
      </View>
      <Text style={s.axisVal}>{value.toFixed(2)}</Text>
    </View>
  );
};

function MotionScreen() {
  const [acc, setAcc] = useState({ x: 0, y: 0, z: 0 });
  const [gyr, setGyr] = useState({ x: 0, y: 0, z: 0 });
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    Gyroscope.setUpdateInterval(100);
    const a = Accelerometer.addListener(setAcc);
    const g = Gyroscope.addListener(setGyr);
    Promise.all([Accelerometer.isAvailableAsync(), Gyroscope.isAvailableAsync()])
      .then(([x, y]) => setAvailable(x && y));
    return () => { a.remove(); g.remove(); };
  }, []);

  const mag = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
  const shaking = mag > 2.2;

  return (
    <View>
      {!available && <Text style={[s.mute, { color: C.bad }]}>Este dispositivo no tiene todos los sensores.</Text>}
      <View style={s.card}>
        <Text style={s.h2}>Acelerómetro (g)</Text>
        <Axis label="X" value={acc.x} max={2} />
        <Axis label="Y" value={acc.y} max={2} />
        <Axis label="Z" value={acc.z} max={2} />
        <Text style={[s.value, shaking && { color: C.bad }]}>
          {shaking ? '¡Sacudida detectada!' : `Magnitud ${mag.toFixed(2)} g`}
        </Text>
      </View>
      <View style={s.card}>
        <Text style={s.h2}>Giroscopio (rad/s)</Text>
        <Axis label="X" value={gyr.x} max={4} />
        <Axis label="Y" value={gyr.y} max={4} />
        <Axis label="Z" value={gyr.z} max={4} />
      </View>
    </View>
  );
}

/* ---------- Biometría ---------- */
function BioScreen() {
  const [info, setInfo] = useState({ hw: null, enrolled: null, types: [] });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    (async () => {
      const hw = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const t = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const names = { 1: 'Huella', 2: 'Rostro', 3: 'Iris' };
      setInfo({ hw, enrolled, types: t.map(x => names[x] || 'Otro') });
    })();
  }, []);

  const auth = async () => {
    const r = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirmá tu identidad',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar PIN',
    });
    setStatus(r.success ? 'ok' : `error: ${r.error || 'cancelado'}`);
  };

  return (
    <View>
      <View style={s.card}>
        <Row k="Hardware" v={info.hw == null ? '…' : info.hw ? 'Disponible' : 'No disponible'} />
        <Row k="Registrada" v={info.enrolled == null ? '…' : info.enrolled ? 'Sí' : 'No'} />
        <Row k="Tipos" v={info.types.join(', ') || '—'} />
      </View>
      <Btn title="Autenticar" onPress={auth} />
      {status && (
        <View style={[s.card, { borderColor: status === 'ok' ? C.ok : C.bad, borderWidth: 2 }]}>
          <Text style={[s.h2, { color: status === 'ok' ? C.ok : C.bad }]}>
            {status === 'ok' ? 'Acceso concedido' : 'Acceso denegado'}
          </Text>
          {status !== 'ok' && <Text style={s.mute}>{status}</Text>}
        </View>
      )}
    </View>
  );
}

const Row = ({ k, v }) => (
  <View style={s.kv}>
    <Text style={s.mute}>{k}</Text>
    <Text style={s.value}>{v}</Text>
  </View>
);

/* ---------- App ---------- */
export default function App() {
  const [tab, setTab] = useState('camera');
  const Screen = { camera: CameraScreen, scan: ScanScreen, gps: GpsScreen, motion: MotionScreen, bio: BioScreen }[tab];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={s.header}>
        <Text style={s.title}>Sensor Lab</Text>
        <Text style={s.mute}>Las herramientas del teléfono, una por una</Text>
      </View>
      <View style={s.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={[s.tab, tab === t.id && s.tabOn]}>
            <Text style={[s.tabText, tab === t.id && { color: '#fff' }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={s.body}>
        <Screen key={tab} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: C.ink },
  tabs: { flexDirection: 'row', paddingHorizontal: 12, gap: 6, paddingBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  tabOn: { backgroundColor: C.ink, borderColor: C.ink },
  tabText: { fontSize: 12, fontWeight: '600', color: C.ink },
  body: { padding: 16, paddingBottom: 40, gap: 12 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginTop: 12, borderWidth: 1, borderColor: C.line },
  h2: { fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 6 },
  mute: { color: C.mute, fontSize: 14 },
  value: { color: C.ink, fontSize: 15, fontWeight: '600', marginTop: 4 },
  kv: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { backgroundColor: C.accent, paddingVertical: 13, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: C.accent },
  btnGhost: { backgroundColor: 'transparent' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cameraBox: { height: 340, borderRadius: 14, overflow: 'hidden', backgroundColor: '#000' },
  frame: { position: 'absolute', top: '25%', left: '15%', right: '15%', bottom: '25%', borderWidth: 3, borderColor: '#fff', borderRadius: 12 },
  preview: { width: '100%', height: 220, borderRadius: 10, marginTop: 6 },
  axis: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  axisLabel: { width: 18, color: C.mute, fontWeight: '700' },
  axisVal: { width: 56, textAlign: 'right', color: C.ink, fontVariant: ['tabular-nums'] },
  track: { flex: 1, height: 10, backgroundColor: C.bg, borderRadius: 5, overflow: 'hidden', marginHorizontal: 8 },
  fill: { position: 'absolute', top: 0, bottom: 0, backgroundColor: C.accent },
  zero: { position: 'absolute', left: '50%', width: 1, top: 0, bottom: 0, backgroundColor: C.mute },
});