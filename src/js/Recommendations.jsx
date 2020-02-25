import React, { Component } from "react";
import classNames from 'classnames';

import SplitPane from 'react-split-pane';
import VegaLite from 'react-vega-lite';
import AnimateOnChange from 'react-animate-on-change';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

//import expandButton from '../images/expand.svg';
import Octicon from 'react-octicon'
import ReactTooltip from 'react-tooltip'

import VisEditor from "./VisEditor.jsx"

import '../scss/Recommendations.scss';

const COLLAPSED_INFO_PANE_SIZE = 24;
const DEFAULT_INFO_PANE_SIZE = 502;

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
  render() {

    const contextCharts = this.state.specs.map((spec, index) => {
      const classes = classNames({
        'context-chart': true,
        'selected': index === this.state.focusIndex
      })

      const specCopy = JSON.parse(JSON.stringify(spec));

      //specCopy["width"] = 90;
      specCopy["height"] = 90;

      if (!("layer" in specCopy)) {
        for (const key in specCopy["encoding"]) {
          specCopy["encoding"][key]["axis"] = {"labelLimit": 30, "title": null}
        }
      } else {
        for (var i = 0; i < specCopy["layer"].length; i ++) {
          for (const key in specCopy["layer"][i]["encoding"]) {
            specCopy["layer"][i]["encoding"][key]["axis"] = {"labelLimit": 30, "title": null}
          }
        }
      }

      console.log(JSON.stringify(specCopy));

      return (
        <div key={index} className={classes} onClick={() => {this.setFocusIndex(index);}}>
          <VegaLite spec={specCopy} data={specCopy["data"]} renderer="canvas" actions={false} />
          <div className="backdrop"></div>
        </div>
      );
    });

    const expandButton =  this.state.showInfoPane ? 
                  (<Octicon className="expand-icon" name="triangle-right"/>) 
                  : (<Octicon className="expand-icon" name="triangle-left"/>);

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
            <div className={classNames({'focus': true})}>
              <AnimateOnChange
                    baseClassName="chart"
                    animationClassName="update"
                    animate={this.state.updateFocus}
                    onAnimationEnd={function() {this.setState({"updateFocus": false});}.bind(this)} >
                <VegaLite spec={this.state.specs[this.state.focusIndex]} 
                          data={this.state.specs[this.state.focusIndex]["data"]} renderer="svg" />
              </AnimateOnChange>
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