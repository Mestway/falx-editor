import React, { Component } from "react";
import ReactDOM from "react-dom";
import Navbar from 'react-bootstrap/Navbar';
import Files from 'react-files'

import Falx from "./Falx.jsx"
import '../scss/App.scss';


class App extends Component {
  render() {
    return (
      <div id="app">
        <Navbar id="nav-bar" bg="dark" variant="dark">
          <Navbar.Brand href="#home">
            {'Falx'}
          </Navbar.Brand>
        </Navbar>
        <Falx />
      </div>
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;

