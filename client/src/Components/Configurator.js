import React from 'react';
import { Button, Form, Jumbotron, Col, Dropdown, Alert } from 'react-bootstrap';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import API from '../API/API';

/*Configurator component is the main component to make the user 
- set Rent details, 
- check for car that satisfies user constraints availability, 
- check the final price 
- proceed with the payment*/

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { //From date to unlimited_km, these state variables are used to control form input
                       date: '',
                       n_days: '',
                       cat: '', 
                       age: '', 
                       ex_drivers: '', 
                       ex_insurance: false, 
                       km: 0, 
                       unlimited_km: false, 

                       validated: false, //Boolean variable to use form validation mechanism 
                       redir: false, //Boolean variable used to redirect to PaymentForm view, set to true when all the input are filled correctly
                       available: 0, //Number of available cars with the user defined constraints
                       final_price: 0, //Final price = price_per_day*n_days*additional_discount/increase 
                       vehicle_id: '', //String variable that represents vehicle ID of the first vehicle that satisfies user constraints
                       invalid_query: false //Boolean variable to represent if server connection is successful (used to decide if prompt an alert or not)
                    }
    }
    render() {
        return (
            <>
                {this.props.user !== '' ? //If there's a logged user, then Configurator is shown
                    <>
                        <Col sm={6} bg="light" className="mx-auto below-nav">
                            {this.state.invalid_query === true ? <Alert variant='danger'>Server connection issue happened.</Alert> : null}
                            <Jumbotron className='jmb'>
                                <h1>Rent Configurator</h1>
                                <Form noValidate validated={this.state.validated} onSubmit={(ev) => { this.handleSubmit(ev) }}>
                                    <Form.Label><br />Select starting and ending day:</Form.Label>
                                    <DateRangePicker
                                        required={true}
                                        name='date'
                                        onChange={(ev) => { this.updateField('date', ev) }}
                                        value={this.state.date}
                                        minDate={new Date()} />
                                    {!this.state.date ? <p className='invalid-p'><b>Please, provide start and end date.</b></p> : null}
                                    <br />
                                    <Form.Label>Select car category:</Form.Label>
                                    <Dropdown required style={{ borderColor: this.state.someValidationError ? "#b94a48" : "#aaa" }} >
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            {this.state.cat}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#" onClick={(ev) => { this.updateField('cat', ev.currentTarget.innerHTML) }}>A</Dropdown.Item>
                                            <Dropdown.Item href="#" onClick={(ev) => { this.updateField('cat', ev.currentTarget.innerHTML) }}>B</Dropdown.Item>
                                            <Dropdown.Item href="#" onClick={(ev) => { this.updateField('cat', ev.currentTarget.innerHTML) }}>C</Dropdown.Item>
                                            <Dropdown.Item href="#" onClick={(ev) => { this.updateField('cat', ev.currentTarget.innerHTML) }}>D</Dropdown.Item>
                                            <Dropdown.Item href="#" onClick={(ev) => { this.updateField('cat', ev.currentTarget.innerHTML) }}>E</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {!this.state.cat ? <p className='invalid-p'><b>Please, provide car category.</b></p> : null}
                                    <Form.Row>
                                        <Col>
                                            <Form.Label>Driver's age</Form.Label>
                                            <Form.Control type='number' required name='age' value={this.state.age} onChange={(ev) => { ev.target.value = Math.max(0, parseInt(ev.target.value)).toString().slice(0, 3)/*force the value to be 3 digit*/; this.updateField(ev.target.name, ev.target.value) }} min='18' max='100' />
                                            <Form.Control.Feedback type='invalid'><p className='invalid-p'><b>Driver age has to range between 18 and 100.</b></p></Form.Control.Feedback>
                                        </Col>
                                        <Col>
                                            <Form.Label>Number of extra drivers:</Form.Label>
                                            <Form.Control type='number' required name='ex_drivers' value={this.state.ex_drivers} onChange={(ev) => { ev.target.value = Math.max(0, parseInt(ev.target.value)).toString().slice(0, 2)/*force the value to be 3 digit*/; this.updateField(ev.target.name, ev.target.value) }} min='0' max='10' />
                                            <Form.Control.Feedback type='invalid'><p className='invalid-p'><b>Number of extra drivers has to range between 0 and 10.</b></p></Form.Control.Feedback>
                                        </Col>
                                    </Form.Row>
                                    <br />
                                    <Form.Row>
                                        <Col>
                                            <Form.Group controlId="formBasicCheckbox1">
                                                <Form.Check name='unlimited_km' type="checkbox" label="Unlimited kilometers" checked={this.state.unlimited_km} onChange={(ev) => { this.updateField(ev.target.name, ev.target.checked) }} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Label>Estimated kilometers per day:</Form.Label>
                                            <RangeSlider name='km' value={this.state.km} variant='dark' onChange={(ev) => { this.updateField('km', parseInt(ev.target.value)) }} min={0} max={150} disabled={this.state.unlimited_km/*range slider is disabled if unlimited kilomers is checked*/} step={10}></RangeSlider>
                                            {this.state.km === 0 && this.state.unlimited_km === false ? <p className='invalid-p'><b>Please, provide km per day.</b></p> : null}
                                        </Col>
                                    </Form.Row>
                                    <Form.Group controlId="formBasicCheckbox2">
                                        <Form.Check name='ex_insurance' type="checkbox" label="Extra insurance" checked={this.state.ex_insurance} onChange={(ev) => { this.updateField(ev.target.name, ev.target.checked) }} />
                                    </Form.Group>
                                    {this.state.redir === true ? <Redirect to='/user/configurator/payment' /> : null}
                                    <Button variant="primary" type="submit" className="btn-sbt" disabled={this.state.available > 0 /*button is disabled if there are not available vehicles*/? false : true}>
                                        Rent!
                                    </Button>
                                    {!this.state.available > 0 ? <p className='invalid-p'><b>There are no cars available with this parameters.</b></p> : null}
                                </Form>
                            </Jumbotron>
                        </Col>
                        <Col sm={6} bg="light" className="mx-auto below-nav">
                            <Jumbotron className='jmb'>
                                <p><b>Rent period:   </b>{this.state.date ? `${moment(this.state.date[0]).format('dddd, MMMM Do YYYY')}-${moment(this.state.date[1]).format('dddd, MMMM Do YYYY')}` : '-'}<br /><small>{this.state.n_days} day/s</small></p>
                                <p><b>Car category:   </b>{this.state.cat}</p>
                                <p><b>Driver's age:   </b>{this.state.age}</p>
                                <p><b>Number of extra drivers:   </b>{this.state.ex_drivers}</p>
                                <p><b>Kilometers per day:   </b>{this.state.unlimited_km === true ? 'Unlimited' : `${this.state.km} km (total: ${(this.state.km * this.state.n_days)} km)`}</p>
                                <p><b>Extra insurance:   </b>{this.state.ex_insurance === true ? 'Yes' : 'No'}</p>
                                <br />
                                <p><b>Available cars:   </b>{this.state.available !== '' ? this.state.available : '-'}</p>
                                <p><b>Final price:   </b>{this.state.final_price}€ </p>
                            </Jumbotron>
                        </Col>
                    </>
                    : null}
            </>)
    }
    updateField = (name, value) => { //General function to update state variables 
        if (name === 'date' && value) {
            this.setState({ n_days: (moment(value[1]).diff(moment(value[0]), 'days') + 1) });
        }
        this.setState({ [name]: value }, () => { this.evaluatePrice() });//After the state variable update, evaluatePrice function is called 
    }
    
    //Function to evaluate price based on provided constraints by the user 
    evaluatePrice = () => {
        let final_price;
        let discount = [];
        switch (this.state.cat) {
            case "A":
                final_price = 80;
                break;
            case "B":
                final_price = 70;
                break;
            case "C":
                final_price = 60;
                break;
            case "D":
                final_price = 50;
                break;
            case "E":
                final_price = 40;
                break;
            default:
                break;
        }
        final_price = final_price * this.state.n_days;
        if (this.state.unlimited_km) {
            discount.push(final_price * (5 / 100));
        }
        else if ((this.state.km) < 50) {
            discount.push(final_price * (-5 / 100));
        }
        if (this.state.age < 25) {
            discount.push(final_price * (5 / 100));
        }
        if (this.state.age > 65) {
            discount.push(final_price * (10 / 100));
        }
        if (this.state.ex_drivers > 0) {
            discount.push(final_price * (15 / 100));
        }
        if (this.state.ex_insurance) {
            discount.push(final_price * (20 / 100));
        }
        if (this.state.cat !== '' && this.state.date !== '') { //As soon as category and date range are available, the function query the server to obtain garage availability
            API.getGarageState(this.state.cat, this.state.date).then((rent) => {//Get cars availability and store this data in state variables 
                this.setState(() => {
                    if (this.state.available !== rent.available)
                        return { vehicle_id: rent.id, available: rent.available };
                }, () => { /*after the first setState is executed available state variable and cat_count props are used 
                            to evaluate available car percentage compared to total car of the same category */
                    if (((this.state.available * 100) / (this.props.cat_count[`${this.state.cat}`])) < 10) {
                        discount.push(final_price * (10 / 100));
                    }
                    API.getPastRent(this.props.user).then((rent) => { //Check if the user has finished at least three rents
                        if (rent.total >= 3) {
                            discount.push(final_price * (-10 / 100));
                        }
                        discount.forEach((disc) => { final_price += disc });//All the discount are applied at this point
                        this.setState({ final_price: final_price ? final_price.toFixed(2) : 0 }) //final_price state variable is updated 
                    }).catch(() => { this.setState({ invalid_query: true }) });
                });
            }).catch(() => { this.setState({ invalid_query: true }) });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;
        if (form.checkValidity() && (this.state.km !== 0 || this.state.unlimited_km === true)) { //If all the details are provided properly
            this.setState({ redir: true });
            let rent = { ...this.state };
            delete rent.available;
            delete rent.redir;
            delete rent.validated;
            this.props.addRent(rent); /*addRent function props (received by App component) is executed in order 
                                    to update rentDetails App state variable, in this way PaymentForm component receives rent details*/
        }
        else {
            this.setState({ validated: true });
        }
    };
}
export default Configurator; 