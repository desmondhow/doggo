import React, { Component } from 'react';
import './App.css';
import logo from './assets/images/doggo.png'

class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="app-header">
          <img src={logo} alt="logo" />
        </header>
      </div>
    );
  }
}

export default App;
