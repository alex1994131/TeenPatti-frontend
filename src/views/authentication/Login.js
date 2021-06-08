import React from "react"
import { Button, Card, CardBody, Row, Col, Form, FormGroup, Input, Label } from "reactstrap"
import { Mail, Lock, Check } from "react-feather"
import { history } from "../../history"
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Images } from "../../constants"
import config from "../../configs/config"

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTab: "1",
      email : "",
      password: ""
    }
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  handleLogin = e => {
    e.preventDefault()
    config.socket.emit("Login", {
      email : this.state.email,
      password : this.state.password
    })
  }

  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col sm="8" xl="7"  md="8" lg="10" className="d-flex justify-content-center">
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="7" className="p-0 align-self-center">
                <img className='w-100' src={Images.start_logo} alt="loginImg" />
              </Col>
              <Col lg="5" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2">
                  <CardBody>
                    <h4>Login</h4>
                    <p>Welcome back, please login to your account.</p>
                    <Form onSubmit={this.handleLogin}>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          required
                          type="email"
                          placeholder="Email"
                          value={this.state.email}
                          onChange={e => this.setState({ email: e.target.value })}
                        />
                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        <Label>Email</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          required
                          type="password"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={e => this.setState({ password: e.target.value })}
                        />
                        <div className="form-control-position">
                          <Lock size={15} />
                        </div>
                        <Label>Password</Label>
                      </FormGroup>
                      <FormGroup className="d-flex justify-content-between align-items-center">
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label="Remember me"
                        />
                        <div className="float-right">
                          Forgot Password?
                        </div>
                      </FormGroup>
                      <div className="d-flex justify-content-between">
                        <Button className='w-100 square mr-1' color="primary" outline onClick={() => history.push("/register")}>
                          Register                           
                        </Button>
                        <Button className='w-100 square ml-1' color="primary" type="submit">
                          Login 
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Login
