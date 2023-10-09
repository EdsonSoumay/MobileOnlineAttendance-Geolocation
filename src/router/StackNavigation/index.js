import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {LogInScreen,AboutAppScreen, ProfileScreen, AttendanceHistoryScreen, HomeScreen, AllAbsenScreen, SettingScreen, SplashScreen, SignUpScreen, ForgotPasswordScreen, CreateAbsenScreen } from '../../pages/index-pages'
import { MainBottomTab } from '../BottomTabsNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapScreen from '../../pages/MapScreen';


const Stack = createStackNavigator();

export const MainStack = () => {

  const [ UserSession, setUserSession] = useState()

useEffect(() => {
  getData()
}, [])


const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userSession')
    if(jsonValue != null){
      setUserSession(JSON.parse(jsonValue))
    }
  } catch(e) {
    console.log("Error state:",e);
  }
}


  return (
    <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false, title: 'SplashScreen'}} />
      
      {
        UserSession ? null
        :
        <>
          <Stack.Screen name="LogInScreen" component={LogInScreen} options={{headerShown: false, title: 'LogInScreen'}} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false, title: 'SignUpScreen'}} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{headerShown: false, title: 'ForgotPasswordScreen'}} />
        </>   
      }
      
      <Stack.Screen name="MainBottomTab" component={MainBottomTab} options={{headerShown: false, title: 'MainBottomTab'}} />
      <Stack.Screen name="MapScreen" component={MapScreen} options={{headerShown: false, title: 'MainBottomTab'}} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false, title: 'HomeScreen'}} />
      <Stack.Screen name="CreateAbsenScreen" component={CreateAbsenScreen} options={{headerShown: false, title: 'CreateAbsenScreen'}} />
      <Stack.Screen name="AttendanceHistoryScreen" component={AttendanceHistoryScreen} options={{headerShown: false, title: 'AttendanceHistoryScreen'}} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} options={{headerShown: false, title: 'SettingScreen'}} />
      <Stack.Screen name="AllAbsenScreen" component={AllAbsenScreen} options={{headerShown: false, title: 'AllAbsenScreen'}} />
      <Stack.Screen name="AboutAppScreen" component={AboutAppScreen} options={{headerShown: false, title: 'AboutAppScreen'}} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: false, title: 'ProfileScreen'}} />
    </Stack.Navigator>
  );
}


export default MainStack;

const styles = StyleSheet.create({})