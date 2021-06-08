import React from "react"
// import { Images } from "../../../constants"
class ComponentSpinner extends React.Component {
  render() {
    return (
      <div className="fallback-spinner vh-100">
        <style dangerouslySetInnerHTML={{__html: `body{overflow:hidden;}`}}></style>
        <div className="loading">
          {/* <div style={{background:`url(${Images.loading2})`}} className="effect-1 effects"></div> */}
        </div>
      </div>
    )
  }
}

export default ComponentSpinner
