import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Layout } from "./utility/context/Layout"
import { store } from "./redux/storeConfig/store"
import Spinner from "./components/@vuexy/spinner/Fallback-spinner"
import "./index.scss"

const LazyApp = lazy(() => import("./App"))

ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <Layout>
            <LazyApp />
        </Layout>
      </Suspense>
    </Provider>,
  document.getElementById("root")
)