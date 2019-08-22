import React, { Component } from "react";
import classNames from 'classnames';

import VegaLite from 'react-vega-lite';
import AnimateOnChange from 'react-animate-on-change';

import '../scss/Recommendations.scss';

class Recommendations extends Component {
  constructor(props) {
    super(props);
    this.setFocusIndex = this.setFocusIndex.bind(this);
    this.state = {
      data: props.data,
      specs: props.specs,
      updateFocus: true,
      focusIndex: 0
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

      specCopy["width"] = 80;
      specCopy["height"] = 80;

      return (
        <div key={index} className={classes} onClick={() => {this.setFocusIndex(index);}}>
          <VegaLite spec={specCopy} data={visData} renderer="canvas" actions={false} />
          <div className="backdrop"></div>
        </div>
      );
    });

    return (
      <div className="Recommendations">
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
      </div>)
  }
}

export default Recommendations;