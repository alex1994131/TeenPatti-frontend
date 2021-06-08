import jwt from "jwt-simple"
import config from "../../../configs/config"

var userinfo = localStorage[config.userinfo]
userinfo = userinfo&&userinfo!==undefined ? jwt.decode(userinfo, config.userinfo):null
const initialState = {
  userinfo: userinfo,
  isLoggedIn : false,
  userRole:'admin'
}
const auth = (state = initialState, action) => {
  switch (action.type) {

    case "LOGIN_WITH_JWT": {
      return { ...state, userinfo: action.payload,isLoggedIn: action.isLoggedIn }
    }
    default: {
      return state
    }
  }
}

export default auth