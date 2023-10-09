import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { VOCSLogoSmall } from '../../../assets/logo'
import { placeholderColor } from '../../../utils'
const LogoHeader = () => {
  return (
    <View style={{alignItems:'center'}}>
        <VOCSLogoSmall />
        <Text style={{fontFamily:'times-new-roman', fontSize: 15, color: placeholderColor.color }}>Voice Of Computer Science</Text>
      </View>
  )
}

export default LogoHeader

const styles = StyleSheet.create({})