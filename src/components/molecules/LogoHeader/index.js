import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NewVOCSLogoSmall } from '../../../assets/logo'
import { placeholderColor } from '../../../utils'
const LogoHeader = () => {
  return (
    <View style={{alignItems:'center'}}>
        <NewVOCSLogoSmall/>
        <Text style={{fontFamily:'times-new-roman', fontSize: 15, color: placeholderColor.color }}>Voice Of Computer Science</Text>
      </View>
  )
}

export default LogoHeader

const styles = StyleSheet.create({})