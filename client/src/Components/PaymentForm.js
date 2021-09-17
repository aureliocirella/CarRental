import React from 'react';
import {Col, Button, Form,ButtonGroup,Jumbotron,Alert} from 'react-bootstrap';
import {Link,Redirect} from 'react-router-dom';
import API from '../API/API';

class PaymentForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {validated:false, //Boolean variable to define if form is correctly filled 
                    accountholder:'', //String variable to represent accountholter name and surname
                    ccnumber:'', //String variable to represent CC number
                    ccv:'', //String variable to represent CCV number
                    paid:false, //Boolean variable set to true after payment is successful, it makes Redirect to RentList component view 
                    invalidPayment:false //Boolean variable that represent if payment is successfull, if it's true an alert is prompted
                }
    }

    render(){
        return <>
        <Col sm={4} bg="light"className="mx-auto below-nav">
        {this.state.invalidPayment===true?<Alert variant='danger'>Payment details not accepted.</Alert>:null}
            <Jumbotron>
                <h2>Payment details</h2>
                <Form noValidate validated = {this.state.validated} onSubmit={(ev)=>{this.handleSubmit(ev)}}>
                    <Form.Group>
                        <Form.Label>Accountholder</Form.Label>
                        <Form.Control name='accountholder' value={this.state.accountholder} type="text" required placeholder="Enter name and surname" onChange={(e) => this.updateField(e.target.name, e.target.value)}/>
                        <Form.Control.Feedback type = 'invalid'>This field is required.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Credit card number:</Form.Label>
                        <Form.Control name='ccnumber' value={this.state.ccnumber} type='number' min={1000000000000000} onChange = {(e) =>{e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,16)/*force the value to be 16 digit*/; this.updateField(e.target.name, e.target.value)}} required placeholder="Enter CC number" />
                        <Form.Control.Feedback type = 'invalid'>Sixteen digit number is required.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>CCV:</Form.Label>
                        <Form.Control name='ccv' value={this.state.ccv} type='number' min={100} onChange = {(e) =>{e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)/*force the value to be 3 digit*/;this.updateField(e.target.name, e.target.value)}} required placeholder="Enter CCV number" />
                        <Form.Control.Feedback type = 'invalid'>Three digit number is required.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label style={{'float':'right','fontSize':'20px'}}>Total: <b>{this.props.rentDetails.final_price}€</b></Form.Label>
                    </Form.Group>
                    <Link to='/user/configurator'>
                        <ButtonGroup className="mr-2">
                            <Button variant="secondary">Close</Button>
                        </ButtonGroup></Link>
                    {this.state.paid===true?<Redirect to='/user/rentlist'/>:null}
                        <ButtonGroup className="mr-2">
                            <Button type="submit" className = "btn-sbt">Pay</Button>
                        </ButtonGroup>
                </Form>
            </Jumbotron>
        </Col>
        </>
    }

    updateField = (name, value)=>{
        this.setState({[name]: value })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        if(form.checkValidity())
        {
            API.sendPayment(this.state).then((rent)=>{
                this.setState({paid:rent.paid})
                this.props.rentDetails.user=this.props.user;
                API.addRent(this.props.rentDetails).then(()=>{this.props.reInitList()});//If payment is successful rent is stored to the server database
            }).catch(()=>{
                this.setState({invalidPayment:true})
            });
        }
        else 
        {
          this.setState({validated: true}); 
        }
    };
}

export default PaymentForm