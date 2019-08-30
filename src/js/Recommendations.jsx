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
  constructor(props) {
    super(props);
    this.setFocusIndex = this.setFocusIndex.bind(this);
    this.previousInfoPaneSize = -1;
    this.state = {
      data: props.data,
      specs: props.specs,
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
    const visData = {
      "values": this.state.data
    };
    const contextCharts = this.state.specs.map((spec, index) => {
      const classes = classNames({
        'context-chart': true,
        'selected': index === this.state.focusIndex
      })

      let specCopy = Object.assign({}, spec);

      specCopy["width"] = 90;
      specCopy["height"] = 90;

      return (
        <div key={index} className={classes} onClick={() => {this.setFocusIndex(index);}}>
          <VegaLite spec={specCopy} data={visData} renderer="canvas" actions={false} />
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
              <VegaLite spec={this.state.specs[this.state.focusIndex]} data={visData} renderer="svg" />
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
            {/*<img className={classNames({
              'expand-icon': true,
              'expand-collapse': this.state.showInfoPane
             })} src={expandButton}/>*/}
          </button>
          <div className="raw-container">
            <div className="raw">
              <ReactJson src={this.state.specs[this.state.focusIndex]} />
            </div>
          </div>
        </div>
      </SplitPane>)
  }
}

export default Recommendations;