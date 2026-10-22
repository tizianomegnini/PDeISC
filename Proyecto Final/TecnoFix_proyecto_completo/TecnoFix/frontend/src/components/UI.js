import React from 'react';
import {View,Text,TextInput,TouchableOpacity,ActivityIndicator,StyleSheet} from 'react-native';
import {theme} from '../theme';

export function Field({label,value,onChangeText,placeholder,secureTextEntry,keyboardType,multiline}) {
 return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput style={[s.input,multiline&&{height:100,textAlignVertical:'top'}]} value={value} onChangeText={onChangeText} placeholder={placeholder||label} placeholderTextColor="#8994A6" secureTextEntry={secureTextEntry} keyboardType={keyboardType} multiline={multiline} autoCapitalize={keyboardType==='email-address'?'none':'sentences'}/></View>;
}
export function Button({title,onPress,secondary,disabled}) {
 return <TouchableOpacity disabled={disabled} onPress={onPress} style={[s.button,secondary&&s.secondary,disabled&&{opacity:.55}]}><Text style={[s.buttonText,secondary&&{color:theme.ink}]}>{title}</Text></TouchableOpacity>;
}
export function Page({children}) {return <View style={s.page}>{children}</View>}
export function Heading({title,subtitle}) {return <View style={{marginBottom:20}}><Text style={s.heading}>{title}</Text>{subtitle?<Text style={s.subtitle}>{subtitle}</Text>:null}</View>}
export function Loading(){return <View style={{padding:30,alignItems:'center'}}><ActivityIndicator size="large" color={theme.primary}/></View>}
export function ErrorText({children}){return children?<Text style={{color:theme.danger,marginVertical:8}}>{children}</Text>:null}
export const styles=s;
const s=StyleSheet.create({
 page:{flex:1,backgroundColor:theme.bg,padding:20},
 heading:{fontSize:27,fontWeight:'800',color:theme.ink,marginBottom:5},
 subtitle:{fontSize:14,color:theme.muted,lineHeight:20},
 field:{marginBottom:13},
 label:{fontSize:13,fontWeight:'700',color:theme.ink,marginBottom:6},
 input:{backgroundColor:theme.surface,borderColor:theme.border,borderWidth:1,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:theme.ink,fontSize:15},
 button:{backgroundColor:theme.primary,borderRadius:12,paddingVertical:14,paddingHorizontal:16,alignItems:'center',marginTop:8},
 secondary:{backgroundColor:theme.surface,borderColor:theme.border,borderWidth:1},
 buttonText:{color:'#FFFFFF',fontWeight:'800',fontSize:15}
});
