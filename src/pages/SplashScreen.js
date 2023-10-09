import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { blackColor, mainColor } from '../utils'
import LinearGradient from 'react-native-linear-gradient'
import { VOCSLogo } from '../assets/logo'
import { Gap } from '../components'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = (props) => {

  useEffect(() => {
    getData()
  }, [])
  

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userSession')
      if(jsonValue != null){
        setTimeout(() => {
          props.navigation.replace('MainBottomTab')
        }, 2000)
      }
      else if (jsonValue == null){
        setTimeout(() => {
          props.navigation.replace('LogInScreen')
        }, 2000)
      }
    } catch(e) {
      console.log("Error state:",e);
    }
  }
  

  return (
    // <LinearGradient  colors={[styles.containerHeader.startGradient,styles.containerHeader.endGradient]} style={styles.containerHeader}>
    <LinearGradient  colors={[styles.containerHeader.startGradient, styles.containerHeader.endGradient]} style={styles.containerHeader}>
        <View style={{alignItems:'center'}}>
          <VOCSLogo/>
          <Gap height={5}/>
          <Text style={{fontFamily:'times-new-roman', fontSize: 15, color:blackColor.color}}>Voice Of Computer Science</Text>
        </View>
    </LinearGradient>

  )
}

export default SplashScreen

const styles = StyleSheet.create({
    //header
    containerHeader:{
      endGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.60)`,
      startGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, ${mainColor.a})`,
      flex: 1,
      justifyContent:'center',
      alignItems:'center'
  
    },
})