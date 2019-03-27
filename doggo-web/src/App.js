import React, { Component } from 'react';
import logo from './assets/images/doggo.png';
import {
  Route,
  Switch
} from 'react-router-dom';
import './assets/stylesheets/App.css';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import Container from 'react-bootstrap/Container';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false
    }
  }

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
            <Route path='/' component={Home} />
          </Switch>
        </div>
      </Container>
    )
    return (
      <Switch>
        <App />
      </Switch>
    );
    // if (this.state.signedIn) {
    //   return (
    //     <div className="app">
    //       <header className="app-header">
    //         <img src={logo} alt="logo" />
    //       </header>
    //       <button onClick={() => this.testDB}>Test DB</button>
    //     </div>
    //   );
    // }

  }
}

export default App;
