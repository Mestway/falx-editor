import React, { Component } from "react";
import classNames from 'classnames';

import SplitPane from 'react-split-pane';
import VegaLite from 'react-vega-lite';
import AnimateOnChange from 'react-animate-on-change';
import ReactJson from 'react-json-view'

//import expandButton from '../images/expand.svg';
import Octicon from 'react-octicon'

import '../scss/Recommendations.scss';

const COLLAPSED_INFO_PANE_SIZE = 24;
const DEFAULT_INFO_PANE_SIZE = 302;

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
      updateFocus: true,
      focusIndex: 0,
      showInfoPane: false
    };
  }
  setFocusIndex(focusIndex) {
    this.setState({
      focusIndex: focusIndex
    });
    this.state.focusIndex = focusIndex;
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

    const expandButton =  this.state.showInfoPane ? (<Octicon className="expand-icon" name="triangle-right"/>) : (<Octicon className="expand-icon" name="triangle-left"/>);

    return (
      <SplitPane className="Recommendations" split="vertical" 
        primary="second"
        size={
              this.state.showInfoPane ?
                this.previousInfoPaneSize === -1 ? DEFAULT_INFO_PANE_SIZE : this.previousInfoPaneSize
              :
                COLLAPSED_INFO_PANE_SIZE
            }
            allowResize={this.state.showInfoPane}
            onDragFinished={(size) => { this.previousInfoPaneSize = size}}
            minSize={24} maxSize={-400}>
        <div className="visualizations">
          <div className={classNames({'focus': true})}>
            <AnimateOnChange
                  baseClassName="chart"
                  animationClassName="update"
                  animate={this.state.updateFocus}>
              <VegaLite spec={this.state.specs[this.state.focusIndex]} data={this.state.specs[this.state.focusIndex]["data"]} renderer="svg" />
            </AnimateOnChange>
          </div>
          <div className={classNames({'context': true})}>
            <div className="carousel">
              {contextCharts}
            </div>
          </div>
        </div>
        <div className="info">
          <button className="expand-button" onClick={() => { this.setState({ showInfoPane: !this.state.showInfoPane }); }}>
            {expandButton}
          </button>
          <div className="raw-container">
            <div className="raw">
              <ReactJson src={{"r_script": this.state.tableProgs[this.state.focusIndex],
                               "vl_spec": this.state.specs[this.state.focusIndex]}} iconStyle="triangle"
                displayObjectSize={false} enableClipboard={false} //displayDataTypes={false}
                shouldCollapse={({ src, namespace, type }) => {
                  // collapse "data" field in the namespace
                  if (namespace.indexOf("values") == namespace.length - 1 && namespace.indexOf("data") == namespace.length - 2) {
                      return true
                  }
                  return false
              }}/>
            </div>
          </div>
        </div>
      </SplitPane>)
  }
}

export default Recommendations;