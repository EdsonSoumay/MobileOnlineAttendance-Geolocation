import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PermissionsAndroid, ScrollView, RefreshControl } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle, Callout } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
import SelectDropdown from 'react-native-select-dropdown';
import { Button, Gap } from '../components';
import { blackColor, fontFamilyMedium, fontFamilySemiBold, fontSizeMedium, mainColor, placeholderColor } from '../utils';
import { useMyContext } from '../Context';
import { DeactivatedAbsenRequest, GetAbsenceByAttendanceRequest, PostAbsenRequest } from '../request';
import { fontSizeSmall, fontFamilyRegular } from '../utils';

const radiusArea = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
const minutes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]

const MapScreen = ({navigation, route}) => {
  const [region, setRegion] = useState({
    latitude: route.params ? route.params.value.latitude : 1.417385,
    longitude: route.params ? route.params.value.longitude : 124.982486,
    latitudeDelta: 0.0007,
    longitudeDelta: 0.0007,
  });
  const [markers, setMarkers] = useState([]); // Menambahkan state untuk daftar marker
  // const [clickedCoordinate, setClickedCoordinate] = useState(null);
  const [radius, setRadius] = useState(route.params ? route.params.value.radius: 5)
  const [lateTolerance, setLateTolerance] = useState(route.params ? route.params.value.lateTolerance:10)
  const [users, setUsers] = useState([])
  const [ShowMember, setShowMember] = useState(false)
  const { showFlash, state, CurrentSemesterContext, isVisible, message} = useMyContext();
  // const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    if(route.params){
      return GetAbsenceByAttendanceRequest(route.params.value.id)
      .then(setUsers)
      .catch( (error)=>{showFlash(`${error.response.data.message}`)});
    }else{
      return null
    }
  };

  const submitButton = async () =>{
    const payload = {
      latitude: region.latitude,
      longitude: region.longitude,
      radius:radius,
      lateTolerance:lateTolerance,
      schoolYear: CurrentSemesterContext.schoolYear,
      semester: CurrentSemesterContext.semester,
      regBy: state?.userName
    }
    PostAbsenRequest(payload,navigation, showFlash)
    return null
  }

  const handleZoomIn = () => {
    // Perbarui region dengan faktor perbesaran yang lebih besar
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
    return null
  };

  const handleZoomOut = () => {
    // Perbarui region dengan faktor perbesaran yang lebih kecil
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  const handleMapPress = (e) => {
    if(route.params){
      return null  
    }
    const clickedCoordinate = e.nativeEvent.coordinate;
    const { latitude, longitude } = clickedCoordinate;
    setMarkers([clickedCoordinate]);
    setRegion({latitude, longitude, latitudeDelta: 0.0007,longitudeDelta: 0.0007});
    return null;
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin Lokasi',
          message: 'Aplikasi ini memerlukan izin lokasi untuk berfungsi dengan baik.',
          buttonPositive: 'Izinkan',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Izin diberikan, Anda dapat mengaktifkan layanan geolokasi di sini
        // const watchId = Geolocation.watchPosition(
        //   (position) => {
        //     // const { latitude, longitude } = position.coords;
        //     setError(null);
        //   },
        //   (error) => {
        //     setError(error.message);
        //   },
        //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        // );

        // Membersihkan pemantauan saat komponen di-unmount
        // return () => {
        //   Geolocation.clearWatch(watchId);
        // };
      } else {
        console.log('Izin lokasi ditolak');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    // Meminta izin lokasi saat komponen dipasang (mounted)
    requestLocationPermission();
    
    //untuk mengakses user
    if(route.params){
      GetAbsenceByAttendanceRequest(route.params.value.id)
      .then(setUsers)
      .catch( (error)=>{showFlash(`${error.response.data.message}`)});
    }
  }, []);

  return (
    <View style={styles.container}>
          {isVisible && (
              <View style={styles.flashContainer}>
                  <Text style={styles.flashMessage}>{message}</Text>
              </View>
          )}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        zoomEnabled={true}
        onPress={handleMapPress} // Tambahkan event handler onPress
      >
      
      {/* marker location */}
      {markers.map((marker, index) => (
      <Marker
        key={index}
        coordinate={marker}
        title={`Marker ${index + 1}`}
        pinColor="orange"
      />
    ))}

    {/* users location */}
      {users.map((user) => {
        console.log("user:",user)
        if(user.latitude && user.longitude){
          return (
            <Marker
              key={user._id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
              title={user.name}
            >
              <Callout>
                <View>
                  <Text style={{color:placeholderColor.color}}>Name: {user.userId.firstName} {user.userId.lastName} ({user.userId.userName}) </Text>
                  <Text style={{width:120, color: placeholderColor.color}}>Status:{user.presence}</Text>
                </View>
              </Callout>
            </Marker>
          );
        }else{
          null;
        }
      })}
      <Circle
        center={region}
        radius={radius} // Radius dalam meter
        fillColor="rgba(255, 0, 0, 0.3)" // Warna merah dengan transparansi
      />
    </MapView>
    {/* {clickedCoordinate && (
        <View style={styles.clickedCoordinate}>
          <Text>Clicked Coordinate:</Text>
          <Text>Latitude: {clickedCoordinate.latitude}</Text>
          <Text>Longitude: {clickedCoordinate.longitude}</Text>
        </View>
      )} */}
      <Button 
            styleContainer={styles.buttonContainer} 
            onPress={route.params ? ()=>DeactivatedAbsenRequest(route.params.value.id, navigation, state?.userName, showFlash) : submitButton} 
            name =  { route.params ? "Deactivate " : "Submit"} 
            color= '#FCFCFC' 
            size={fontSizeSmall.fontSize} 
            fontFamily={fontFamilyRegular.fontFamily} 
            textAlign ='center'
        />      
        <View style={styles.radiusArea}>
          <View>
          <Text style={styles.styleText}>Radius</Text>
          </View>
          <Gap width={5}/>
          <View>
          <SelectDropdown
            buttonStyle={{ backgroundColor:'#eaeaea', borderRadius:14, height: 50, width:55, justifyContent:'center'}}
            buttonTextStyle={styles.styleText}
            defaultButtonText={radius}
            data={radiusArea}
            onSelect={(select, index) => {
            setRadius(select)
          }}
          disabled={ route.params ? true : false}
        />
      </View>
      <Gap width={5}/>
      <View>
        <Text style={styles.styleText}>Meter</Text>
      </View>
    </View>
    <View style={styles.lateTolerance}>
          <View>
          <Text style={styles.styleText}>Late Tolerance</Text>
          </View>
          <Gap width={5}/>
          <View>
          <SelectDropdown
            buttonStyle={{ backgroundColor:'#eaeaea', borderRadius:14, height: 50, width:55, justifyContent:'center'}}
            buttonTextStyle={styles.styleText}
            defaultButtonText={lateTolerance}
            data={minutes}
            onSelect={(select, index) => {
            setLateTolerance(select)
          }}
          disabled={ route.params ? true : false}
        />
      </View>
      <Gap width={5}/>
      <View>
        <Text style={styles.styleText}>Minutes</Text>
      </View>
    </View>
    <TouchableOpacity onPress={()=>setShowMember(!ShowMember)} style={styles.containerMemberInsideZone}>
    <Text style={{color:blackColor.color}}>Member inside Zone:</Text>
    </TouchableOpacity>
    <>
    {
        ShowMember &&
        <ScrollView style={styles.userList}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor="#FF0000" // Warna indikator loading (spinner)
            title="Memuat ulang..." // Teks yang ditampilkan saat proses refresh
            titleColor="#000000" // Warna teks yang ditampilkan saat proses refresh
          />
        }>
          {users.map((user) => (
            
            <View key={user._id} style={{display:'flex', flexDirection:'row'}}>
            {
              user.presence === "ontime" || user.presence === "late" ?
              <>
              <Text style={{color:blackColor.color}}>{user.userId.firstName|| "-"} {user.userId.lastName || "-"} ({user.userId.userName}) </Text>
              {
                ( !user.longitude || !user.latitude ) ? <Text style={{fontFamily: fontFamilySemiBold.fontFamily, color: 'red'}}> - Manual Presence</Text> : null
              }
              </>
              :
              null
            }
            </View>
          ))}
      </ScrollView>
    }
    </>

      <View style={styles.zoomButtons}>
        <TouchableOpacity onPress={handleZoomIn} style={styles.button}>
          <Text>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleZoomOut} style={styles.button}>
          <Text>Zoom Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  styleText:{
    fontFamily: fontFamilyMedium.fontFamily, 
    fontSize: fontSizeMedium.fontSize, color:'#000000'
  },
  zoomButtons: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  containerMemberInsideZone:{
    position: 'absolute',
    top: '2%',
    left: '2%',
  },
  userList: {
    position: 'absolute',
    top: '7%',
    left: '2%',
    backgroundColor: 'white',
    // padding: 8,
    borderRadius: 8,
    maxHeight:"98%"
  },
  clickedCoordinate: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
  },
  radiusArea:{
    flexDirection:'row',
    justifyContent:'center', 
    alignItems:'center',
    top: '2%',
    right: '2%',
    position: 'absolute',
  },
  lateTolerance:{
    flexDirection:'row',
    justifyContent:'center', 
    alignItems:'center',
    top: '10%',
    right: '2%',
    position: 'absolute',
  },
  buttonContainer:{
    backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, 
    height: 39, 
    borderRadius: 10, 
    // bottom: 16,
    bottom: '2%',
    left: '2%',
    justifyContent:'center', 
    marginHorizontal:'40%',
    position: 'absolute',
  },
  flashContainer: {
    // padding: 20,
    position: 'absolute',
    zIndex:1,
    backgroundColor: 'lightgrey',
    borderRadius: 0,
    marginBottom: 0,
    top: '2%',
    left: '2%',
  },
  flashMessage: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MapScreen;

// // Helper function to calculate haversine distance (in meters) between two coordinates(function hitung radius)
// function haversineDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371000; // Radius of the Earth in meters
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c;
//   return distance;
// }
