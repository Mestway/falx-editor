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

        <p>Designing data visualizations is fun, but how about implementing them? In order to create a data visualization, 
          we need to prepare the data to a format expected by the tool and then choose the right combination of visualization functions to plot it. 
          This means -- if we are not current with data preparation or not very familiar with the visualization tool, 
          we need to go through a tedious and challenging process to implement our insightful visualization designs.</p>

      	<p><span className="tool-name">Falx</span> is designed to address this implementation problem: to create a data visualization, 
          we only need to provide a demonstration of how a few data points in the dataset will be presented on the canvas, 
          and <span className="tool-name">Falx</span> will <span style={{fontStyle: "italic"}}>automatically prepares the data and implement the visualization for the full dataset</span>. </p>
      	
        {/*<p> To use <span className="tool-name">Falx</span>, your input to the tool includes (1) a tabular dataset that you'd like to visualize 
      		and (2) a partial visualization that visualizes a small subset of the dataset. <span className="tool-name">Falx</span> will then synthesize a visualization that generalizes your demonstration to the full dataset:
      		the output visualization will be a visualization of the full dataset that generalizes your demonstrated partial visualization.</p>
    		*/}

        <img className="centered-img" src={AboutExample} height="450px" alt="torchlight in the sky" />

        <p> With <span className="tool-name">Falx</span>, we don't need to worry about data reshaping or visualization scripting --- 
    			 <span className="tool-name">Falx</span> automatically prepares the data and generates the visualization script for you. 
    			<span className="tool-name">Falx</span> generates the data preparation script in R and the visualization script in Vega-Lite that can be edited later. </p>
      	
        <h5>Use the Tool</h5>

        <p>Visit the <Link to="/tutorial">tutorial page</Link> to learn how to use Falx, or directly go to the  <Link to="/tool">tool page</Link> to use it! </p>
      </div>
    );
  }
}

export default About;

