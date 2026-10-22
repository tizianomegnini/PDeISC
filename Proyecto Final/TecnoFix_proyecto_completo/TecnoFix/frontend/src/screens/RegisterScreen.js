import React,{useState} from 'react';
import {ScrollView} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {Page,Heading,Field,Button,ErrorText} from '../components/UI';

export default function RegisterScreen() {
 const {register}=useAuth();
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[phone,setPhone]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{setError('');if(password!==confirm)return setError('Las contraseñas no coinciden.');if(password.length<8)return setError('La contraseña debe tener al menos 8 caracteres.');setBusy(true);try{await register(name.trim(),email.trim(),password,phone.trim());}catch(e){setError(e.message);}finally{setBusy(false);}};
 return <ScrollView><Page><Heading title="Crear cuenta" subtitle="Registrate como cliente para cargar tus equipos y solicitar reparaciones."/>
  <Field label="Nombre completo" value={name} onChangeText={setName}/>
  <Field label="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address"/>
  <Field label="Teléfono (opcional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad"/>
  <Field label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry/>
  <Field label="Confirmar contraseña" value={confirm} onChangeText={setConfirm} secureTextEntry/>
  <ErrorText>{error}</ErrorText><Button title={busy?'Creando cuenta…':'Registrarme'} onPress={submit} disabled={busy||!name||!email||!password||!confirm}/>
 </Page></ScrollView>;
}
