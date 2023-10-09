import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify (value))
    } catch (e) {
      // saving error
    }
  }

  
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if(value !== null) {
      // value previously stored
      return JSON.parse(value)
    }
  } catch(e) {
    // error reading value
  }
}


export const clearAllData = async() => {
  AsyncStorage.clear();
}

export const removeData = async (key) =>{
  await AsyncStorage.removeItem(key)
}
    