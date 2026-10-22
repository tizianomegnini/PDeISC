import React,{useState} from 'react';
import {Page,Heading,Field,Button,ErrorText} from '../components/UI';
import {api} from '../services/api';

export default function CreateUserScreen({navigation}) {
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[role,setRole]=useState('tecnico'),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{setError('');setBusy(true);try{await api('/users',{method:'POST',body:{name,email,password,role}});navigation.goBack();}catch(e){setError(e.message);}finally{setBusy(false);}};
 return <Page><Heading title="Crear usuario" subtitle="Solo administración puede crear cuentas y asignar roles."/>
 <Field label="Nombre" value={name} onChangeText={setName}/><Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address"/><Field label="Contraseña (mínimo 8 caracteres)" value={password} onChangeText={setPassword} secureTextEntry/>
 <Field label="Rol: admin, tecnico o cliente" value={role} onChangeText={setRole}/>
 <ErrorText>{error}</ErrorText><Button title={busy?'Creando…':'Crear usuario'} onPress={submit} disabled={busy||!name||!email||password.length<8||!['admin','tecnico','cliente'].includes(role)}/></Page>;
}
