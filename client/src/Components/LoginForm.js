import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' } //State attributes to manage LoginForm input 
  }

  updateField = (name, value) => {
    this.setState({ [name]: value });
  }

  render() {
    return (
      <>
        {this.props.user === '' ? //Login form is not rendered if user is already logged in
          <Form onSubmit={this.doLogin}>
            {this.props.invalidLogin === true ? //If invalidLogin props received by App component is true, meaning that user credentials are wrong
              <div className="alert alert-danger" role="alert">
                Wrong email and/or password. <br />
                <small>Or a connection error occurred.</small>
              </div> : null
            }
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control required={true} name='username' value={this.state.username} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} placeholder="Enter username" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control required={true} name='password' value={this.state.password} type="password" placeholder="Password" onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} />
            </Form.Group>
            <Button className="btn-check" type="submit" >
              Login
            </Button>
          </Form>
          : <Redirect to='/user/configurator' />}
      </>)
  }

  //If LoginForm input are valid props login is executed: it receives user provided credentials and asks to the server if they are correct
  doLogin = (event) => { 
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      this.props.login(this.state.username, this.state.password);
    }
  }
}

export default LoginForm; 