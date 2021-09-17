const express = require('express');
const dao = require('./dao.js');

//For managing jwt token within cookies
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

//Parse Cookie header and populate req.cookies
const cookieParser = require('cookie-parser');
const jwtSecretContent = require('./secret.js');
const jwtSecret = jwtSecretContent.jwtSecret;

//middleware used to validate data from the client
const { check, validationResult } = require('express-validator');
const PORT = 3001;
const BASEURL = '/api';
app = new express();

//middleware to parse incoming json objects
app.use(express.json());

//Rest API endpoints 

//Resources: cars and rents

// POST /login
// Request body: object describing user credentials { uname, uname}
// Response body: object describing user { userID, name}
app.post(BASEURL + '/login', [check('uname').exists(), check('passw').exists()], (req, res) => {
  //First, validate incoming data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  //create and send JWT token
  dao.checkPassword(req.body.uname, req.body.passw).then(
    (user) => {
      const token = jsonwebtoken.sign({ userID: user.userID }, jwtSecret, { expiresIn: 3600 }); //token expires in 3600s (=1 hour)
      res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * 3600 }); //set response cookie
      res.json(user); //set response json body
    }
  ).catch(
    // Delay response when wrong user/pass is sent to avoid fast guessing attempts
    () => new Promise((resolve) => {
      setTimeout(resolve, 1000)
    }).then(
      () => res.status(401).end()
    )
  );
});
app.use(cookieParser());

// POST /logout
// Request body: empty
// Response body: empty 
//    It asks the browser to delete its token containing authentication rights
app.post(BASEURL + '/logout', (req, res) => {
  res.clearCookie('token')
  res.status(200).end()
});

// GET /cars
// Request body: empty
// Response body: Array of objects, each describing Cars
// Errors: return a json object representing the kind of error encountered
app.get(BASEURL + '/cars', (req, res) => {
  dao.getCars()
    .then((cars) => { res.json(cars); })
    .catch(() => { res.status(500).json({ 'error': 'there are no cars available' }); });
});

//Middleware to declare that the following API methods can be fetched only by authenticated clients
app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
  })
);

// GET /isAuth
// Request body: empty
// Response body: json object containing username {username}
// Errors: return a json object representing the kind of error encountered
app.get(BASEURL + '/isAuth', (req, res) => {
  const uid = req.user && req.user.userID;
  dao.getUserById(uid)
    .then((user) => {
      user.exp = req.user.exp;
      res.json(user);
    })
    .catch(() => { res.status(500).json({ 'error': err }); });
});

// POST /user/configurator/availability
// Request body: object describing an Rental date and category details { cat, date }
// Response body: object descibing garage availability {#available, available_vehicle_id }
// Errors: return a json object representing the kind of error encountered
app.post(BASEURL + '/user/configurator/availability', [check('cat').exists(), check('date').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  dao.getAvailableCars(req.body.cat, req.body.date)
    .then((av) => { res.json(av); })
    .catch((err) => { res.status(500).json({ 'error': err }); });
});

// POST /user/configurator/history
// Request body: object describing user {username}
// Response body: object descibing user history {total}
// Errors: return a json object representing the kind of error encountered
app.post(BASEURL + '/user/configurator/history', [check('user').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  dao.getPastRent(req.body.user)
    .then((av) => { res.json(av); })
    .catch((err) => { res.status(500).json({ 'error': err }); });
});

// POST /user/configurator/payment/sendpayment
// Request body: object describing credit card details {accountholder,ccnumber,ccv}
// Response body: object descibing payment outcome {paid}
// Errors: return a json object representing the kind of error encountered
app.post(BASEURL + '/user/configurator/payment/sendpayment', [check('accountholder').exists(), check('ccnumber').exists(), check('ccv').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  res.json({ paid: true })
});

// POST /user/configurator/payment/addrent
// Request body: object describing rent details {age,age,date,ex_insurance,final_price,km,n_days,unlimited_km}
// Response body: object descibing added rent {/*attributes as above*/}
// Errors: return a json object representing the kind of error encountered
app.post(BASEURL + '/user/configurator/payment/addrent', [check('age').exists().isNumeric(), check('age').exists().isString(), check('date').exists(), check('ex_insurance').exists(), check('final_price').exists().isNumeric(), check('km').exists().isInt(), check('n_days').exists().isInt(), check('unlimited_km').exists()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  dao.addRent(req.body)
    .then((rent) => { res.json(rent); })
    .catch((err) => { res.status(500).json({ 'error': err }); });
});

// GET /rent/:user
// Parameter: username
// Response body: Array of objects, each describing user Rentals
// Errors: return a json object representing the kind of error encountered
app.get(BASEURL + '/rent/:user', (req, res) => {
  dao.getRent(req.params.user)
    .then((reserv) => { res.json(reserv); })
    .catch(() => { res.status(500).json({ 'error': 'there are no rent existent' }); });
});

// DELETE /rent/:rentID
// Parameter: username
// Response body: empty 
app.delete(BASEURL + '/rent/:rentID', (req, res) => {
  dao.deleteRentById(req.params.rentID)
    .then(() => { res.end() });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));