import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Linking } from 'react-native'
import React,{useState} from 'react'
import {fontFamilyMedium, fontFamilyLight, fontFamilyRegular, fontSizeMedium, fontSizeSmall, mainColor, fontSizeExtraSmall, fontFamilySemiBold, blackColor, placeholderColor } from '../utils'
import  { ArrowLeftIcon, InstagramIcon } from '../assets/icon'
import { Button, Gap } from '../components'

const AboutAppScreen = (props) => {
  const [message, setMessage] = useState('');
    const handleWhatsApp = () => {
    if(message !== ''){
      let phoneNumber = '+6285298412754';
      let whatsappMessage = message;
      let url = 'whatsapp://send?phone=' + phoneNumber + '&text=' + whatsappMessage;
      Linking.openURL(url)
      .then((data) => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Pastikan WhatsApp terinstall di perangkat Anda');
      });
    }
  };

  const handleInstagram = () => {
    let username = 'reds.eds';
    let url = 'https://www.instagram.com/' + username;
    Linking.openURL(url)
      .then((data) => {
        console.log('Instagram Opened');
      })
      .catch(() => {
        alert('Pastikan Instagram terinstall di perangkat Anda');
      });
  };
  
  return (
    <View style={{ flex: 1, marginHorizontal: 30, marginTop: 14}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>props.navigation.goBack()}>
              <ArrowLeftIcon/>
          </TouchableOpacity>
        <Text style={{fontFamily:fontFamilySemiBold.fontFamily, color:blackColor.color, fontSize:17}}>About App</Text>
          <View>
            {/* view bayangan */}
          </View>
        </View>
        <Gap height={42}/>
        <ScrollView>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontFamily:fontFamilyMedium.fontFamily, fontSize:fontSizeMedium.fontSize, color:blackColor.color}}>VOCSAbsension</Text>
            <Gap width={15}/>
          <Text style={{fontFamily:fontFamilyRegular.fontFamily, fontSize:fontSizeSmall.fontSize, color: placeholderColor.color}}>V 1.0.2</Text>
        </View>
        <Gap height={20}/>
        <View>
          <Text style={{fontFamily:fontFamilyMedium.fontFamily, fontSize:fontSizeMedium.fontSize, color:blackColor.color}}>About Developer</Text>
          <Gap height={10}/>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View>
              <Text style={{fontFamily:fontFamilyMedium.fontFamily, fontSize:fontSizeMedium.fontSize, color:blackColor.color, marginBottom: -6}}>Edson R. S</Text>
              <Text style={{fontFamily:fontFamilyLight.fontFamily, fontSize:fontSizeExtraSmall.fontSize, color: placeholderColor.color}} >Web/Mobile App Developer - VOCS Alumni 2022</Text>
            </View>
            <View>
              <TouchableOpacity onPress={handleInstagram}>
                  <InstagramIcon/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Gap height={30}/>
        <View>
           <Text style={{fontFamily:fontFamilyLight.fontFamily, fontSize:fontSizeSmall.fontSize, color: placeholderColor.color}}>
            Kalo dapa bug atau ada saran, kalo mau bku bantu kembangkan ini app atau mau depe code, hubungi pa kta
          </Text>
          <Gap height={10}/>
          <View style={{ borderRadius: 10, backgroundColor:'white' }}>
            <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={400}
                onChangeText={text => setMessage(text)}
                // value={value}
                value={40}
                style={{padding: 10, color:blackColor.color}}
              />
          </View>
          <Gap height={13}/>
          <View style={{ flexDirection:'row', justifyContent:'flex-end'}}>
            <View style={{ width:'30%'}}>
            <Button
              styleContainer={styles.buttonContainer}  
              onPress={handleWhatsApp} 
              name = 'Send' 
              color= '#FCFCFC' 
              size={fontSizeSmall.fontSize} 
              fontFamily={fontFamilyRegular.fontFamily} 
              textAlign ='center'
            />
            </View>
          </View>
        </View>
        </ScrollView>
    </View>
  )
}

export default AboutAppScreen

const styles = StyleSheet.create({
  header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  buttonContainer:{backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, height: 39, borderRadius: 10, justifyContent:'center'},
})