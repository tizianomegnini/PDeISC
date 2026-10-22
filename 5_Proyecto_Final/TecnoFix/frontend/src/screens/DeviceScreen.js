import React,{useState} from 'react';
import {Page,Heading,Field,Button,ErrorText} from '../components/UI';
import {api} from '../services/api';

export default function DeviceScreen({navigation}) {
 const [type,setType]=useState('PC'),[brand,setBrand]=useState(''),[model,setModel]=useState(''),[serial,setSerial]=useState(''),[notes,setNotes]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{setError('');setBusy(true);try{await api('/devices',{method:'POST',body:{type,brand,model,serial_number:serial,notes}});navigation.goBack();}catch(e){setError(e.message);}finally{setBusy(false);}};
 return <Page><Heading title="Registrar dispositivo" subtitle="Cargá los datos del equipo que querés ingresar al servicio técnico."/>
 <Field label="Tipo" value={type} onChangeText={setType} placeholder="PC, notebook, consola…"/><Field label="Marca" value={brand} onChangeText={setBrand}/><Field label="Modelo" value={model} onChangeText={setModel}/><Field label="Número de serie (opcional)" value={serial} onChangeText={setSerial}/><Field label="Notas (opcional)" value={notes} onChangeText={setNotes} multiline/>
 <ErrorText>{error}</ErrorText><Button title={busy?'Guardando…':'Guardar dispositivo'} onPress={submit} disabled={busy||!brand||!model}/></Page>;
}
