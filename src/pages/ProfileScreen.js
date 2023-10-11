import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Alert } from 'react-native'
import React,{useState} from 'react'
import { ArrowLeftIcon } from '../assets/icon'
import { Gap, Button, Input } from '../components'
import { fontFamilyMedium, fontSizeMedium, mainColor, fontSizeSmall, mainBorderColor, fontFamilyRegular, placeholderColor, blackColor } from '../utils'
import { useTheme } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { useMyContext } from '../Context';
import { HideIcon, ShowIcon } from '../assets/icon';
import { getData, storeData } from '../localStorage'
import { UpdateProfileRequest } from '../request'

const listDivision = ["Sopran", "Alto", "Tenor", "Bass", "Multimedia"]

const ProfileScreen = (props) => {
  const { colors } = useTheme();
  const { showFlash, message, isVisible, state, setState } = useMyContext();
  const [ActiveScreen, setActiveScreen] = useState(true) //true == view, false == edit
  const [data, setData] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    divisi:'',
    newPassword:'',
    reNewPassword:'',
    isValidNewPassword: false,
    isValidReNewPassword: false,
    secureNewPasswordEntry: false,
    secureReNewPasswordEntry: false,
});

const firstNameChange = (val)=>{
    setData({
      ...data, 
      firstname:val,
  })
}

const lastNameChange = (val)=>{
    setData({
      ...data, 
      lastname:val,
  })
}

const emailChange = (val)=>{
    setData({
      ...data, 
      email:val,
  })
}

const newPasswordChange = (val) => {
  setData({
      ...data, 
      newPassword:val,
      isValidNewPassword : val == '' ? false : true,
  })
  if(val == ''){
    setData({
      reNewPassword:'',
      newPassword:val,
      isValidReNewPassword : false,
      // ...data,
    })
  } 
}

const reNewPasswordChange = (val) => {
    if(val!=data.newPassword){
      setData({
          ...data, 
          reNewPassword:val,
          isValidReNewPassword: false
      })
  }
  else{
      setData({
          ...data, 
          reNewPassword:val,
          isValidReNewPassword: true
      })
  }
}


const submitButton = async()=>{
  let newData = {"password" : data.newPassword !== '' ? data.newPassword: state.password } // cara akal akalan supaya mendapat password
  let responseLogin = '' 

 if((data.isValidReNewPassword == false && data.newPassword == '') ||(data.isValidReNewPassword == true && data.newPassword != '') ){

  const payload ={
    firstName : data.firstname,
    lastName : data.lastname,
    email : data.email,
    password: data.newPassword,
    division: data.divisi,
    userName: data.userName,
  }

  await UpdateProfileRequest(state.id, payload)
  .then((e)=>{
    showFlash(e.data.message);
            responseLogin = e.data.message
                newData.role = e.data.role !== (undefined|| "undefined") ? e.data.role : '-'
                newData.status = e.data.status !== (undefined|| "undefined") ? e.data.status : '-'
                newData.division = e.data.division !== (undefined|| "undefined") ? e.data.division : '-'
                newData.id = e.data.id 
                newData.email = e.data.email
                newData.firstName = e.data.firstName !== (undefined|| "undefined") ? e.data.firstName : '-'
                newData.lastName = e.data.lastName !== (undefined|| "undefined") ? e.data.lastName : '-'
                newData.userName = e.data.userName !== (undefined|| "undefined") ? e.data.userName : '-'
  })
  .catch((e)=>{
    showFlash('something wrong');
  })
 } 
 if(data.isValidReNewPassword == false && data.newPassword != ''){
    showFlash("re password does'nt matching")
 }

 // untuk push ke local storage
 if(responseLogin == 'Update user Sucess'){
  await storeData('userSession',newData)
  setState(newData)
  setActiveScreen(true)
}
else{
  Alert.alert('Wrong Input!', `${responseLogin}`,[
                {text:'Okay'}
            ]); 
}
}

const updateSecureNewPasswordEntry = () => {
  setData({
      ...data,
      secureNewPasswordEntry: !data.secureNewPasswordEntry
  });
}

