import React, { Component } from "react";
import ReactDOM from "react-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Files from 'react-files'

import Falx from "./Falx.jsx"
import About from "./About.jsx"
import Tutorial from "./Tutorial.jsx"

import '../scss/App.scss';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


// render the component

class App extends Component {

  

  render() {

    const footer = (<footer>
                  <div className="row">
                    Maintained by <a href="http://uwplse.org/">UW PLSE</a>, 2020
                  </div>
                </footer>);

    return (
      <Router>
        <div id="app">
          <Navbar className="Navbar bordered" expand="sm">
            <Navbar.Brand><Link to="/about">Falx</Link> </Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Link to="/tool" className="nav-link">Tool</Link>
                {/*<Link to="/about" className="nav-link">About</Link>*/}
                <Link to="/tutorial" className="nav-link">Tutorial</Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div id="app-body">
            <Switch>
              <Route path="/about"><About /><hr />{footer}</Route>
              <Route path="/tool"><Falx/></Route>
              <Route path="/tutorial"><Tutorial /><hr />{footer}</Route>
            </Switch>
            {/*<VisEditor />*/}
          </div>
        </div>
      </Router>
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;

