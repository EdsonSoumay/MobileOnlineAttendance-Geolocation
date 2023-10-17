import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View,TextInput } from "react-native";
import { fontFamilyMedium, fontSizeBig, mainColor, fontSizeSmall, fontFamilyRegular  } from "../../../utils";
import { Button, Gap, Input } from "../../../components";
import { useTheme } from "react-native-paper";
import { HideIcon, ShowIcon } from '../../../assets/icon';
import { useMyContext } from "../../../Context";

const ConfirmModal = (props) => {
  const { showFlash, message, isVisible, state, setState } = useMyContext();
  const { colors } = useTheme();
  const {action, type, buttonInfo, id, latestAbsen } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [dataPassword, setDataPassword] = useState({password: '',isValidPassword: true});

  const handlePasswordChange = (val) => {
        setDataPassword({
            ...dataPassword, 
            password:val,
            isValidPassword: true
        })
  }

  const updateSecureTextEntry = () => {
      setDataPassword({
          ...dataPassword,
          secureTextEntry: !dataPassword.secureTextEntry
      });
  }


  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.overlay}>
         <View style={styles.modalConfirmView}>
           <View style={{ flexDirection:'row', justifyContent:'flex-end'}}>
           <Pressable
            onPress={() => setModalVisible(false)}
            style={{ height: 30, width: 30, alignItems:'center'}}
          >
            <Text style={{fontSize: 20}}>x</Text>
          </Pressable>
          </View>
          <View style={{paddingHorizontal:'10%'}}>
            <Text style={{fontFamily: fontFamilyMedium.fontFamily, fontSize: fontSizeBig.fontSize, color:'#000000'}}>Are you Sure to {type} absen?</Text>
          </View>
          <Gap height={20}/>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
              <View style={{width: '80%'}}>
              <Input
                    styleText={styles.styleText}
                    styleView={styles.styleView}
                    text={'Password'}
                    placeholder ="Your Password"
                    styleInput={{
                        color: colors.text
                    }}
                    autoCapitalize="none"
                    secureTextEntry={dataPassword.secureTextEntry?true:false}
                    onChangeText={(val)=>handlePasswordChange(val)}
                    icon = {dataPassword.secureTextEntry? <HideIcon/>:<ShowIcon/>}
                    onPressIcon={updateSecureTextEntry}
               />
            </View>
          </View>
          {isVisible && (
              //  <View style={styles.flashContainer}>
                   <Text style={styles.flashMessage}>{message}</Text>
                // </View>
            )}
          <Gap height={50}/>
          <Button 
                styleContainer={styles.buttonContainer} 
                onPress={()=>{
                  if(dataPassword.password == state.password){
                    if(type === 'delete'){
                      // kondisi untuk delete absen
                      action(id);
                      setModalVisible(false)
                      setDataPassword({
                        dataPassword:''
                    });
                    return null;
                    }
                    //kondisi untuk crate absen
                    action();
                    setModalVisible(false)
                    setDataPassword({
                      dataPassword:''
                  });
                  return null;
                }else{
                      showFlash('wrong password');
                    }
                  }
                } 
                name = 'Confirmation' 
                color= '#FCFCFC' 
                size={fontSizeSmall.fontSize} 
                fontFamily={fontFamilyRegular.fontFamily} 
                textAlign ='center'
            />      
          </View>
      </View>
      </Modal>
      <Pressable
       style={{width: '100%'}}
        onPress={() => setModalVisible(true)}
      >
            {
              typeof buttonInfo == 'string'?
              <View style={{flexDirection:'row', justifyContent:'center'}}>
                  <View style={{
                    backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`,
                    height: 39, borderRadius: 10, justifyContent:'center',
                    //  alignItems:'center', 
                    width:'40%'
                    }}>
                    <Text style={styles.textStyle}>{buttonInfo}</Text>
                  </View>
              </View>
            :
            buttonInfo
            }

      </Pressable>

    </View>
  );
};

  const styles = StyleSheet.create({
    mainContainer:{
      flex: 1,
      flexDirection:'column',
      marginTop: 22,
      justifyContent:'space-between',
      marginHorizontal:'7%'
    },
    centeredView: {
      flex: 1,
      flexDirection:'column',
      justifyContent: 'flex-end',
      alignItems: "center",
      // marginTop: 22,
    },
    overlay: {
      flex: 1,
      flexDirection:'column',
      justifyContent: 'flex-end',
      alignItems: "center",
      // marginTop: 22,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      flexDirection:'column',
      // justifyContent:'space-between',
      margin: 20,
      height:'95%',
      width: '95%',
      backgroundColor: "white",
      borderRadius: 20,
      paddingTop: 10,
      paddingRight: 10,
      // padding: 35,
      // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalConfirmView: {
      flexDirection:'column',
      // justifyContent:'space-between',
      margin: 20,
      height:'45%',
      width: '95%',
      backgroundColor: "white",
      borderRadius: 20,
      paddingTop: 10,
      paddingRight: 10,
      // padding: 35,
      // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalViewEditAbsen: {
      flexDirection:'column',
      // justifyContent:'space-between',
      margin: 20,
      height:'50%',
      width: '100%',
      backgroundColor: "white",
      borderRadius: 20,
      paddingTop: 10,
      paddingRight: 10,
      // padding: 35,
      // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    buttonContainer:{backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, height: 39, borderRadius: 10, justifyContent:'center', marginHorizontal:'30%'},
    styleText:{fontFamily: fontFamilyMedium.fontFamily, fontSize: fontSizeBig.fontSize, color:'#000000'},
    styleView:{width:'100%',borderWidth: 1, borderBottomColor: '#173C90', borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
    flashMessage: {
      fontSize: 18,
      textAlign: 'center',
    },
    
  });

export default ConfirmModal;


