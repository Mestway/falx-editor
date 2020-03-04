import React, { Component } from "react";
import ReactDOM from "react-dom";

import '../scss/About.scss';
import AboutExample from '../images/about-example.png';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// render the component

class About extends Component {

  render() {
    return (
      <div className="about-page">

      	<h2>Automated Data Visualization with <span className="tool-name">Falx</span></h2>
        <br />
        <h5>What's Falx?</h5>
      	<p><span className="tool-name">Falx</span> is a visualization synthesizer designed to automatically synthesize 
      		visualizations from partial visualization demonstrations. </p>
      	<p> To use <span className="tool-name">Falx</span>, your input to the tool includes (1) a tabular dataset that you'd like to visualize 
      		and (2) a partial visualization that visualizes a small subset of the dataset. <span className="tool-name">Falx</span> will then synthesize a visualization that generalizes your demonstration to the full dataset:
      		the output visualization will be a visualization of the full dataset that generalizes your demonstrated partial visualization.</p>
    		<img className="centered-img" src={AboutExample} height="450px" alt="torchlight in the sky" />

        <p> With <span className="tool-name">Falx</span>, you don't need to worry about data reshaping or visualization scripting --- 
    			 <span className="tool-name">Falx</span> automatically prepares the data and generates the visualization script for you. 
    			Both the data preparation script (in R) and the visualization script (in Vega-Lite) can be exported for further editing if you need to.</p>
      	<h5>Use the Tool</h5>

        <p>Visit the <Link to="/tutorial">tutorial page</Link> to learn how to use Falx, or directly go to the  <Link to="/falx">tool page</Link> to use it! </p>
      </div>
    );
  }
}

export default About;

