import React, { Component } from "react";
import ReactDOM from "react-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Files from 'react-files'

import Falx from "./Falx.jsx"
import About from "./About.jsx"
import Tutorial from "./Tutorial.jsx"

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

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
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { VegaLite } from 'react-vega';
import { Handler } from 'vega-tooltip';

import BookmarksIcon from '@material-ui/icons/Bookmarks';

import '../scss/App.scss';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { resizeVegaLiteSpec, openInVegaEditor } from './Utils.jsx'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#007bff",
      contrastText: "white" //button text white instead of black
    }
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  }
});
// render the component

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bookmarkedSpecs: [],
      bookmarkOpen: false,
      activeBookmark: -1,
      openedBookmark: null
    };
  }

  bookmarkHandler(spec) {
    //alert(`I'm book marking this visualization: ${JSON.stringify(spec)}`);
    let newBookmarked = this.state.bookmarkedSpecs;
    let newSpec = JSON.parse(JSON.stringify(spec));
    if ("title" in newSpec) {
      delete newSpec["title"];
    }

    var existsSame = false;
    for (var i = 0; i < newBookmarked.length; i++) {
      if (JSON.stringify(newBookmarked[i]) == JSON.stringify(newSpec)) {
        existsSame = true;
      }
    }
    if (! existsSame) {
      newBookmarked.push(newSpec);
      this.setState({bookmarkedSpecs: newBookmarked});
    }    
  }

  switchBookmarks() {
    //alert(JSON.stringify(this.state.bookmarkedSpecs));
    this.setState({ bookmarkOpen: !this.state.bookmarkOpen });
  }

  removeBookmark(idx) {
    let newBookmarked = this.state.bookmarkedSpecs;
    newBookmarked.splice(idx, 1);
    this.setState({bookmarkedSpecs: newBookmarked});
  }

  resumeBookmark(idx) {
    this.setState({bookmarkOpen: false, openedBookmark: JSON.stringify(this.state.bookmarkedSpecs[idx])});
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
      .map((function(spec, i) {
        var tempSpec = resizeVegaLiteSpec(JSON.parse(JSON.stringify(spec)));

        // use svg and css to resize them to fit into tiles
        return (
          <Grid className="bookmark-card" item key={i}>
            <Card onClick={null} 
                  onMouseEnter={() => {this.setState({activeBookmark: i})}}
                  onMouseLeave={() => {this.setState({activeBookmark: -1})}}>
              <CardContent className="card-content">
                <div className="card-media"><VegaLite renderer={"svg"} spec={tempSpec}  actions={false}/></div>
                {/*<CardMedia
                  component="img"
                  className="card-media"
                  image={<VegaLite spec={spec}  actions={false}/>}
                />*/}
              </CardContent>
              <Tooltip title={"Edit in Falx"}>
                <Fab className={(this.state.activeBookmark == i) ? "bookmark-action-visible" : "bookmark-action-invisible"} 
                     style={{position: 'absolute', transform: "translate(10px, -150px)"}} 
                     onClick={(() => {this.resumeBookmark(i)}).bind(this)}
                     size="small" color="primary" aria-label="open">
                  <EditIcon />
                </Fab>
              </Tooltip>
              <Tooltip title={"Open in Vega Editor"}>
                <Fab className={(this.state.activeBookmark == i) ? "bookmark-action-visible" : "bookmark-action-invisible"} 
                     style={{position: 'absolute', transform: "translate(10px, -100px)"}} 
                     onClick={() => {openInVegaEditor(JSON.stringify(spec))}}
                     size="small" color="primary" aria-label="open">
                  <OpenInNewIcon />
                </Fab>
              </Tooltip>
              <Tooltip title={"Delete bookmark"}>
                <Fab className={(this.state.activeBookmark == i) ? "bookmark-action-visible" : "bookmark-action-invisible"} 
                     onClick={(() => {this.removeBookmark(i)}).bind(this)}
                     style={{position: 'absolute', transform: "translate(10px, -50px)"}} 
                     size="small" color="secondary" aria-label="delete">
                  <DeleteOutlineTwoToneIcon />
                </Fab>
              </Tooltip>
            </Card>
          </Grid>);
      }).bind(this));

    const bookmarks = (
        <span to="" className="nav-link bookmark-icon" style={bookmarkStyle} onClick={this.switchBookmarks.bind(this)}>
          <span><BookmarksIcon /> Bookmarks ({this.state.bookmarkedSpecs.length})</span>
        </span>
    );

    const bookmarkDialog = (
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
    );

    return (
      <ThemeProvider theme={theme}>
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
                  {bookmarkDialog}
                </Nav>
              </Navbar.Collapse>
              <Navbar.Brand></Navbar.Brand>
            </Navbar>
            <div id="app-body">
              <Switch>
                <Route path="/about"><About /><hr />{footer}</Route>
                <Route path="/tool"><Falx bookmarkHandler={this.bookmarkHandler.bind(this)} openedBookmark={this.state.openedBookmark} /></Route>
                <Route path="/tutorial"><Tutorial /><hr />{footer}</Route>
                <Route><About /><hr />{footer}</Route>
              </Switch>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<App />, wrapper) : false;
export default App;

