import { StyleSheet, Modal, Button as ButtonNative,TouchableWithoutFeedback, Text, View, ScrollView, Dimensions, TouchableOpacity,BackHandler, Alert, PermissionsAndroid } from 'react-native'
import React, {useEffect, useState, useContext,createContext } from 'react'
import { backGroundColor, blackColor, firstPageBorder, fontFamilyMedium, fontFamilyRegular , fontRegular, fontSizeBig, fontSizeMedium, fontSizeSmall, fontSubTitle, fontTitle, mainColor, placeholderColor, secondColor, widthComponent } from '../utils'
import LinearGradient from 'react-native-linear-gradient'
import Geolocation from 'react-native-geolocation-service';
import SelectDropdown from 'react-native-select-dropdown';
import { SettingIcon } from '../assets/icon'
import { Button, Gap } from '../components'
import { getData, storeData } from '../localStorage'
import { useMyContext } from '../Context'
import { GetCurrentSemesterRequest, PostStudentAttendanceRequest, UpdateCurrentSemesterRequest } from '../request'

const listSchoolYear = ["2021-2022","2022-2023", "2023-2024", "2024-2025","2025-2026", "2026-2027","2027-2028", "2028-2029", "2029-2030"]
const listSemester = ["2", "1", "summer"]

const MyModal = (props) => {
  const { 
    modalVisible, setModalVisible, selectedItem, setSelectedItem, updateCurrentSemester,
    CurrentSemester
  }= props

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={{ 
          flex: 1, 
          backgroundColor: "rgba(0, 0, 0, 0.5)", 
         justifyContent: "center",
        //  alignItems: "center"
         }}>
          <View style={{ 
                backgroundColor: "white",
                //  padding: 20,
                  borderRadius: 10 }}>
            <View 
            >
            <Gap height={20}/>
            <View>
              <Text style={{color:placeholderColor.color}}>select School Year</Text>
              <SelectDropdown
                   buttonStyle={{width:'100%'}}
                  data={listSchoolYear}
                  onSelect={(select, index) => {
                    setSelectedItem({...selectedItem, schoolYear:select})
                  }}
                />
            </View>
            <Gap height={20}/>
            <View>
              <Text style={{color:placeholderColor.color}}>Select Semester</Text>
              <SelectDropdown
                   buttonStyle={{width:'100%'}}
                  data={listSemester}
                  onSelect={(select, index) => {
                    setSelectedItem({...selectedItem, semester:select})
                  }}
                />
            </View>
          </View>
         
          <Gap height={20}/>
          <View style={{justifyContent:'center', width:'30%'}}>
            <Button
              styleContainer={styles.buttonContainer}  
              onPress={()=>updateCurrentSemester()} 
              name = 'submit' 
              color= '#FCFCFC' 
              size={fontSizeSmall.fontSize} 
              fontFamily={fontFamilyRegular.fontFamily} 
              textAlign ='center'
            />
          </View>
          </View>
        </View>

    </TouchableWithoutFeedback>

      </Modal>
             <Text style={{color:'white'}} onPress={() => setModalVisible(true)}>
              {
              Object.keys(CurrentSemester).length === 0 ?
              `School Year: - semester : -`:
              `School Year: ${CurrentSemester.schoolYear}, Semester : ${CurrentSemester.semester}`
              }
              </Text>
    </View>
  );
};


