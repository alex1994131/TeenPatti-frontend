// import { toast } from 'react-toastify'
import config from "../../../configs/config"
import { history } from "../../../history"

export const JoinRoom = (req, position) => {
  return ( dispatch, getState )=>{
    let userinfo = getState().auth.userinfo
    config.socket.emit("JoinRoom", {roominfo:req, userinfo, position})
  }
}

export const signOut = () => {
  return () => {
    localStorage.removeItem([config.userinfo])
    history.push('/login')
  }
}

export const is_session = () => {
  if(localStorage[config.userinfo] && localStorage[config.userinfo] !== "undefined"){
    return true
  }else{
    return false
  }
}