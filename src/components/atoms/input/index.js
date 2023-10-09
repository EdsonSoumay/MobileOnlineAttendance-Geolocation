// export default Input
import { TextInput, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'
import { blackColor, placeholderColor } from '../../../utils'

const Input = ({ 
  styleView, styleText, text, // container,
  icon, onPressIcon, // di icon
  placeholder, styleInput , autoCapitalize, onChangeText, onEndEditing, secureTextEntry,
}) => {
  return (
    <>
      <Text style={styleText}>{text}</Text>
        <View style={styleView}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={placeholderColor.color} 
            // style={styleInput}
            autoCapitalize={autoCapitalize}
            onChangeText={onChangeText}
            onEndEditing={onEndEditing}
            secureTextEntry={secureTextEntry}
            style={{color:blackColor.color, height:40}}
          />
          {
            icon?
            <TouchableOpacity onPress={onPressIcon}>
              {icon}
            </TouchableOpacity>
            :
            null
          }
      </View>
    </>
    )
}

export default Input
