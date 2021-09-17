import Car from './Car.js'
import Rent from './Rent.js'
import moment from 'moment';

const APIURL = 'http://localhost:3000/api';

/*For the following API functions it is always used the same logic: 
- they return a Promise
- in which the fetch with the desired HTTP method and to the desired URL is performed 
- if the fetch returned promise is fullfilled and the json body of the response is extracted (its promise is fullfilled) and send back to the calling Component
- if the fetch returned promise is not fullfilled an error object is sent back to the calling Component 

Name of each functions are self explanatory
*/


async function getCars() {
    return new Promise((resolve, reject) => {
        fetch(APIURL + `/cars`).then((response) => { //if the promise returned from the fetch is fullfilled
            if (response.ok) {
                response.json()
                    .then((cars) => { resolve(cars.map((car) => Car.from(car))); }) //json promise fullfilled
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });  //json promise not fullfilled
            } else {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
            }
        }).catch((err) => //promise from fetch not fullfilled
        {
            reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
        });
    });
}

async function login(username, password) {
    return new Promise((resolve, reject) => {
        let user = { uname: username, passw: password }
        fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
            } else {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch((err) => {
            reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
        });
    });
}

async function logout() {
    return new Promise((resolve, reject) => {
        fetch(APIURL + '/logout',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            }).then((response) => {
                if (response.ok) {
                    resolve(null);
                } else {
                    response.json()
                        .then((obj) => { reject(obj); })
                        .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
                }
            }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}

async function getGarageState(cat, date) {
    date = date.map((d) => (moment(d).format('YYYY-MM-DD'))); //prepare date variables for the fetch   
    return new Promise((resolve, reject) => {
        let rent = { cat, date };
        fetch(APIURL + '/user/configurator/availability', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(rent)
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
            } else {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: err }] }) }); // connection errors
    });
}

async function getAuthUser() //checks if there's an already authenticated user
{
    return new Promise((resolve, reject) => {
        fetch(APIURL + `/isAuth`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((user) => { resolve(user); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
            } else {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch((err) => {
            reject({ errors: [{ param: 'Server', msg: err }] });
        });
    });
}

async function getPastRent(user) {
    return new Promise((resolve, reject) => {
        let req = { user };
        fetch(APIURL + '/user/configurator/history', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(req)
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
            } else {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: err }] }) });
    });
}

async function sendPayment(payment) {
    return new Promise((resolve, reject) => {
        let req = { accountholder: payment.accountholder, ccnumber: payment.ccnumber, ccv: payment.ccv }
        fetch(APIURL + '/user/configurator/payment/sendpayment', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(req)
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
            } else {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: err }] }) });
    });
}

async function addRent(rent) {
    rent.date = rent.date.map((d) => (moment(d).format('YYYY-MM-DD')));
    return new Promise((resolve, reject) => {
        fetch(APIURL + '/user/configurator/payment/addrent', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(rent)
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
            } else {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: err }] }) });
    });
}

async function getRent(user) {
    return new Promise((resolve, reject) => {
        fetch(APIURL + `/rent/${user}`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((rent) => { resolve(rent.map((rent) => Rent.from(rent))); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) });
            } else {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch((err) => {
            reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
        });
    });
}

async function deleteRent(rent) {
    let rentID = rent.currentTarget.getAttribute('id');
    return new Promise((resolve, reject) => {
        fetch(APIURL + `/rent/${rentID}`,
            {
                method: 'DELETE',
            }).then((response) => {
                if (response.ok) {
                    resolve(null);
                } else {
                    response.json()
                        .then((obj) => { reject(obj); })
                        .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
                }
            }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) });
    });
}

export default { getCars, login, logout, getGarageState, getAuthUser, getPastRent, sendPayment, addRent, getRent, deleteRent }