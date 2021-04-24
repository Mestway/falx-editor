import React, { Component } from "react";
import ReactDOM from "react-dom";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinkIcon from '@material-ui/icons/Link';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import '../scss/App.scss';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const tutorialImages = importAll(require.context('../tutorial-images', false, /\.(png|jpe?g|svg|mp4)$/));

console.log(tutorialImages)

// render the component

class QuickRef extends Component {

  render() {
    return (
      <div className="about-page">
        <h2>Quick Reference: Data Visualization with <span className="tool-name">Falx</span></h2>

        <br />
        
        <p>Here is the list of visualizations supported by Falx, and how to create examples to demonstrate the design.</p>
        <ul>
          <li>Scatter Plot (by demonstrating example points)</li>
          <li>Line Chart (by demonstrating example line segments)</li>
          <div className="centered-img">
            <figure>
              <img className="step-img" src={tutorialImages["summary-2.png"]} width="100%" />
            </figure>
          </div>
          <li>Bar Chart (by demonstrating example bars)</li>
          <li>Stacked Bar Chart (by demonstrating bars with different colors)</li>
          <div className="centered-img">
            <figure>
              <img className="step-img" src={tutorialImages["summary-1.png"]} width="100%" />
            </figure>
          </div>
          <li>Heatmap (demonstrating rectangles)</li>
          <li>Area Chart (demonstrating areas with different colors)</li>
          <li>Multi-layered Visualizations (demonstrating more than one types of elements)</li>
          <li>Subplots / Faceted Visualizations (demonstrating any chart above with non-empty column properties)</li>
          <div className="centered-img">
            <figure>
              <img className="step-img" src={tutorialImages["summary-3.png"]} width="80%" />
            </figure>
          </div>
        </ul>
      
        <p>Now it's time to <Link to="/tool" target="_blank">try it out</Link> to create some visualizations.</p>
      </div>
    );
  }
}

export default QuickRef;

