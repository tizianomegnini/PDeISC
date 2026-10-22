import React,{useCallback,useState} from 'react';
import {Text,View,ScrollView,RefreshControl,TouchableOpacity,Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {api} from '../services/api';
import {Page,Heading,Button,Loading} from '../components/UI';
import {theme} from '../theme';

function statusColor(status){if(['Entregada','Lista para entregar'].includes(status))return theme.success;if(status==='Cancelada')return theme.danger;if(['En reparación','En diagnóstico','Esperando repuestos'].includes(status))return theme.warning;return theme.primary;}
export default function HomeScreen({navigation}) {
 const {user,logout}=useAuth();
 const [repairs,setRepairs]=useState([]),[devices,setDevices]=useState([]),[loading,setLoading]=useState(true),[refreshing,setRefreshing]=useState(false),[error,setError]=useState('');
 const load=useCallback(async()=>{try{setError('');const r=await api('/repairs');setRepairs(r.repairs||[]);if(user?.role==='cliente'){const d=await api('/devices');setDevices(d.devices||[]);}else{setDevices([]);}}catch(e){setError(e.message);}finally{setLoading(false);setRefreshing(false);}},[user?.role]);
 useFocusEffect(useCallback(()=>{load();},[load]));
 const askLogout=()=>Alert.alert('Cerrar sesión','¿Querés salir de TecnoFix?',[{text:'Cancelar',style:'cancel'},{text:'Salir',style:'destructive',onPress:logout}]);
 return <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}}/>}><Page>
  <Text style={{fontSize:13,color:theme.primary,fontWeight:'900',marginBottom:8}}>TECNOfix</Text>
  <Heading title={`Hola, ${user?.name?.split(' ')[0]||'bienvenido'}`} subtitle={`Sesión iniciada como ${user?.role||'usuario'}.`}/>
  {user?.role==='cliente'&&<><Button title="+ Registrar dispositivo" onPress={()=>navigation.navigate('Dispositivo')}/><Button title="+ Solicitar reparación" onPress={()=>navigation.navigate('Nueva reparación')}/></>}
  {(user?.role==='admin'||user?.role==='tecnico')&&<Button title="Actualizar órdenes" onPress={load} secondary/>}
  {user?.role==='admin'&&<Button title="Crear usuario / técnico" onPress={()=>navigation.navigate('Crear usuario')} secondary/>}
  <View style={{marginTop:24,marginBottom:8}}><Text style={{fontSize:19,fontWeight:'800',color:theme.ink}}>Órdenes de reparación</Text></View>
  {loading?<Loading/>:repairs.length===0?<Text style={{color:theme.muted,marginVertical:12}}>Todavía no hay órdenes para mostrar.</Text>:repairs.map(item=><TouchableOpacity key={item.id} onPress={()=>navigation.navigate('Detalle reparación',{repair:item,onRefresh:load})} style={{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:theme.border,borderRadius:14,padding:15,marginBottom:12}}>
   <View style={{flexDirection:'row',justifyContent:'space-between',gap:8}}><Text style={{fontSize:15,fontWeight:'800',color:theme.ink,flex:1}}>Orden #{item.id} · {item.brand} {item.model}</Text><Text style={{fontSize:11,fontWeight:'800',color:statusColor(item.status)}}>{item.status}</Text></View>
   <Text style={{color:theme.muted,marginTop:6}} numberOfLines={2}>{item.problem}</Text>
   {user?.role!=='cliente'&&<Text style={{color:theme.muted,marginTop:5,fontSize:12}}>Cliente: {item.client_name} · Técnico: {item.technician_name||'Sin asignar'}</Text>}
  </TouchableOpacity>)}
  {user?.role==='cliente'&&<><View style={{marginTop:14,marginBottom:8}}><Text style={{fontSize:19,fontWeight:'800',color:theme.ink}}>Mis dispositivos ({devices.length})</Text></View>{devices.map(d=><View key={d.id} style={{backgroundColor:'#fff',borderRadius:12,padding:13,marginBottom:8}}><Text style={{fontWeight:'700',color:theme.ink}}>{d.type} · {d.brand} {d.model}</Text>{d.serial_number?<Text style={{color:theme.muted}}>Serie: {d.serial_number}</Text>:null}</View>)}</>}
  {error?<Text style={{color:theme.danger,marginVertical:8}}>{error}</Text>:null}
  <Button title="Cerrar sesión" onPress={askLogout} secondary/>
 </Page></ScrollView>;
}
