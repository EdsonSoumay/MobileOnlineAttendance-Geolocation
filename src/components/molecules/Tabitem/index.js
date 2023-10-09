import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
// import { colors } from '../../../utils/colors'

import { HomeActive, HomeInActive, HistoryInActive, HistoryActive } from '../../../assets/icon'

export const MainBottomTabItem = ({isFocused, onLongPress, onPress, label}) => {

  console.log("label:", label);
    const Icon = () => {
        if(label === "HomeScreen") {
            return isFocused ? <HomeActive/> : <HomeInActive/>
        }

        if(label === "AttendanceHistoryScreen") {
          return isFocused ? <HistoryActive/> : <HistoryInActive/>
      }
        return <HomeActive/>
    }
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}>
        <Icon/>
      {/* <Text style={styles.text(isFocused)}>{label}</Text> */}
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    container: { 
        alignItems: 'center',
    },
    text: (isFocused) => ({
        // // color: isFocused ? colors.kedua : colors.keenam,
        color: isFocused ? '#01469F' : '#000000',
        fontFamily: 'Poppins-Light',
        fontSize: 11,
        marginTop: 6
    })
})