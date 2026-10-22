import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL=(process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/,'');
const TOKEN_KEY='tecnofix.accessToken';
const REFRESH_KEY='tecnofix.refreshToken';

export async function saveSession(session) {
  await AsyncStorage.setItem(TOKEN_KEY,session.accessToken);
  if(session.refreshToken) await AsyncStorage.setItem(REFRESH_KEY,session.refreshToken);
  await AsyncStorage.setItem('tecnofix.user',JSON.stringify(session.user));
}
export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY,REFRESH_KEY,'tecnofix.user']);
}
export async function storedSession() {
  const [accessToken,refreshToken,user]=await AsyncStorage.multiGet([TOKEN_KEY,REFRESH_KEY,'tecnofix.user']);
  return {accessToken:accessToken[1],refreshToken:refreshToken[1],user:user[1]?JSON.parse(user[1]):null};
}
export async function api(path, options={}) {
  if(!BASE_URL) throw new Error('Configurá EXPO_PUBLIC_API_URL con la dirección de tu API.');
  const token=await AsyncStorage.getItem(TOKEN_KEY);
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),10000);
  let response;
  try {
    response=await fetch(`${BASE_URL}${path}`,{
      ...options,
      signal:controller.signal,
      headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...(options.headers||{})},
      body: options.body && typeof options.body!=='string' ? JSON.stringify(options.body):options.body
    });
  } catch(e) {
    if(e.name==='AbortError') throw new Error('La API tardó más de 10 segundos. Comprobá que el backend esté iniciado y que el celular y la PC estén en la misma Wi-Fi.');
    throw new Error(`No se pudo conectar con la API (${BASE_URL}). Revisá que el backend esté iniciado, la IP de frontend/.env y el firewall.`);
  } finally {
    clearTimeout(timeout);
  }
  const data=await response.json().catch(()=>({error:'La API devolvió una respuesta inválida.'}));
  if(!response.ok) throw new Error(data.error || `Error HTTP ${response.status}`);
  return data;
}
export { BASE_URL };
