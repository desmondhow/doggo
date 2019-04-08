import React, { Component } from 'react';
import logo from './assets/images/doggo.png';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './assets/stylesheets/App.css';
import './assets/stylesheets/Form.css';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import DogProfile from './pages/DogProfile';
import UDCSession from './pages/UDCSession';
import Container from 'react-bootstrap/Container';
import { isSignedIn } from './assets/helpers';

class App extends Component {

  testDB = () => {

  }

  render() {
    const App = () => (
      <Container>
        <div className="app-header">
          <img src={logo} alt="logo" />
        </div>
        <div className="app-body">
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/signup' component={SignUp} />
            <PrivateRoute path='/dogProfile' component={DogProfile} />
            <PrivateRoute exact path='/viewUDCSession' component={UDCSession} />
            <PrivateRoute exact path='/editUDCSession' component={UDCSession} params={{isEditing: true}}/>
            <PrivateRoute path='/' component={Home} />
          </Switch>
        </div>
      </Container>
    )
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    isSignedIn() === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

export default App;