const updateSecureReNewPasswordEntry = () => {
  setData({
      ...data,
      secureReNewPasswordEntry: !data.secureReNewPasswordEntry
  });
}

  return (
    <View style={{flex:1, paddingTop: 14, paddingHorizontal:30, backgroundColor:'#F5F5F5'}}>
            {isVisible && (
               <View style={styles.flashContainer}>
                   <Text style={styles.flashMessage}>{message}</Text>
                </View>
            )}
      <View  style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
        <TouchableOpacity onPress={()=>props.navigation.goBack()}>
              <ArrowLeftIcon/>
          </TouchableOpacity>
          <View>
          <Text style={{fontFamily:fontFamilyMedium.fontFamily, color:blackColor.color, fontSize: fontSizeMedium.fontSize}}>Profile</Text>
          </View>
      <View>
        {/* ini view bayangan */}
      </View>
      </View>
      <Gap height={48}/>
      <View style={{borderRadius:40, borderWidth:1, borderColor:mainBorderColor.color, width: '100%', flexDirection:'row', backgroundColor:'white', justifyContent:'space-between', height: 44, alignItems:'center'}}>
             <TouchableOpacity 
                  onPress={()=>setActiveScreen(true)}
                style={{borderRadius: 40, 
                backgroundColor: ActiveScreen == true? `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`: "white", 
                height: '100%', width:'50%', justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
                <Text style={{fontFamily:fontFamilyMedium.fontFamily, 
                  color: ActiveScreen == true? 'white': blackColor.color,
                   fontSize: fontSizeSmall.fontSize}}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
              onPress={()=>setActiveScreen(false)}
              style={{borderRadius: 40, 
                backgroundColor: ActiveScreen == false? `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`: "white", 
                height: '100%', width:'50%', justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
                <Text style={{fontFamily:fontFamilyMedium.fontFamily, 
                  color: ActiveScreen == false? 'white': blackColor.color,
                   fontSize: fontSizeSmall.fontSize}}>Edit Profile</Text>
              </TouchableOpacity>
      </View>
      <Gap height={20}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        {
            ActiveScreen == false ?
            <Input
                styleText={styles.styleText}
                styleView={styles.styleView}
                text={'First Name'}
                placeholder ="Your First Name"
                styleInput={{
                    color: colors.text
                }}
                autoCapitalize="none"
                onChangeText={(val)=>firstNameChange(val)}
            />
            :
            <>
            <Text style={styles.styleText}>First Name</Text>
            <View style={[styles.styleView,{height:42,  }]}>
            <Text style={{color:blackColor.color}}>{state?.firstName}</Text>
            </View>
            </>
        }
          <Gap height={20}/>
         {
          ActiveScreen == false ?
          <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'Last Name'}
                    placeholder ="Your Last Name"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    onChangeText={(val)=>lastNameChange(val)}
                />
                :
                <>
                <Text style={styles.styleText}>Last Name</Text>
                <View style={[styles.styleView,{height:42,  }]}>
                <Text style={{color:blackColor.color}}>{state?.lastName}</Text>
                </View>
                </>
          }
          <Gap height={20}/>
         { 
           ActiveScreen == false ?
         <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'Email'}
                    placeholder ="Your Email"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    onChangeText={(val)=>emailChange(val)}
                />
                :
                <>
                <Text style={styles.styleText}>Email</Text>
                <View style={[styles.styleView,{height:42,  }]}>
                <Text style={{color:blackColor.color}}>{state?.email}</Text>
                </View>
                </>
            }
          <Gap height={20}/>
          {
             ActiveScreen == false ?
            <>
          <Input
            styleText={styles.styleText}
            styleView={styles.styleView}
            text={'Password'}
            placeholder ="Enter Your Password"
            styleInput={{
                color: colors.text
            }}
            autoCapitalize="none"
            secureTextEntry={data.secureNewPasswordEntry?true:false}
            onChangeText={(val)=>newPasswordChange(val)}
            icon = {data.secureNewPasswordEntry? <HideIcon/>:<ShowIcon/>}
            onPressIcon={updateSecureNewPasswordEntry}
            />
            {
              data.isValidNewPassword == true?
              <>
                <Gap height={20}/>
                  <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'Re Password'}
                    placeholder ="Re Enter Your Password"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    secureTextEntry={data.secureReNewPasswordEntry?true:false}
                    onChangeText={(val)=>reNewPasswordChange(val)}
                    icon = {data.secureReNewPasswordEntry? <HideIcon/>:<ShowIcon/>}
                    onPressIcon={updateSecureReNewPasswordEntry}
                />
                  {   
                        data.reNewPassword == '' ?null
                        :data.isValidReNewPassword == true?
                        <Text>Password is match</Text>
                        :
                        <Text>Password is not match</Text>
                    }
              </>
              :
              null
            }
            </>  
            :null
          }
          <Gap height={20}/>
          
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              {
                  ActiveScreen == false ?
                <SelectDropdown
                     buttonStyle={{width:'47%', backgroundColor:'#eaeaea', borderRadius:14, height: 50, justifyContent:'center'}}
                     buttonTextStyle={styles.styleText}
                     defaultButtonText="Division"
                     data={listDivision}
                     onSelect={(select, index) => {
                      setData({
                        ...data, 
                        divisi:select,
                    })
                    }}
                  />
                  :
                  <View style={{width:'47%', borderRadius:14, height:50, backgroundColor:'#eaeaea', justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.styleText}>{state?.division}</Text>
                   </View>
              }
              {
              ActiveScreen == false ? null:
              <View style={{width:'47%', borderRadius:14, height:50, backgroundColor:'#eaeaea', justifyContent:'center', alignItems:'center'}}>
                      <Text style={styles.styleText}>{state?.role}</Text>
              </View>
              }
          </View>

          <Gap height={30}/>
          {
              ActiveScreen == true ? null:

            <Button
                  styleContainer={styles.buttonContainer}  
                  onPress={()=>submitButton()} 
                  name = 'submit' 
                  color= '#FCFCFC' 
                  size={fontSizeSmall.fontSize} 
                  fontFamily={fontFamilyRegular.fontFamily} 
                  textAlign ='center'
                />

          }
          <Gap height={20}/>
      </ScrollView>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  styleText:{fontFamily: fontFamilyRegular.fontFamily, fontSize: fontSizeSmall.fontSize, color:blackColor.color},
  styleView:{ width: '100%',borderWidth: 1, borderBottomColor: '#173C90', borderRadius:14, borderColor:mainBorderColor.color, flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:10},
  buttonContainer:{backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, width:'50%', height: 40, borderRadius: 10, justifyContent:'center'},
  flashContainer: {
    // padding: 20,
    // backgroundColor: '#00a86b',
    backgroundColor: 'lightgrey',
    borderRadius: 0,
    marginBottom: 0,
  },
  flashMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: placeholderColor.color
  },
})