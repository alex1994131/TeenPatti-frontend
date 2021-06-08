import React from "react"
import Router from "./Router"
import "./components/@vuexy/rippleButton/RippleButton"
import "react-toggle/style.css"
import 'react-toastify/dist/ReactToastify.css'
import 'react-image-crop/dist/ReactCrop.css'
import "./assets/scss/pages/authentication.scss"
import "./assets/scss/plugins/extensions/react-paginate.scss"
import "./assets/scss/plugins/forms/switch/react-toggle.scss"
import "./assets/scss/pages/data-list.scss"
import "./assets/scss/components/app-loader.scss"

import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"

const App = props => {
  return <Router />
}

export default App
  