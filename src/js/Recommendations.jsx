import React, { Component } from "react";
import classNames from 'classnames';

import SplitPane from 'react-split-pane';
import { VegaLite } from 'react-vega';
import AnimateOnChange from 'react-animate-on-change';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

//import expandButton from '../images/expand.svg';
import Octicon from 'react-octicon'
import ReactTooltip from 'react-tooltip'

import SaveAltIcon from '@material-ui/icons/SaveAlt';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import VisEditor from "./VisEditor.jsx"

import '../scss/Recommendations.scss';

const COLLAPSED_INFO_PANE_SIZE = 24;
const DEFAULT_INFO_PANE_SIZE = 402;

class Recommendations extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.specs !== state.specs) {
      return { 
        specs: props.specs,
        tableProgs: props.tableProgs
      };
    }
    return null;
  }
  constructor(props) {
    super(props);
    this.setFocusIndex = this.setFocusIndex.bind(this);
    this.previousInfoPaneSize = -1;
    this.state = {
      specs: props.specs,
      tableProgs: props.tableProgs,
      updateFocus: false,
      focusIndex: 0,
      showInfoPane: true
    };
  }
  updateSpec(index, newSpec) {
    var newSpecs = this.state.specs;
    newSpecs[index] = newSpec;
    this.setState({
      specs: newSpecs
    })
  }
  setFocusIndex(focusIndex) {
    this.setState({
      focusIndex: focusIndex,
      updateFocus: true
    });
  }

  downloadVis(spec) {
    const element = document.createElement("a");
    const file = new Blob([spec], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "vis-save.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  openInVegaEditor(specStr) {
    const editorURL = "https://vega.github.io/editor/";
    const editor = window.open(editorURL);

    const data = {
      config: {},
      mode: "vega-lite",
      renderer: "canvas",
      spec: specStr
    };

    const wait = 10000;
    const step = 250;
    // eslint-disable-next-line no-bitwise
    let count = ~~(wait / step);

    function listen(evt) {
      if (evt.source === editor) {
        count = 0;
        window.removeEventListener('message', listen, false);
      }
    }
    window.addEventListener('message', listen, false);

    // send message
    // periodically resend until ack received or timeout
    function send() {
      if (count <= 0) {
        return;
      }
      console.log(data);
      editor.postMessage(data, '*');
      setTimeout(send, step);
      count -= 1;
    }
    setTimeout(send, step);    
  }

  render() {

    const contextCharts = this.state.specs.map((spec, index) => {
      const classes = classNames({
        'context-chart': true,
        'selected': index === this.state.focusIndex
      })

      const specCopy = JSON.parse(JSON.stringify(spec));

      //specCopy["width"] = 90;

      // no minWidth by default
      var minWidth = 0;
      var maxWidth = 90 * 6;
      if (specCopy["width"] != 200) {
        minWidth = (specCopy["width"] / 20) * 8;
      }
      // in case we don't have enough room to show ticks and labels
      var disableXLabels = false;
      if (specCopy["width"] / 20 > (maxWidth / 8)) {
        disableXLabels = true;
        if (!("layer" in specCopy)) {
          
        } else {
          // ignore multi-layered charts for now
        }
      }
      specCopy["width"] = Math.min(Math.max(specCopy["width"] * (90.0 / specCopy["height"]), minWidth), maxWidth);
      
      // set spec size height to 90 (to fix the carousel)
      specCopy["height"] = 90;

      if (!("layer" in specCopy)) {
        for (const key in specCopy["encoding"]) {
          specCopy["encoding"][key]["axis"] = {"labelLimit": 30, "title": null}
        }
        if (disableXLabels) {
          specCopy["encoding"]["x"]["axis"]["labels"] = false;
          specCopy["encoding"]["x"]["axis"]["ticks"] = false;
        }
      } else {
        for (var i = 0; i < specCopy["layer"].length; i ++) {
          for (const key in specCopy["layer"][i]["encoding"]) {
            specCopy["layer"][i]["encoding"][key]["axis"] = {"labelLimit": 30, "title": null}
          }
          if (disableXLabels) {
            specCopy["encoding"]["x"]["axis"]["labels"] = false;
            specCopy["encoding"]["x"]["axis"]["ticks"] = false;
          }
        }
      }

      //console.log(JSON.stringify(specCopy));

      return (
        <div key={index} className={classes} onClick={() => {this.setFocusIndex(index);}}>
          <VegaLite spec={specCopy} renderer="canvas" actions={false} />
          <div className="backdrop"></div>
        </div>
      );
    });

    const expandButton =  this.state.showInfoPane ? 
                  (<Octicon className="expand-icon" name="triangle-right"/>) 
                  : (<Octicon className="expand-icon" name="triangle-left"/>);

    // copy to force an update in vega lite
    const focusedSpec = JSON.parse(JSON.stringify(this.state.specs[this.state.focusIndex]));
    const maxWidth = 1600;
    if (focusedSpec["width"] > maxWidth) {
      // in case we don't have enough room to show ticks and labels
      if (focusedSpec["width"] / 20 > (maxWidth / 8)) {
        if (!("layer" in focusedSpec)) {
          focusedSpec["encoding"]["x"]["axis"] = {"labels": false, "ticks": false};
        } else {
          // ignore multi-layered charts for now
        }
      }
      focusedSpec["width"] = maxWidth;
    }
    const vlScript = (<VegaLite spec={focusedSpec} renderer="canvas" actions={false}/>)

    return (
      <div className="Recommendations">
        <div className="visualizations">
          <SplitPane split="vertical" 
          primary="second"
          size={
                this.state.showInfoPane ?
                  this.previousInfoPaneSize === -1 ? DEFAULT_INFO_PANE_SIZE : this.previousInfoPaneSize
                :
                  COLLAPSED_INFO_PANE_SIZE
              }
              allowResize={this.state.showInfoPane}
              onDragFinished={(size) => { this.previousInfoPaneSize = size }}
              minSize={24} maxSize={-400}>
            <div className={classNames({'vis-focus': true})}>
              <div className="save-btn-area">
              <Tooltip title="Download Visualization Script">
                <IconButton aria-label="save" onClick={() => this.downloadVis(JSON.stringify(focusedSpec, null, '\t'))}>
                  <SaveAltIcon color="primary"/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Open in Vega Editor">
                <IconButton aria-label="vega-editor" onClick={() => this.openInVegaEditor(JSON.stringify(focusedSpec, null, '\t'))}>
                  <OpenInNewIcon color="primary"/>
                </IconButton>
              </Tooltip>
              </div>
              <div className="main-vis-panel">
                <AnimateOnChange
                      baseClassName="chart"
                      animationClassName="update"
                      animate={this.state.updateFocus}
                      onAnimationEnd={function() {this.setState({"updateFocus": false});}.bind(this)} >
                  {vlScript}
                </AnimateOnChange>
              </div>
            </div>
            <div className="info">
                <button data-tip={this.state.showInfoPane ? "Collapse the editor" : "Open the editor"} 
                        className="expand-button" 
                        onClick={() => { this.setState({ showInfoPane: !this.state.showInfoPane }); }}>
                  {expandButton}
                </button>
                <ReactTooltip />
                <VisEditor tableProg={this.state.tableProgs[this.state.focusIndex]} 
                           spec={this.state.specs[this.state.focusIndex]}
                           specIndex={this.state.focusIndex}
                           visSpecUpdateHandle={this.updateSpec.bind(this)} />
              </div>
          </SplitPane>
        </div>
        <div className={classNames({'context': true})}>
          <div className="carousel">
            {contextCharts}
          </div>
        </div>
      </div>
      )
  }
}

export default Recommendations;