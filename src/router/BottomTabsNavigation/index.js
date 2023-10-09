import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import {MainBottomTabCustomize} from '../../components/';
import MainBottomTabCustomize from '../../components/molecules/MainBottomCustomize';
import { BackHandler } from 'react-native';
import { AttendanceHistoryScreen, HomeScreen } from '../../pages/index-pages'

// const Tab = createMaterialBottomTabNavigator();
const Tab = createBottomTabNavigator();
 
function handleBackButton  ()  {
  BackHandler.exitApp();
  return true;
}

export function MainBottomTab() {
  return (
      <Tab.Navigator tabBar={ props => <MainBottomTabCustomize {...props} />}>
        <Tab.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false, title: 'HomeScreen'}} />
        <Tab.Screen name="AttendanceHistoryScreen" component={AttendanceHistoryScreen} 
          listeners={{ 
                      focus: () => BackHandler.addEventListener('hardwareBackPress',handleBackButton)
                      ,
                      blur: () => BackHandler.removeEventListener('hardwareBackPress',handleBackButton)
          }}
          options={{headerShown: false, title: 'AttendanceHistoryScreen'}}
       />
     
      </Tab.Navigator>
  );
}







