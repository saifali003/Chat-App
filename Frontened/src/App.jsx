import {Routes,Route, Navigate} from "react-router-dom";
import SignUp from "./pages/Signup";
import LogIn from "./pages/LogIn";
import useGetCurrentUser from "./customHooks/getCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import useGetOthersUser from "./customHooks/getOthersUsers";
import { useEffect } from "react";
import {io} from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

export default function App(){
  useGetCurrentUser()
  useGetOthersUser()
  const {userData,socket,onlineUsers} = useSelector(state=> state.user)
  const dispatch = useDispatch();
  

  useEffect(() => {
  if (userData){
    const socketio = io(serverUrl, {
    query: {
      userId: userData.user._id
    }
  });
   dispatch(setSocket(socketio))
   socketio.on("getOnlineUsers",(users)=>{
       dispatch(setOnlineUsers(users))
   })
  return () => {
    socketio.close();
  }
  }else{
    if(socket){
      socket.close();
      dispatch(setSocket(null))
    }
  }

}, [userData]);

  return(
      <Routes>
        <Route path="/signup" element={!userData? <SignUp/> : <Navigate to="/profile"/>}/>
        <Route path="/login" element={!userData? <LogIn/> : <Navigate to="/"/>}/>
        <Route path="/" element={userData? <Home/> : <Navigate to="/login"/>}/>
        <Route path="/profile" element={userData? <Profile/> : <Navigate to="/signup"/>}/>
      </Routes>
  )
}