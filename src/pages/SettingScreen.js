import { StyleSheet, Text, View, Switch, TouchableOpacity, Dimensions, Alert, BackHandler } from 'react-native'
import React from 'react'
import  {
  SettingIcon, HistoryActive, HistoryInActive, HomeActive,
  AboutIcon, ArrowLeftIcon, CamIcon, DarkModeIcon, HelpIcon,
  LogOutIcon, PeopleIcon, WorldIcon, RightIcon, ProfileIcon
} from '../assets/icon'

import { Gap } from '../components'
import { backGroundColor, fontFamilyMedium, fontFamilyRegular, fontSizeSmall, mainColor, fontFamilySemiBold } from '../utils'
import { removeData } from '../localStorage'
import { CommonActions } from '@react-navigation/native';

const SettingScreen = ({navigation}) => {

  const windowWidth = Dimensions.get('window').width * 0.833;

  const handleStackNav = () =>{
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'SplashScreen'},
          ],
        })
      );
      BackHandler.exitApp()
  }

  const logOut = async () =>{
   await removeData('userSession')
   .then((e)=>{
          handleStackNav()
          })
    .catch((e)=>{
      handleStackNav()
    })
  }

  return (
    <View style={{backgroundColor: backGroundColor.color, flex: 1, alignItems:'center'}}>
    <View style={{width: windowWidth}} >
      <Gap height={14}/>
      <View style={styles.header}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
              <ArrowLeftIcon/>
          </TouchableOpacity>
        <Gap width={32.5}/>
        <Text style={{fontFamily:fontFamilySemiBold.fontFamily, color:'#000000', fontSize:17}}>Settings</Text>
      </View>
      <Gap height={52}/>
      <View style={styles.body}>
      <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('ProfileScreen')}>
          <View style={styles.other}>
            <View>
              <ProfileIcon/>
            </View>
            <Gap width={35}/>
            <View>
              <Text style={styles.titleSetting}>Profile</Text>
            </View>
          </View>
          <View style={styles.other}>
            <View style={styles.containerRightIcon}>
              <RightIcon/>
            </View>
          </View>
        </TouchableOpacity>
        {/* <Gap height={20}/>
        <TouchableOpacity style={styles.card}>
          <View style={styles.other}>
            <View>
              <WorldIcon/>
            </View>
            <Gap width={35}/>
            <View>
              <Text style={styles.titleSetting}>Language</Text>
            </View>
          </View>
          <View style={styles.other}>
            <Text style={styles.textLanguage}>English</Text>
            <Gap width={12}/>
            <View style={styles.containerRightIcon}>
              <RightIcon/>
            </View>
          </View>
        </TouchableOpacity>
        <Gap height={20}/>
        <TouchableOpacity style={styles.card}>
          <View style={styles.other}>
            <View>
             <DarkModeIcon/>
            </View>
            <Gap width={35}/>
            <View>
              <Text style={styles.titleSetting}>Dark Mode</Text>
            </View>
          </View>
          <View style={styles.other}>
            <Text>Off</Text>
            <Gap width={12}/>
            <View style={{ width: 34, height: 34, borderRadius:14, justifyContent:'center', alignItems:'center'}}>
              <Switch/>
            </View>
          </View>
        </TouchableOpacity>
        <Gap height={20}/>
        <TouchableOpacity style={styles.card}>
          <View style={styles.other}>
            <View>
             <HelpIcon/>
            </View>
            <Gap width={35}/>
            <View>
              <Text style={styles.titleSetting}>Help</Text>
            </View>
          </View>
          <View style={styles.other}>
            <View style={styles.containerRightIcon}>
              <RightIcon/>
            </View>
          </View>
        </TouchableOpacity> */}
        <Gap height={20}/>
        <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('AboutAppScreen')}>
          <View style={styles.other}>
            <View>
            <AboutIcon/>
            </View>
            <Gap width={35}/>
            <Text style={styles.titleSetting}>About App</Text>
          </View>
          <View style={styles.other}>
            <View style={styles.containerRightIcon}>
              <RightIcon/>
            </View>
          </View>
        </TouchableOpacity>
        <Gap height={20}/>
      <TouchableOpacity style={styles.card} 
      onPress={()=>{
        Alert.alert('Warning!', 'Are You Sure to Log Out?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () =>  logOut()},
        ]);
       
      }}
      
      >
          <View style={styles.other}>
            <View>
              <LogOutIcon/>
            </View>
            <Gap width={35}/>
            <View>
              <Text style={styles.titleSetting}>Log Out</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  header:{
    flexDirection:'row',
    // paddingTop: 20,
    // paddingLeft:50,
    alignItems:'center'
  },
  body:{
    // marginHorizontal: 50
  },
  card:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  containerRightIcon:{
    width: 34,
    height: 34,
    borderRadius:10,
    backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.2)`,
    justifyContent:'center',
    alignItems:'center',
  },
  other:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  titleSetting:{fontFamily: fontFamilyRegular.fontFamily, fontSize: fontSizeSmall.fontSize, color:'#000000'},
  textLanguage:{ 
    fontFamily: fontFamilyRegular.fontFamily, fontSize: fontSizeSmall.fontSize, color:'#9FA4AB'
  }

})