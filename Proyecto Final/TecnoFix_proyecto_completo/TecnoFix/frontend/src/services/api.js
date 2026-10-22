import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL=(process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.50:4000/api').replace(/\/$/,'');
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
  const token=await AsyncStorage.getItem(TOKEN_KEY);
  const response=await fetch(`${BASE_URL}${path}`,{
    ...options,
    headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...(options.headers||{})},
    body: options.body && typeof options.body!=='string' ? JSON.stringify(options.body):options.body
  });
  const data=await response.json().catch(()=>({error:'La API devolvió una respuesta inválida.'}));
  if(!response.ok) throw new Error(data.error || `Error HTTP ${response.status}`);
  return data;
}
export { BASE_URL };
