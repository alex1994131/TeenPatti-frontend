import React from "react"
import { Card, CardHeader, CardTitle, CardBody, Row, Col, TabContent, TabPane, Form, FormGroup, Input, Label, Button } from "reactstrap"
import { Check } from "react-feather"
import { toast } from "react-toastify"
import { Images } from "../../constants"
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"
import { history } from "../../history"
import config from "../../configs/config"

class Register extends React.Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      name: "",
      username: "",
      email: "",
      mobile: "",
      refer: "",
      password: "",
      confirmPass: "",
      activeTab: "1",
    }
  }

  handleRegister = e => {
    e.preventDefault()
    if(!this.state.password||!this.state.confirmPass||(this.state.password!==this.state.confirmPass)){
      toast.error('password incorrect.')
      return
    }else{
      config.socket.emit("Register", {
        name:this.state.name,
        username:this.state.username,
        email:this.state.email,
        mobile:this.state.mobile,
        refer:this.state.refer,
        password:this.state.password,
        status:'active'
      })
    }
  }

  
  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }
  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col sm="8" xl="7" lg="10" md="8" className="d-flex justify-content-center">
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col lg="7" className="align-self-center p-0" >
                <img className="w-100" src={Images.start_logo} alt="registerImg" />
              </Col>
              <Col lg="5" md="12" className="p-0">
                <Card className="rounded-0 mb-0 p-2">
                  <CardHeader className="pb-1 pt-50">
                    <CardTitle>
                      <h4 className="mb-0">Create Account</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title mb-0">
                    Fill the below form to create a new account.
                  </p>
                  <CardBody className="pt-1 pb-50">
                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId="1">
                        <Form action="/" onSubmit={this.handleRegister}>
                          <FormGroup className="form-label-group">
                            <Input
                              type="text"
                              placeholder="Enter Name"
                              required
                              value={this.state.name}
                              onChange={e => this.setState({ name: e.target.value })}
                            />
                            <Label>Name</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Input
                              type="text"
                              placeholder="Enter Username"
                              required
                              value={this.state.username}
                              onChange={e => this.setState({ username: e.target.value })}
                            />
                            <Label>Username</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Input
                              type="email"
                              placeholder="Email"
                              required
                              value={this.state.email}
                              onChange={e => this.setState({ email: e.target.value })}
                            />
                            <Label>Email</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Input
                              type="text"
                              placeholder="Enter Mobile"
                              required
                              value={this.state.mobile}
                              onChange={e => this.setState({ mobile: e.target.value })}
                            />
                            <Label>Mobile</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Input
                              type="text"
                              placeholder="Refer Code"
                              required
                              value={this.state.refer}
                              onChange={e => this.setState({ refer: e.target.value })}
                            />
                            <Label>Refer</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Input
                              type="password"
                              placeholder="Password"
                              required
                              value={this.state.password}
                              onChange={e => this.setState({ password: e.target.value })}
                            />
                            <Label>Password</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Input
                              type="password"
                              placeholder="Confirm Password"
                              required
                              value={this.state.confirmPass}
                              onChange={e => this.setState({ confirmPass: e.target.value })}
                            />
                            <Label>Confirm Password</Label>
                          </FormGroup>
                          <FormGroup>
                            <Checkbox
                              color="primary"
                              icon={<Check className="vx-icon" size={16} />}
                              label=" I accept the terms & conditions."
                              defaultChecked={true}
                            />
                          </FormGroup>
                          <div className="d-flex justify-content-between">
                            <Button
                              className='w-100 square mr-1'
                              color="primary"
                              outline
                              onClick={() => {
                                history.push("/pages/login")
                              }}
                            >
                              Login
                            </Button>
                            <Button className='w-100 square ml-1' color="primary" type="submit">
                              Register
                            </Button>
                          </div>
                        </Form>
                      </TabPane>
                    </TabContent>
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

export default Register