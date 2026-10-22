import React from 'react';
import {NavigationContainer,DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DeviceScreen from '../screens/DeviceScreen';
import NewRepairScreen from '../screens/NewRepairScreen';
import RepairDetailScreen from '../screens/RepairDetailScreen';
import CreateUserScreen from '../screens/CreateUserScreen';
import {Loading} from '../components/UI';
import {theme} from '../theme';

const Stack=createNativeStackNavigator();
export default function AppNavigator(){
 const {user,loading}=useAuth();
 if(loading)return <Loading/>;
 return <NavigationContainer theme={{...DefaultTheme,colors:{...DefaultTheme.colors,background:theme.bg,primary:theme.primary,card:'#FFFFFF',text:theme.ink,border:theme.border}}}>
 <Stack.Navigator screenOptions={{headerTitleStyle:{fontWeight:'800'},headerShadowVisible:false,headerTintColor:theme.ink}}>
 {user?<>
 <Stack.Screen name="Inicio" component={HomeScreen} options={{title:'TecnoFix'}}/>
 <Stack.Screen name="Dispositivo" component={DeviceScreen}/>
 <Stack.Screen name="Nueva reparación" component={NewRepairScreen}/>
 <Stack.Screen name="Detalle reparación" component={RepairDetailScreen}/>
 <Stack.Screen name="Crear usuario" component={CreateUserScreen}/>
 </>:<>
 <Stack.Screen name="Acceso" component={LoginScreen} options={{headerShown:false}}/>
 <Stack.Screen name="Registro" component={RegisterScreen}/>
 </>}
 </Stack.Navigator></NavigationContainer>;
}
