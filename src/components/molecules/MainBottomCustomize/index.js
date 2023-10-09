import React from 'react';
import { View, StyleSheet} from 'react-native';
import { MainBottomTabItem } from '../Tabitem';
import { mainColor } from '../../../utils';

const MainBottomTabCustomize = ({ state, descriptors, navigation, dispatch }) => {

  // console.log("screen option:",props)

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }

          if(route.name !== "Home") {
            // dispatch(deleteParameterFilter())
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
         <MainBottomTabItem
         key={index}
         label={label}
         isFocused={isFocused}
         onLongPress={onLongPress}
         onPress={onPress}/>
        );
      })}
    </View>
  );
}

// export default connect()(BottomNavigatorCS)
export default MainBottomTabCustomize

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent:'space-around',
    height: 66,
    // backgroundColor: colors.kedelapan,
    backgroundColor:'#FFFFFF',
    paddingVertical: 13,
    paddingHorizontal: 36,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.30)`
  }
})