const HomeScreen = (props) => {

    const { showFlash, message, isVisible, state, setState, CurrentSemesterContext, setCurrentSemesterContext } = useMyContext();
    const windowWidth = Dimensions.get('window').width * 0.833;
    const windowHeight = Dimensions.get('window').height;
    // const [ UserSession, setUserSession] = useState()

    // console.log("user session:",UserSession)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState({
      semester: '-',
      schoolYear:'-',
    });

    const getCurrentSemester = async () =>{
      return GetCurrentSemesterRequest()
      .then((e)=>{
        setCurrentSemesterContext({
            schoolYear: e.schoolYear, 
            semester :e.semester,
        })
      }).catch((error)=>{
        showFlash(`${error.response.data.message}`);
      })
    }

    const updateCurrentSemester = async () =>{
      if(!selectedItem.semester || selectedItem.semester === '-'  || !selectedItem.schoolYear || selectedItem.schoolYear === '-' ){
        showFlash('there are empty fields')
      }
    else{
      UpdateCurrentSemesterRequest(selectedItem,setCurrentSemesterContext,setModalVisible,showFlash, setSelectedItem)
    }
    return null
    }

    const sendLocation = async () => {
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
          Geolocation.getCurrentPosition(
            (position) => {
              if(position?.mocked === true){
                //terdeteksi ketika user pake fake gps
              showFlash("Jangan Nackal yahh");
              }else{
                const { latitude, longitude } = position.coords;
                const data = { latitude,longitude };
                PostStudentAttendanceRequest(data,state.id,showFlash)
                // Lakukan apa pun yang perlu Anda lakukan dengan latitude dan longitude di sini
              }
            },
            (error) => {
              showFlash("Error getting geolocation:", error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );
        } else {
          // setError('Izin lokasi ditolak');
          showFlash("location permision has rejected");
        }
      } catch (err) {
        // console.log(err);
        showFlash("server error");
      }
    }

    useEffect( () => {
      const handleUserSession = async () =>{
        // setUserSession( await getData('userSession'))
        setState( await getData('userSession'))
      }
      handleUserSession()
      getCurrentSemester()
    }, [])


    //logika untuk mengecek schoolYear sama tidak dengan tahun ajaran saat ini 
    const splitYear = CurrentSemesterContext?.schoolYear?.split("-"); // split menjadi tahun semester 1 dan 2
    let startDate;
    let endDate;
    const dateToCheck = new Date(); // Tanggal yang ingin diperiksa
    if(splitYear){
      startDate = new Date(`${splitYear[0]}-08-01`); // Tanggal awal
       endDate = new Date(`${splitYear[1]}-07-31`); // Tanggal akhir
    }
    const isCurrentDateInSchoolYear = dateToCheck >= startDate && dateToCheck <= endDate; // Memeriksa apakah tanggal saat ini berada dalam rentang tahun ajaran
    //end 
    
    //logika untuk mengecek semester sama tidak dengan semester saat ini, waktu disesuaikan berdasarkan GMT
    function isCurrentDateInSemester() {
      let currentDate = new Date();
      const offsetInMinutes = currentDate.getTimezoneOffset(); // Mendapatkan perbedaan zona waktu dalam menit
      const offsetInMilliseconds = offsetInMinutes * 60 * 1000; // Menghitung perbedaan dalam milidetik
      const userDateTimeMilliseconds = currentDate.getTime() - offsetInMilliseconds; // Menghitung tanggal dalam zona waktu pengguna
      const userDateTime = new Date(userDateTimeMilliseconds); // Membuat objek Date dalam zona waktu pengguna
      const convertCurrentDate = userDateTime.toISOString(); // Mengonversi objek Date ke format yang diinginkan
      const tempCurrentDate = new Date(convertCurrentDate)  // ubah string ke new Date()
      const currentMonth = tempCurrentDate.getMonth() + 1; // Perhatikan bahwa indeks bulan dimulai dari 0 (Januari = 0).
      const currentDay = tempCurrentDate.getDate(); // get tanggal
      
      if(CurrentSemesterContext.semester == 1 && (currentMonth >= 8 && currentMonth <= 12)){
        // console.log("if 1")
          return true;
      }
      if(CurrentSemesterContext.semester == 2 && (currentMonth >= 1 && (currentMonth <= 5 && currentDay <= 15)) ){
        // console.log("if 2")
        return true;
      }
      if(CurrentSemesterContext.semester == "summer" && ((currentMonth >= 5 && currentDay >= 15) && (currentMonth <= 7))){
        // console.log("if 3")
        return true;
      }
      else{
        // console.log("else")
        return false;
      }
    }    

    // Memeriksa apakah tanggal saat ini sesuai dengan semester
    const isCurrentDateInSemesterResult = isCurrentDateInSemester(); // Hasilnya akan true jika tanggal saat ini sesuai dengan salah satu semester yang Anda tentukan.
    //end 

  return (
    <View style={styles.container}>
          <View style={styles.container}>
            {isVisible && (
              <View style={styles.flashContainer}>
                <Text style={styles.flashMessage}>{message}</Text>
              </View>
            )}
        </View>
      {/* Header */}
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[styles.containerHeader.startGradient,styles.containerHeader.endGradient]} style={styles.containerHeader}>
            {isVisible && (
               <View style={styles.flashContainer}>
                   <Text style={styles.flashMessage}>{message}</Text>
                </View>
            )}
            <View style={styles.childContainerHeader1}>
                    <View>
                         {/* ini view bayangan */}
                    </View>
                    <View>
              {
                state?.role === 'Vice President' || state?.role === 'President' || state?.role === 'Secretary' ?
                <MyModal
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  CurrentSemester={CurrentSemesterContext}
                  updateCurrentSemester={updateCurrentSemester}
                />
                :
                <Text style={{color:'white'}} >
                {
                Object.keys(CurrentSemesterContext).length === 0 ?
                `School Year: - semester : -`:
                `School Year: ${CurrentSemesterContext.schoolYear}, Semester : ${CurrentSemesterContext.semester}`
                }
                </Text>
              }
                </View>
                <TouchableOpacity onPress={()=>props.navigation.navigate('SettingScreen')}>
                      <SettingIcon/>
                </TouchableOpacity>
            </View>
            <View style={ styles.childContainerHeader2}>
                <View style={styles.containerProfile}>
                    <View style={{flex: 1}}>
                      <View style={styles.nameUserContainer}>
                        <View>
                          <Text style={styles.textUserContainer}>
                            {state?.firstName? state.firstName + ' ' : '-' + ' '}
                            {state?.lastName ? state.lastName : '-' }
                            </Text>  
                        </View>
                      <Text>
                        {/* view bayangan */}
                      </Text>
                      <Text>
                        {/* view bayangan */}
                      </Text>
                      </View>
                      <View  style={{flexDirection:'row', flex: 1, alignItems:'center', justifyContent:'space-around'}}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:placeholderColor.color}}>{state?.userName}</Text>
                              <Gap width={10}/>
                              <View style={{height: 7, width: 7, borderRadius:3.4, backgroundColor: state?.status === 'true' ? '#3ACBA9' : '#D49FB9'}}></View>
                          </View>
                          <Text>{/* text bayangan */}</Text>
                          <Text>{/* text bayangan */}</Text>
                        </View>  
                      <Gap height={10}/>
                      <View style={styles.infoUserContainer}>
                        <View style={[styles.activeUserContainer, { flexDirection:'row', justifyContent:'center'}]}> 
                          <Text style={styles.textDivisionUser}>{state?.role }</Text>
                        </View>
                        <View style={styles.divisionUserContaier}> 
                          <Text style={styles.textDivisionUser}>{state?.division == "undefined" ? '-': state?.division}</Text>
                        </View>
                      </View>
                    </View>
                </View>
            </View>
      </LinearGradient>

      {/* Body */}
      <Gap height={22}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems:'center'}}>
          <View style={{width: windowWidth}}>
            <View>
                <Text style={styles.textYourAttendance}>Your Attendance</Text>
            </View>
            <Gap height={20}/>
            {/* [ styles.dateText, {fontFamily: fontFamilyRegular.fontFamily}] */}
            <View style={styles.Container2}>
                <View>
                  <Text style={styles.textAttendance}>Activate your location to record your attedance</Text>
                </View>
                <Gap height={22}/>
                <View>
                <Button
                    styleContainer={styles.buttonContainer}  
                    onPress={()=>sendLocation()} 
                    name = 'Send Your Location' 
                    color= '#FCFCFC' 
                    size={fontSizeSmall.fontSize} 
                    fontFamily={fontFamilyRegular.fontFamily} 
                    textAlign ='center'
                  />
                </View>
                <View>
                </View>
            </View>
          </View>
        </View>
        {
        isCurrentDateInSemesterResult && isCurrentDateInSchoolYear && (state?.role === 'President' || state?.role === 'Vice President' || state?.role === 'Treasure' || state?.role === 'Secretary')?
            <>
              <Gap height={52}/>
              <View style={{alignItems:'center'}}>
          <View style={{width: windowWidth}}>
            <View>
                <Text style={styles.textYourAttendance}>Create Absen</Text>
            </View>
            <Gap height={20}/>
            {/* [ styles.dateText, {fontFamily: fontFamilyRegular.fontFamily}] */}
            
            <View style={styles.Container2}>
                <View>
                  <Text style={styles.textAttendance}>Create new Absension by Location</Text>
                </View>
                <Gap height={22}/>
                <Button 
                    styleContainer={styles.buttonContainer} 
                    onPress={()=>props.navigation.navigate('CreateAbsenScreen')} 
                    name = 'Go to Create Absen' 
                    color= '#FCFCFC' 
                    size={fontSizeSmall.fontSize} 
                    fontFamily={fontFamilyRegular.fontFamily} 
                    textAlign ='center'
                />
             </View>
             </View>
             </View>
            </>          
      :null  
      }
        <Gap height={52}/>
        <View style={{alignItems:'center'}}>
        <View style={{width: windowWidth}}>
            <View>
                {/* <Text style={styles.textLeadInWorship}>Lead In Worship Today</Text> */}
            </View>
            <Gap height={20}/>
            {/* <View style={styles.Container2}> */}
            <View>
                <View style={styles.containerLeadInWorship2}>
                    {/* <Text style={styles.textLeadInWorship2}>Devotion</Text> */}
                    {/* <Text style={styles.textLeadInWorship3}>-</Text> */}
                </View>
                <Gap height={22}/>
                <View style={styles.containerLeadInWorship2}>
                    {/* <Text style={styles.textLeadInWorship2}>MC</Text> */}
                    {/* <Text style={styles.textLeadInWorship3}>-</Text> */}
                </View>
            </View>
          </View>
        </View>
        <Gap height={30}/>
      </ScrollView>
    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: backGroundColor.color,
    flex: 1
  },

  //header
  containerHeader:{
    startGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.80)`,
    endGradient: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, ${mainColor.a})`,
    width: '100%',
    height: 200,
    borderBottomRightRadius: firstPageBorder.borderRadius,
    borderBottomLeftRadius: firstPageBorder.borderRadius,
    flexDirection:'column',
    // justifyContent:'space-between',

  },
  childContainerHeader1:{
      flexDirection:'row', 
      justifyContent:'space-between',
      marginTop: 14,
      // backgroundColor:'red',
      alignItems:'center',
      marginHorizontal: '7%'
  },
  childContainerHeader2:{
      // backgroundColor:'red',
      alignItems:'center', 
      flex: 1, 
      justifyContent:'center',
    },
  containerProfile:{
    width: widthComponent.width,
    height: 110,
    backgroundColor: secondColor.color,
    borderRadius: firstPageBorder.borderRadius,
    padding: 19,
    flexDirection:'row',
  },
  dateText:{
    color:secondColor.color,
    fontSize: fontSizeMedium.fontSize,
    fontFamily: fontFamilyRegular.fontFamily
  },
  dummyImage:{width: 60, height: 60, borderRadius: 60},
  nameUserContainer:{flexDirection:'row', flex: 1,  alignItems:'center', justifyContent:'space-around', marginBottom:-2},
  textUserContainer:{fontSize:fontSizeBig.fontSize, fontFamily:fontFamilyMedium.fontFamily, color:blackColor.color},
  infoUserContainer: {flexDirection:'row', flex: 1, alignItems:'center', justifyContent:'space-around'},
  activeUserContainer:{height: 26, maxWidth: '50%', paddingVertical:4, backgroundColor: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.05)`, borderRadius: 5 },
  textActiveUser:{fontFamily:fontFamilyMedium.fontFamily, color:'#3ACBA9', fontSize:fontSizeSmall.fontSize},
  divisionUserContaier:{height: 26, width: '35%', paddingVertical:4, alignItems:'center', backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.05)`, borderRadius: 5 },
  textDivisionUser:{fontFamily:fontFamilyMedium.fontFamily, color:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.7)`, paddingHorizontal: 4},
  buttonContainer:{backgroundColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 1)`, height: 39, borderRadius: 10, justifyContent:'center'},
  //body
  //part 1
  textYourAttendance:{fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeMedium.fontSize, color:blackColor.color},
  Container2:{paddingHorizontal: 45, paddingVertical: 23, backgroundColor:secondColor.color, borderWidth: 1, borderColor: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.30)`, borderRadius:10},
  textAttendance:{fontFamily:fontFamilyRegular.fontFamily, fontSize: fontSizeSmall.fontSize, color:blackColor.color},
  //part2
  textLeadInWorship:{fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeMedium.fontSize, color:blackColor.color},
  containerLeadInWorship:{paddingHorizontal: 45, paddingVertical: 23,  backgroundColor:secondColor.color, borderWidth: 1, borderColor: `rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.30)`, borderRadius:10},
  containerLeadInWorship2:{borderWidth: 1, borderColor:'#F0F1F3', height:53, borderRadius: 10, paddingHorizontal: 19, paddingVertical:8},
  textLeadInWorship2:{fontFamily:fontFamilyRegular.fontFamily, fontSize: fontSizeSmall.fontSize, color:blackColor.color},
  textLeadInWorship3:{fontFamily:fontFamilyMedium.fontFamily, fontSize: fontSizeSmall.fontSize, color:blackColor.color},
  flashContainer: {
    // padding: 20,
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