import React, { Component } from "react";
import ReactDOM from "react-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Files from 'react-files'

import Falx from "./Falx.jsx"
import About from "./About.jsx"
import Tutorial from "./Tutorial.jsx"

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { VegaLite } from 'react-vega';
import { Handler } from 'vega-tooltip';

import BookmarksIcon from '@material-ui/icons/Bookmarks';

import '../scss/App.scss';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { resizeVegaLiteSpec } from './Utils.jsx'

// render the component

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bookmarkedSpecs: [],
      bookmarkOpen: false
    };
  }

  bookmarkHandler(spec) {
    //alert(`I'm book marking this visualization: ${JSON.stringify(spec)}`);

    let newBookmarked = this.state.bookmarkedSpecs;
    newBookmarked.push(JSON.parse(JSON.stringify(spec)));
    this.setState({bookmarkedSpecs: newBookmarked});
  }

  switchBookmarks() {
    //alert(JSON.stringify(this.state.bookmarkedSpecs));
    this.setState({ bookmarkOpen: !this.state.bookmarkOpen });
  }

  render() {
    const footer = (
      <footer>
        <div className="row">
          Maintained by <a href="http://uwplse.org/">UW PLSE</a>, 2020
        </div>
      </footer>);

    let bookmarkStyle = {
      color: this.state.bookmarkedSpecs.length == 0 ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 0, 0, 0.8)",
      cursor: "pointer"
    }

    const bookmarkedItems = this.state.bookmarkedSpecs
      .map(function(spec, i) {
        var tempSpec = resizeVegaLiteSpec(JSON.parse(JSON.stringify(spec)));

        // use svg and css to resize them to fit into tiles
        return (
          <Grid className="bookmark-card" item key={i}>
            <Card onClick={null}>
              <CardActionArea>
                <CardContent className="card-content">
                  <div className="card-media"><VegaLite renderer={"svg"} spec={tempSpec}  actions={false}/></div>
                  {/*<CardMedia
                    component="img"
                    className="card-media"
                    image={<VegaLite spec={spec}  actions={false}/>}
                  />*/}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>);
      });


    const bookmarks = (
      <span to="" className="nav-link bookmark-icon" style={bookmarkStyle} onClick={this.switchBookmarks.bind(this)}>
        <span><BookmarksIcon /> Bookmarks ({this.state.bookmarkedSpecs.length})</span>
        <Dialog 
            className="bookmark-dialog"
            open={this.state.bookmarkOpen} maxWidth={"md"}
            scroll="paper" fullWidth
            onClose={this.switchBookmarks.bind(this)}
            aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" style={{color: "rgba(0, 0, 0, 0.6)"}}>
            <BookmarksIcon /> Bookmarked Visualizations
            <IconButton className="bookmark-close-btn" aria-label="close" 
              onClick={this.switchBookmarks.bind(this)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container className="bookmark-content">
              {this.state.bookmarkedSpecs.length > 0 ? bookmarkedItems : (
                  <Card><CardContent className="card-content">
                    <div className="card-media" style={{width: "600px", color: "gray", textAlign: "center"}}>
                      There is no bookmarked visualizations yet. 
                      <br />
                      Click "bookmark" in the exploration panel to save visualizations you like.
                    </div>
                    </CardContent></Card>)}
            </Grid>
          </DialogContent>           
        </Dialog>
      </span>);

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
                <span className="nav-link">{"|"}</span>
                {bookmarks}
              </Nav>
            </Navbar.Collapse>
            <Navbar.Brand></Navbar.Brand>
          </Navbar>
          <div id="app-body">
            <Switch>
              <Route path="/about"><About /><hr />{footer}</Route>
              <Route path="/tool"><Falx bookmarkHandler={this.bookmarkHandler.bind(this)}/></Route>
              <Route path="/tutorial"><Tutorial /><hr />{footer}</Route>
              <Route><About /><hr />{footer}</Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;

