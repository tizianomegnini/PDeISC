import React,{useEffect,useState} from 'react';
import {Text,TouchableOpacity} from 'react-native';
import {Page,Heading,Field,Button,ErrorText,Loading} from '../components/UI';
import {api} from '../services/api';
import {theme} from '../theme';

export default function NewRepairScreen({navigation}) {
 const [devices,setDevices]=useState([]),[deviceId,setDeviceId]=useState(null),[problem,setProblem]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false);
 useEffect(()=>{api('/devices').then(d=>{setDevices(d.devices||[]);if(d.devices?.length)setDeviceId(d.devices[0].id);}).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
 const submit=async()=>{setError('');setBusy(true);try{await api('/repairs',{method:'POST',body:{device_id:deviceId,problem}});navigation.goBack();}catch(e){setError(e.message);}finally{setBusy(false);}};
 return <Page><Heading title="Solicitar reparación" subtitle="Elegí un equipo y explicá qué problema presenta."/>
 {loading?<Loading/>:devices.length===0?<Text style={{color:theme.muted}}>Primero tenés que registrar un dispositivo.</Text>:devices.map(d=><TouchableOpacity key={d.id} onPress={()=>setDeviceId(d.id)} style={{padding:13,backgroundColor:deviceId===d.id?'#E4EDFF':'#FFFFFF',borderWidth:1,borderColor:deviceId===d.id?theme.primary:theme.border,borderRadius:12,marginBottom:8}}><Text style={{color:theme.ink,fontWeight:'700'}}>{deviceId===d.id?'● ':'○ '}{d.brand} {d.model} ({d.type})</Text></TouchableOpacity>)}
 <Field label="Descripción del problema" value={problem} onChangeText={setProblem} multiline placeholder="Ej.: se apaga al iniciar, no da imagen…"/>
 <ErrorText>{error}</ErrorText><Button title={busy?'Enviando…':'Enviar solicitud'} onPress={submit} disabled={busy||!deviceId||!problem.trim()}/></Page>;
}
