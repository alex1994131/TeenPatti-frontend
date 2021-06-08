
import { toast } from 'react-toastify'
import jwt from "jwt-simple"
import io from 'socket.io-client'
import config from "../../../configs/config"
import { history } from "../../../history"

export const socket_connect = () =>{
  return (dispatch, getState)=>{
    config.socket = io(config.socket_url)
    
    if(getState().auth.userinfo){
      config.socket.emit("getPlayer",getState().auth.userinfo)
      config.socket.emit("getMyRoom",{player:getState().auth.userinfo._id})
    }

    if(config.socket){
      config.socket.on("err", async(message)=>{
        toast.error(message)
      })

      config.socket.on("Login", async(e)=>{
        var userinfo = jwt.encode(e, config.userinfo)
        localStorage.setItem(config.userinfo, userinfo)
        dispatch({ type:"LOGIN_WITH_JWT", payload:e, isLoggedIn:true})
        history.push("/")
      })

      config.socket.on("getPlayer", async(e)=>{
        if(e.status){
          dispatch({ type:"LOGIN_WITH_JWT", payload:e.result, isLoggedIn:true})
          return
        }
        signOuts()
      })

      config.socket.on("room_change", async(data) => {
        config.socket.emit("getPlayer",getState().auth.userinfo)
        if(getState().auth.userinfo){
          if(data&&data.room){
            config.socket.emit("getMyRoom", {player:getState().auth.userinfo._id, room:data.room})
          }else{
            config.socket.emit("getMyRoom", {player:getState().auth.userinfo._id, room:getState().documents.roomData._id})
          }
        }else{
          signOuts()
        }
      })

      config.socket.on("getMyRoom", async({room, players, my, newTime}) => {
        dispatch({ type:"ROOM_DATA", roomData:Object.assign({},room), playersData:players, myData:Object.assign({},my), newTime })
      })

      config.socket.on("GetRooms", async(e)=>{
        dispatch({ type:"DOCUMNETS_DATA", payload:e })
      })
      
      config.socket.on("TotalUser", async({totalPlayer, currentPlayer})=>{
        dispatch({ type:"TOTALUSER_COUNT", totalPlayer, currentPlayer })
      })
      
      config.socket.on("exitRoom", async(e)=>{
        config.socket.emit("getMyRoom",{player:getState().auth.userinfo._id})
      })
    }
  }
}

export const signOut = () => {
  return () => { signOuts() }
}

export const is_session = () => {
  if(localStorage[config.userinfo] && localStorage[config.userinfo] !== "undefined"){
    return true
  }else{
    return false
  }
}

const signOuts = () =>{
  localStorage.removeItem([config.userinfo])
  history.push('/login')
}