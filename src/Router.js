import React, { Suspense, lazy } from "react"
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import { connect } from "react-redux"
import { history } from "./history"
import { ContextLayout } from "./utility/context/Layout"
import { is_session, socket_connect } from "./redux/actions/auth"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"

const login = lazy(() => import("./views/authentication/Login"))
const register = lazy(() => import("./views/authentication/Register"))
const Home = lazy(() => import("./views/Home"))
const Room = lazy(() => import("./views/Room"))

const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag = fullLayout === true ? context.fullLayout : context.state.activeLayout === "horizontal" ? context.horizontalLayout : context.VerticalLayout
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)

const mapStateToProps = state =>({
  user: state.auth.userRole
})
const AppRoute = connect(mapStateToProps)(RouteConfig)

const RequireAuth = (data) =>(
  !is_session()?<Redirect to={'/login'} />:data.children
)

class AppRouter extends React.Component {
  componentDidMount(){
    this.props.socket_connect()
  }
  render() {
    return (
      <Router history={history}>
        <Switch>
          <AppRoute path="/login" component={login} fullLayout />
          <AppRoute path="/register" component={register} fullLayout />
          <RequireAuth>
            <AppRoute exact path="/" component={Home} fullLayout/>
            <AppRoute path="/Room" component={Room} fullLayout/>
          </RequireAuth>
        </Switch>
        <ToastContainer/>
      </Router>
    )
  }
}

const mapStateToProp = (state) => ({
  isLoggedIn : state.auth.isLoggedIn
})

const mapDispatchToProps = {
  is_session, socket_connect
}

export default connect(mapStateToProp, mapDispatchToProps)(AppRouter)
