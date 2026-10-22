import React,{useEffect,useState} from 'react';
import {ScrollView,Text,View} from 'react-native';
import {Page,Heading,Field,Button,ErrorText,Loading} from '../components/UI';
import {api} from '../services/api';
import {useAuth} from '../context/AuthContext';
import {theme} from '../theme';

const statuses=['Solicitud recibida','Pendiente de diagnóstico','En diagnóstico','Presupuestada','En reparación','Esperando repuestos','Lista para entregar','Entregada','Cancelada'];
export default function RepairDetailScreen({route,navigation}) {
 const {repair}=route.params;const {user}=useAuth();
 const [history,setHistory]=useState([]),[status,setStatus]=useState(repair.status),[diagnosis,setDiagnosis]=useState(repair.diagnosis||''),[budget,setBudget]=useState(repair.budget===null?'':String(repair.budget)),[notes,setNotes]=useState(repair.notes||''),[comment,setComment]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 const load=async()=>{try{const d=await api(`/repairs/${repair.id}/history`);setHistory(d.history||[]);}catch(e){setError(e.message);}finally{setLoading(false);}};
 useEffect(()=>{load();},[]);
 const save=async()=>{setError('');setBusy(true);try{await api(`/repairs/${repair.id}`,{method:'PATCH',body:{status,diagnosis,budget:budget===''?null:Number(budget),notes,comment}});route.params.onRefresh?.();navigation.goBack();}catch(e){setError(e.message);}finally{setBusy(false);}};
 return <ScrollView><Page><Heading title={`Orden #${repair.id}`} subtitle={`${repair.brand} ${repair.model} · ${repair.client_name||'Tu equipo'}`}/>
 <Text style={{color:theme.muted,marginBottom:15}}>Problema reportado: {repair.problem}</Text>
 {repair.technician_name?<Text style={{color:theme.muted,marginBottom:10}}>Técnico asignado: {repair.technician_name}</Text>:null}
 {user.role==='admin'||user.role==='tecnico'?<>
 <Text style={{fontWeight:'800',color:theme.ink,marginBottom:8}}>Estado</Text>
 {statuses.map(s=><Text key={s} onPress={()=>setStatus(s)} style={{padding:10,borderRadius:9,overflow:'hidden',marginBottom:5,backgroundColor:status===s?'#DCE8FF':'#FFFFFF',color:status===s?theme.primary:theme.ink,borderWidth:1,borderColor:status===s?theme.primary:theme.border}}>{status===s?'● ':'○ '}{s}</Text>)}
 <Field label="Diagnóstico" value={diagnosis} onChangeText={setDiagnosis} multiline/>
 <Field label="Presupuesto (opcional)" value={budget} onChangeText={setBudget} keyboardType="decimal-pad"/>
 <Field label="Notas / repuestos" value={notes} onChangeText={setNotes} multiline/>
 <Field label="Comentario para el historial" value={comment} onChangeText={setComment} multiline/>
 <ErrorText>{error}</ErrorText><Button title={busy?'Guardando…':'Guardar cambios'} onPress={save} disabled={busy}/>
 </>:<>
 <Text style={{fontWeight:'800',color:theme.ink,marginBottom:6}}>Estado actual</Text><Text style={{color:theme.primary,marginBottom:12}}>{repair.status}</Text>
 <Text style={{fontWeight:'800',color:theme.ink,marginBottom:6}}>Diagnóstico</Text><Text style={{color:theme.muted,marginBottom:12}}>{repair.diagnosis||'Todavía no cargado.'}</Text>
 <Text style={{fontWeight:'800',color:theme.ink,marginBottom:6}}>Presupuesto</Text><Text style={{color:theme.muted,marginBottom:12}}>{repair.budget===null?'Todavía no informado.':`$ ${repair.budget}`}</Text>
 {repair.notes?<Text style={{color:theme.muted,marginBottom:12}}>Notas: {repair.notes}</Text>:null}
 </>}
 <View style={{marginTop:20}}><Text style={{fontSize:18,fontWeight:'800',color:theme.ink,marginBottom:10}}>Historial</Text>{loading?<Loading/>:history.length===0?<Text style={{color:theme.muted}}>Sin movimientos todavía.</Text>:history.map(h=><View key={h.id} style={{padding:12,backgroundColor:'#fff',borderRadius:10,marginBottom:8}}><Text style={{fontWeight:'700',color:theme.ink}}>{h.new_status}</Text><Text style={{color:theme.muted,fontSize:12}}>{h.actor_name} · {new Date(h.created_at).toLocaleString()}</Text>{h.comment?<Text style={{color:theme.muted,marginTop:4}}>{h.comment}</Text>:null}</View>)}</View>
 </Page></ScrollView>;
}
