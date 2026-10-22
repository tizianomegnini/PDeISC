import React,{useState} from 'react';
import {Text,TouchableOpacity,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {Page,Heading,Field,Button,ErrorText} from '../components/UI';
import {theme} from '../theme';

export default function LoginScreen({navigation}) {
 const {login}=useAuth();
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{setError('');setBusy(true);try{await login(email.trim(),password);}catch(e){setError(e.message);}finally{setBusy(false);}};
 return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={{flexGrow:1}}><Page>
  <Text style={{fontSize:14,fontWeight:'900',color:theme.primary,marginTop:30,marginBottom:16}}>TECNOfix · SERVICIO TÉCNICO</Text>
  <Heading title="Todo bajo control." subtitle="Gestioná reparaciones, dispositivos y seguimiento desde un solo lugar."/>
  <Field label="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="tu@email.com"/>
  <Field label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholder="Tu contraseña"/>
  <ErrorText>{error}</ErrorText>
  <Button title={busy?'Ingresando…':'Iniciar sesión'} onPress={submit} disabled={busy||!email||!password}/>
  <TouchableOpacity onPress={()=>navigation.navigate('Registro')} style={{padding:16,alignItems:'center'}}><Text style={{color:theme.primary,fontWeight:'700'}}>¿No tenés cuenta? Crear cuenta</Text></TouchableOpacity>
  <Text style={{color:theme.muted,fontSize:12,lineHeight:18,marginTop:10}}>Acceso de demostración: admin@tecnofix.local / tecnico@tecnofix.local / cliente@tecnofix.local. Contraseña inicial indicada en el README; cambiá esas credenciales antes de cualquier uso real.</Text>
 </Page></ScrollView></KeyboardAvoidingView>;
}
