import React, { useState, useEffect } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import {Gap, Button } from "../components";
import { fontSizeSmall, fontFamilyRegular, mainColor,  fontFamilyMedium, fontSizeBig, urlEndpointAPI  } from "../utils";
import { TimeIcon } from "../assets/icon";
import { Edit, Late, OnTime, Trash } from "../assets/ilustration";
// import {ConfirmModal} from "../components/molecules";
import ConfirmModal from "../components/molecules/confirmModal/index";
import { useMyContext } from "../Context";
import { DeleteAbsenRequest, GetAbsencesBySemesterRequest } from "../request";

const Header = (props) =>{
  const { OpenListAbsen, setOpenListAbsen, ListAbsen, OpenMenuAbsen, setOpenMenuAbsen, deleteAbsen, getAPI, refreshing, state } = props

 return(    
    <View style={{flex: 1, paddingHorizontal:10, paddingTop: 10}}>
    <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
      <TouchableOpacity onPress={()=>setOpenListAbsen(!OpenListAbsen)}>
          <View style={{paddingLeft: 7, paddingBottom: 7}}>
              <TimeIcon/>
          </View>
      </TouchableOpacity>
    </View>
    <View >
      <View>
        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getAPI} />
         }
        >
          {
          OpenListAbsen?
          ListAbsen.length != 0?
          ListAbsen.map((e, i)=>{

            const dates = e.absenDate
            const date = new Date(dates);

            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
             //set up date
            //  let day =date.toLocaleDateString('en-US', {weekday: 'long'});
             let dateNumber =date.toLocaleDateString('en-US', {day: '2-digit'});
             let month =date.toLocaleDateString('en-US', {month: '2-digit'});
             let year =date.toLocaleDateString('en-US', {year: 'numeric'});
             let formattedDate = weekdays[date.getDay()] + ', ' + dateNumber + ' - ' + month + ' - ' + year;
             //end set up date

            //set up time GMT 8 (WITA)
            let utc_hours = date.getUTCHours();
            utc_hours += 8;
            date.setUTCHours(utc_hours);
            let dateString = date.toISOString();
            let timeString = dateString.slice(11, 23) + dateString.slice(26, 29);
            //end set up time
               
          return(
            <View key={i}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', height: 50}} >
                <View style={{flexDirection:'row', alignItems:'center', width:'20%'}}>
              {
                OpenMenuAbsen == i ?
                <>
                  {
                    state?.role === ('President'|| 'Secretary') ?
                  <> 
                  <Gap width={6}/>
                  <ConfirmModal
                      type ='delete' 
                      id={e._id}
                      action ={deleteAbsen}
                      buttonInfo = {<Trash/>}
                  />
                  <Gap width={6}/>
                  </>
                  :
                  null
                }
                </>
                : 
                null
              }
                  </View>
                <View style={{width: '80%', height:'100%'}}>
                  <TouchableOpacity onPress={OpenMenuAbsen == i ? ()=>setOpenMenuAbsen(null): ()=>setOpenMenuAbsen(i)} 
                   style={{ justifyContent:'center', alignItems:'center', height: '100%', width:'100%', backgroundColor:'white', borderRadius: 10, borderColor:`rgba(${mainColor.r}, ${mainColor.g}, ${mainColor.b}, 0.30)`, borderRadius:10, borderWidth:1}}>
                      <Text style={{fontFamily:fontFamilyRegular.fontFamily, fontSize:fontSizeSmall.fontSize, color:'#000000'}}>{formattedDate}</Text>
                      <Text style={{fontFamily:fontFamilyRegular.fontFamily, fontSize:fontSizeSmall.fontSize, color:'#000000'}}>{timeString}</Text>
                  </TouchableOpacity>
                </View>
             </View>
              <Gap height={10}/>
            </View>
             )
          })
          :
            <Text>tidak ada history absen</Text>
          : 
          null
          }
        </ScrollView>
      </View>

    </View >
  </View>

 )
}


