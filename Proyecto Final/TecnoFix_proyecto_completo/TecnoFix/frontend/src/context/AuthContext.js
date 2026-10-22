import React,{createContext,useContext,useEffect,useState} from 'react';
import {api,saveSession,clearSession,storedSession} from '../services/api';

const AuthContext=createContext(null);
export function AuthProvider({children}) {
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{
    try {
      const s=await storedSession();
      if(s.accessToken && s.user) {
        try { const data=await api('/users/me'); setUser({...s.user,...data.user}); }
        catch { if(s.refreshToken) {
          const fresh=await api('/auth/refresh',{method:'POST',body:{refreshToken:s.refreshToken}});
          await saveSession(fresh); setUser(fresh.user);
        } else { await clearSession(); }
        }
      }
    } catch { await clearSession(); }
    finally {setLoading(false);}
  })();},[]);
  const login=async(email,password)=>{
    const data=await api('/auth/login',{method:'POST',body:{email,password}});
    await saveSession(data);setUser(data.user);return data.user;
  };
  const register=async(name,email,password,phone)=>{
    const data=await api('/auth/register',{method:'POST',body:{name,email,password,phone}});
    await saveSession(data);setUser(data.user);return data.user;
  };
  const logout=async()=>{
    const s=await storedSession();
    try {if(s.refreshToken) await api('/auth/logout',{method:'POST',body:{refreshToken:s.refreshToken}});}catch{}
    await clearSession();setUser(null);
  };
  return <AuthContext.Provider value={{user,loading,login,register,logout}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
