import { request } from "../axios";
import { idCurrentSemester } from "../utils";

export const GetAbsencesBySemesterRequest = async (schoolYear,  semester) =>{
    const response = await request.get(`/absences?schoolYear=${schoolYear}&semester=${semester}`)
    return response.data.data;
}

export const PostAbsenRequest = async (data, navigation, showFlash) =>{
    await request.post('/absence',data)
    .then((res)=>{
            showFlash(`${res.data.message}`);
            navigation.replace('CreateAbsenScreen')
        })
      .catch((error) => {
        showFlash(`${error.response.data.message}`);
      })
}

export const DeactivatedAbsenRequest = async (id, navigation,updatedBy, showFlash) =>{
    await request.put(`/absence/deactive/${id}`,{updatedBy:updatedBy})
    .then((res)=>{
            showFlash(`${res.data.message}`);
            navigation.replace('CreateAbsenScreen')
        })
      .catch((error) => {
        showFlash(`${error.response.data.message}`);
      })
}

export const DeleteAbsenRequest = async(id, userName)=>{
  const response = await request.delete(`/absence/${id}`, {updatedBy: userName})
  return response.data;
}

export const PostStudentAttendanceRequest = async(data, userId, showFlash)=>{
  await request.post(`/postusersattendance/${userId}`,data)
  .then((res)=>{
          showFlash(`${res.data.message}`);
      })
    .catch((error) => {
      showFlash(`${error.response.data.message}`);
    })
}

export const GetAbsenceByAttendanceRequest = async(absenceId) =>{
  const response = await request.get(`/getuserabsencebyattendance/${absenceId}`)
  return response.data.data;
}

export const GetCurrentSemesterRequest = async ()=>{
  const response = await request.get(`/currentsemester/${idCurrentSemester}`)
    return response.data.data;
}

export const UpdateCurrentSemesterRequest = async (selectedItem,setCurrentSemesterContext,setModalVisible,showFlash, setSelectedItem) =>{
  await request.put(`/currentsemester/${idCurrentSemester}`,selectedItem)
   .then(async(e)=>{
    //  console.log(e)
     setCurrentSemesterContext({
       schoolYear: e.data.data.schoolYear, 
       semester :e.data.data.semester,
   })
   setModalVisible(false)
   showFlash(e.data.message)
   setSelectedItem({schoolYear:'',semester:''})
   })
   .catch((e)=>{
    showFlash(`${error.response.data.message}`);
   })
}

export const GetUserAttendanceHistoryRequest = async (schoolYear,semester,id) =>{
  const response = await request.get(`/getuserfilterattendance/?schoolYear=${schoolYear}&semester=${semester}&userId=${id}`)
  return response.data.data;
}

export const GetUserAllAbsenceRequest = async (schoolYear,semester) =>{
  const response = await request.get(`/getusersallsattendance?schoolYear=${schoolYear}&semester=${semester}`);
  return response.data.data;
}

export const UpdateUserAbsenceRequest = async (selectedItem, userName) =>{
   response = await request.put(`/edituserattendance/${selectedItem.userId}`,{ 
    presence:selectedItem.presence, 
    attendanceId: selectedItem.dateId,
    // schoolYear, 
    reg_by: userName
  })
  console.log("response:",response.data)
  return response.data;
}


export const SignUpRequest = async (newUser, showFlash,navigation, setLoading ) =>{
  await request.post(`/registration`,newUser)
    .then(function (response) {
        showFlash(response.data.message)
        setLoading(false)
        if(response.data.message == 'Registration Success'){
        return navigation.replace('LogInScreen')
        }
    })
    .catch(function (error) {
      setLoading(false)
      showFlash(`${error.response.data.message}`);
    });
}

export const LogInRequest = async (userLogin) =>{
 const response = await request.post(`/login`,userLogin)
  return response;
}

export const ForgotPasswordRequest = async (userLogin) =>{
 const response = await request.put(`/forgotpassword`,userLogin)
  return response;
}

export const SendEmailRequest = async (value) =>{
 const response = await request.post(`/sendemail`,value)
  return response;
}

export const UpdateProfileRequest = async (idUser, data) =>{
  const response = await request.put(`/user/${idUser}/update`,data)
   return response;
 }