const CreateAbsenScreen = (props) => {
  const { showFlash, message, isVisible, state, CurrentSemesterContext } = useMyContext();
    const [ListAbsen, setListAbsen] = useState([])
    const [OpenMenuAbsen, setOpenMenuAbsen] = useState(null)
    const [ModalShowQRCode, setModalShowQRCode] = useState(false);
    const [ValueModalShowQRCode, setValueModalShowQRCode] = useState({})
    const [OpenListAbsen, setOpenListAbsen] = useState(false)
    const [ModalConfirm, setModalConfirm] = useState(false);
    const [ IdAbsen, setIdAbsen ] = useState()
    const [ActionType, setActionType] = useState(false) // false == edit absen, true == bikin absen baru. ini untuk reusable modal date time
    const [refreshing, setRefreshing] = useState(false);

    const schoolYear = CurrentSemesterContext? CurrentSemesterContext.schoolYear: '2021-2022'
    const semester = CurrentSemesterContext? CurrentSemesterContext.semester: '1'

     
  
    const getAPI = async() =>{
      return GetAbsencesBySemesterRequest(schoolYear, semester)
      .then(setListAbsen)
      // .catch( (error)=>{
      //   showFlash("failed:",error)
      // });
    }
    
    const deleteAbsen = async (id) =>{
     return DeleteAbsenRequest(id, state.userName)
      .then((response)=>{
        showFlash(response.message);
        getAPI()
      })
      // .catch((e)=>{
      //   showFlash("failed:",e);
      // })
    }

    useEffect(() => {
      GetAbsencesBySemesterRequest(schoolYear, semester)
      .then(setListAbsen)
      .catch( (error)=>{
        showFlash("failed:",error)
      });
    }, [])
    
  return (
    <>
    {isVisible && (
              <View style={styles.flashContainer}>
                  <Text style={styles.flashMessage}>{message}</Text>
              </View>
          )}

      <View style={{height:'70%'}}>
        {/* Header */}
      <Header 
        state={state} // role
        OpenListAbsen={OpenListAbsen} 
        setOpenListAbsen={setOpenListAbsen} 
        ListAbsen={ListAbsen}
        setListAbsen={setListAbsen}
        OpenMenuAbsen={OpenMenuAbsen}
        setOpenMenuAbsen={setOpenMenuAbsen}
        setModalShowQRCode={setModalShowQRCode}
        ModalShowQRCode={ModalShowQRCode}
        setValueModalShowQRCode={setValueModalShowQRCode}
        deleteAbsen={deleteAbsen}
        setIdAbsen={setIdAbsen}
        setModalConfirm={setModalConfirm}
        ModalConfirm={ModalConfirm}
        setActionType={setActionType}
        getAPI={getAPI}
        refreshing={refreshing}
      />
      </View>

      {/* Footer */}
      {
     state?.role === 'Vice President' || state?.role === 'President' || state?.role === 'Secretary' ?
          <View style={{ 
            flexDirection:'column', 
            justifyContent:"center", 
            height:'30%', 
            // backgroundColor:'salmon'
            }}>

        {
                // latestAbsen={ListAbsen[0]}
            ListAbsen.length === 0 ?
            <View>
                <ConfirmModal
                  action={()=>props.navigation.replace('MapScreen')}
                  type='create'
                  buttonInfo="Create Absen"
                />
              </View>
              :
              ListAbsen[0].isActive === true ?
              <Button 
                styleContainer={styles.buttonContainer} 
                onPress={()=>props.navigation.replace('MapScreen',{
                  value: {
                    id:ListAbsen[0]._id,
                    absenDate: ListAbsen[0].absenDate,
                    isActive: ListAbsen[0].isActive,
                    lateTolerance: ListAbsen[0].lateTolerance,
                    latitude: ListAbsen[0].latitude,
                    longitude: ListAbsen[0].longitude,
                    radius: ListAbsen[0].radius,
                  } 
                })}
                name = 'View Absence' 
                color= '#FCFCFC' 
                // size={fontSizeSmall.fontSize} 
                // fontFamily={fontFamilyRegular.fontFamily} 
                textAlign ='center'
            />   
              :
              <View>
                  <ConfirmModal
                    action={()=>props.navigation.replace('MapScreen')}
                    type='create'
                    buttonInfo="Create Absen"
                  />
                </View>
          }
        </View>
        :
        null
      }
    </>
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
  flashContainer: {
    // padding: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 0,
    marginBottom: 0,
  },
  flashMessage: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CreateAbsenScreen;