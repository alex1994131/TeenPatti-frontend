import { combineReducers } from "redux"
import customizer from "./customizer"
import auth from "./auth"
import documents from "./documents"

const rootReducer = combineReducers({
  customizer: customizer,
  auth: auth,
  documents: documents,
})

export default rootReducer