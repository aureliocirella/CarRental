import React from 'react';
import MyNavbar from './Components/MyNavbar.js';
import Filters from './Components/Filters.js';
import CarList from './Components/CarList.js';
import LoginForm from './Components/LoginForm.js';
import Configurator from './Components/Configurator.js';
import PaymentForm from './Components/PaymentForm.js';
import RentList from './Components/RentList.js';
import { Container, Row, Col, Collapse, Button, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Link, withRouter } from 'react-router-dom';
import API from './API/API.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [], //Array of Cars object in the catalogue
      filteredcars: [], //Array of filtered Cars(passed to CarList component)
      category: [], //Array of strings representing car categories (passed to Filter component)
      brand: [], //Array of strings representing car brand (passed to Filter component)
      cat_count: [], //Object representing, for each category, how many cars are listed in the catalogue (passed to Configurator component)
      filter_brands: [], //Object representing for which brands is the main filter active, initialized by App.js and used to filter the cars
      filter_categories: [], //Object representing for which categories is the main filter active, initialized by App.js and used to filter the cars
      openMobileMenu: false, //Used to allow mobile view
      user: '', //String representing who is the authenticated user, '' if no user is logged in
      invalidLogin: false, //Boolean to represent if login credentials are valid (passed to LoginForm component and used to decide if prompt an alert or not)
      rentDetails: '', //Rent object set up by Configurator component and used by PaymentForm component to effectively store Rent details in database
      user_rent: [], //List of user Rents
      invalid_rentlist: false, //Boolean to represent if Rent list fetched from the server is available or not (passed to RentList component and used to decide if prompt an alert or not)
      invalid_carlist: false
    }; //Boolean to represent if Car list fetched from the server is available or not 
  }

  componentDidMount() {
    this.isAuth(); //Each time the App component is re-rendered this function checks if the browser has authentication token stored in local cookies
    this.initList(); //Function used to populate the following state variables: cars, filteredcars, brand, category, cat_count, filter_brands, filter_categories, invalid_carlist
  }

  isAuth() {
    API.getAuthUser().then((user) => {
      if (Object.keys(user).length !== 0) {
        this.setState({ user: user.username });
      }
    }).catch(() => { this.props.history.push('/') });
  }

  initList() {
    API.getCars().then((cars) => {
      let category = cars.map((cars) => (cars.category));
      let brand = cars.map((cars) => (cars.brand));
      brand = [...new Set(brand)]; //Create a new set collection and from it defines a new array with unique values
      category = [...new Set(category)]; //Create a new set collection and from it defines a new array with unique values
      let filter_brands = {}
      let filter_categories = {};
      //Init filter_brands and filter_categories
      brand.forEach((b) => { filter_brands[b] = false });
      category.forEach((c) => { filter_categories[c] = false });
      //Sort Cars catalogue based on brand name
      cars.sort((a, b) => { return a.brand > b.brand });
      //Count how many Cars there are for each category, needed in Configurator component to evaluate optional additional 10% on the final price 
      let cat_count = { A: 0, B: 0, C: 0, D: 0, E: 0 }
      cars.forEach((car) => {
        cat_count[`${car.category}`]++;
      })
      this.setState({ cars, filteredcars: cars, brand, category, cat_count, filter_brands, filter_categories, invalid_carlist: false });
    }).catch(() => { this.setState({ invalid_carlist: true }) });
  }

  //In this function are performed instructions that require to be performed AFTER some setState instructions. 
  componentDidUpdate(prevProps, prevState) {
    //In this case, the filters are applied explicitly after filter_* attributes are modified by the user
    if (prevState.filter_brands !== this.state.filter_brands || prevState.filter_categories !== this.state.filter_categories) {
      this.setState(() => {
        let cars = this.state.cars;
        let filter_brands = this.state.filter_brands;
        let filter_categories = this.state.filter_categories;
        let all_cat = true;
        for (const cat in filter_categories) {
          if (filter_categories[cat] === true)//if there's at least one filter on Category
            all_cat = false;
        }
        let all_brand = true;
        for (const brand in filter_brands) {
          if (filter_brands[brand] === true)//if there's at least one filter on Brand
            all_brand = false;
        }
        cars = cars.filter((c) => {
          //Car items are filtered considering both the case in which there are no filter set up or there are some
          return ((filter_brands[c.brand] === true || all_brand) && (filter_categories[c.category] === true || all_cat));
        });
        cars.sort((a, b) => { return a.brand > b.brand });
        return { filteredcars: cars };
      });
    }
    //This set if instruction populate Rent list when the user logs in
    if (prevState.user !== this.state.user) {
      if (this.state.user !== '') {//Making sure user is defined before fetching its Rent list
        API.getRent(this.state.user).then((rent) => {
          this.setState(() => {
            if (rent.length !== 0) {
              return { user_rent: rent }
            } else {
              return { invalid_rentlist: true }
            }
          }
          );
        }).catch(() => { this.setState({ invalid_rentlist: true }); });
      }
    }
  }

  render() {
    return (//For comment about each component, go in the component_name.js correspondent file
      <>
        <Router>
          <MyNavbar showSidebar={this.showSidebar} doLogout={this.doLogout} user={this.state.user} />
          <Container fluid>
            <Row className='vheight-100'>
              <Switch>
                <Route path='/login'>
                  <Col sm={4} bg='light' className='mx-auto below-nav'>
                    <LoginForm invalidLogin={this.state.invalidLogin} login={this.doLogin} user={this.state.user} />
                  </Col>
                </Route>
                <Route path='/user/rentlist'>
                  <Col sm={10} bg='light' className='mx-auto below-nav'>
                    <RentList user_rent={this.state.user_rent} invalid_rentlist={this.state.invalid_rentlist} reInitList={this.reInitList} />
                    <Link to='/user/configurator'>
                      <Button size='lg' className='fixed-right-bottom btn-sbt' id='addBtn' onClick={this.toggleModal}>&#43;</Button>
                    </Link>
                  </Col>
                </Route>
                <Route path='/user/configurator/payment'>
                  <Col className='collapse d-sm-block below-nav'>
                    <PaymentForm rentDetails={this.state.rentDetails} user={this.state.user} reInitList={this.reInitList} />
                  </Col>
                </Route>
                <Route path='/user/configurator'>
                  <Configurator user={this.state.user} cat_count={this.state.cat_count} addRent={this.addRent} />
                </Route>
                <Route path='/'>
                  <Collapse in={this.state.openMobileMenu}>
                    <Col sm={3} bg='light' id='left-sidebar' className='collapse d-sm-block below-nav'>
                      <Filters setFilters={this.setFilters} category={this.state.category} filter_categories={this.state.filter_categories} brand={this.state.brand} filter_brands={this.state.filter_brands} />
                    </Col>
                  </Collapse>
                  <Col sm={8} bg='light' className='below-nav'>
                    {this.state.invalid_carlist === true ? <Alert variant='danger'>Cannot retrieve car list.</Alert> : null}
                    <CarList cars={this.state.filteredcars} />
                  </Col>
                </Route>
              </Switch>
            </Row>
          </Container>
        </Router>
      </>
    );
  }

  //Function passed to Filter component used to set specified filter (Brand or Category) at true/false value and for resetting filters configuration
  setFilters = (type, value) => {
    if (type === 'reset') { //When reset, makes all the ToggleButton not active
      let btn = document.querySelectorAll('.btn-check');
      btn.forEach((el) => {
        let attr = el.getAttribute('class');
        if (attr.includes('active')) {
          attr = attr.replace('active', '');
          el.setAttribute('class', attr);
        }
      });
      this.setState(() => { //Remove filters placing their value at false
        let filter_brands = { ...this.state.filter_brands };
        let filter_categories = { ...this.state.filter_categories };
        for (const brand in filter_brands) {
          filter_brands[brand] = false;
        }
        for (const cat in filter_categories) {
          filter_categories[cat] = false;
        }
        return { filter_brands, filter_categories }
      })
    } else { //Adding new filters parameter modifying filter_* objects variable at the opposite boolean value
      let val = value.currentTarget.nextSibling.textContent;
      this.setState(() => { //After this setState, componendDidUpdate will be called and new filters parametes will be applied on main car list
        let filter_brands = { ...this.state.filter_brands };
        let filter_categories = { ...this.state.filter_categories };
        if (type === 'categories') {
          filter_categories[val] = !filter_categories[val];
          return { filter_categories };
        } else if (type === 'brands') {
          filter_brands[val] = !filter_brands[val];
          return { filter_brands };
        }
      });
    }
  }

  //Function passed to MyNavbar component to allow toggle to show or not the side bar 
  showSidebar = () => {
    this.setState((state) => ({ openMobileMenu: !state.openMobileMenu }));
  }
  /*Function passed to LoginForm component to perform the login process, it receives provided credentials and if they are correct this.state.user is filled with currently logged in user's username
  otherwise invalidLogin state variables is setup at true and LoginForm component will show an alert */
  doLogin = (username, password) => {
    this.setState({ invalidLogin: false });
    API.login(username, password).then(
      (userObj) => {
        this.setState({ user: userObj.name, invalidLogin: false });
      })
      .catch(
        () => { this.setState({ invalidLogin: true }) });
  }

  //Function passed to MyNavbar component to perform the logout process, it asks the browser to delete the 'token' cookie and it sets this.state.user at ''
  doLogout = () => {
    API.logout().then(
      () => {
        this.setState({ user: '' })
      }
    ).catch(() => { this.props.history.push('/') });
  }

  //Function passed to Configurator component and used to populate this.state.rentDetails. This state variables will be passed to PaymentForm to actually store the rent details in the server database 
  addRent = (rent) => {
    this.setState({ rentDetails: rent, invalid_rentlist: false });
  }

  //Function passed to PaymentForm component and used to re-fetch the server to get the updated Rent list
  reInitList = () => {
    API.getRent(this.state.user).then((rent) => { this.setState({ user_rent: rent }); }).catch(() => { this.setState({ invalid_rentlist: true }); });
  }
}

export default withRouter(App);
