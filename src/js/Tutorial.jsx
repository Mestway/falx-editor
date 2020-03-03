import React, { Component } from "react";
import ReactDOM from "react-dom";

import AboutExample from '../images/about-example.png';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import '../scss/App.scss';

import TutorialImg from '../images/tutorial-img.png';

import Step1Fig1 from '../images/step1-fig1.png';
import Step1Fig2 from '../images/step1-fig2.png';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import Step2Fig1 from '../images/step2-fig1.png';
import Step2Fig2 from '../images/step2-fig2.png';
import Step2Fig3 from '../images/step2-fig3.png';
import Step2Fig4 from '../images/step2-fig4.png';
import Step3Fig1 from '../images/step3-fig1.png';
import Step4Fig1 from '../images/step4-fig1.png';

// render the component

class Tutorial extends Component {

  render() {
    return (
      <div className="about-page">
        <h2>Tutorial: Data Visualization with <span className="tool-name">Falx</span></h2>
        <br />
        <p>This tutorial illustrates how to use <span className="tool-name">Falx</span> to create data visualizations.
          <span className="tool-name">Falx</span> is a visualization synthesizer designed to automatically synthesize 
          visualizations from partial visualization demonstrations. In this tutorial, 
            we'll show you how you can create the partial visualization with Falx Editor.</p>
        <p>Concretely, we'll show you how to create a heat-map for a product sales dataset. 
            The dataset contains the sales information for each product at different years and quarters. 
            Our goal is to use a heat-map to visualize it: 
            we'll have a subplot for each year, with x-axis showing the quarter number and y-axis shows products, 
            and colors will reflect the sales value of the product in the corresponding year/quarter.</p>
        <img className="centered-img" src={TutorialImg} width="80%"/> 
        <hr />

        <h4>Overview</h4>
        <ul>
          <li><a href="#step1">Step 1: Upload Data</a></li>
          <li><a href="#step2">Step 2: Create the Partial Visualization</a></li>
          <li><a href="#step3">Step 3: Run the Synthesizer</a></li>
          <li><a href="#step4">Step 4 (Optional): Post-process a Visualization</a></li>
        </ul>

        <hr />
        
        <h4 id="step1">Step 1: Upload Data</h4>
        <p>To start with, upload the dataset you'd like to visualize to Falx via "Upload Data" options under the "Select Data" menu. 
            The uploaded data will be displayed in the "Input Data" panel.</p>
        <div className="centered-img">
          <img className="step-img" src={Step1Fig1} width="30%" />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<ArrowForwardIcon />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <img className="step-img" src={Step1Fig2} width="30%" />
        </div>
        <p>Currently, Falx only supported data in .csv format. You can also start with a dataset included in the gallery.</p>

        <hr />

        <h4 id="step2">Step 2: Create the Partial Visualization</h4>
        <p>To use <span className="tool-name">Falx</span>, 
            we'll need to demonstrate our visualization purpose in the form of a partial visualization. 
           The idea is that we'll create a small visualization with only a few data points in the canvas, 
           and let <span className="tool-name">Falx</span> to find a visualization that generalizes the full dataset.</p>
        
        <p>In this example, since our goal is to create a heat-map for the sales data, 
          we'll create a partial visualization that contains 3 heat map tiles to illustrate our idea to the synthesizer.</p>
        
        <p>Starting from an empty canvas, we can first create a rectangular on the canvas that 
            represents the visualization of the first entry in the dataset 
            --- the sales value (which is 3) for Product1 at Quarter1 of year 2011. 
            To do so, we can click the "plus" button in the demonstration panel and add a rectangular, 
            and then click the object to edit its attributes: 
            <ul>
              <li>Its x-value should be Q4, since we'll put the rectangular at Q4 position in the chart.</li>
              <li>Its y-value should be Product1 for the similar reason.</li>
              <li>Its color-value should be 3, since we'll use color intensity to reflect the sales value.</li>
              <li>Its column-value should be 2011, since this rectangular will be placed under the subplot of year 2011.</li>
            </ul>
            After we edited it's property, we can save the edits and the partial visualization will be displayed in the preview section.
        </p>
        <div className="centered-img">
          <figure>
            <img className="step-img" src={Step2Fig1} width="28%" />
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<ArrowForwardIcon />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img className="step-img" src={Step2Fig2} width="28%"  />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<ArrowForwardIcon />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img className="step-img" src={Step2Fig3} width="28%"  />
          </figure>
        </div>
        <p> After creating the first rectangular, we can continue creating two more elements to make the partial 
            visualization more comprehensive to the synthesizer (the examples and partial visualization preview are shown as follows). 
        </p>
        <div className="centered-img">
          <figure>
            <img className="step-img" src={Step2Fig4} width="70%" />
          </figure>
        </div>

        <hr />

        <h4 id="step3">Step 3: Run the Synthesizer</h4>
        <p>Now we have provided the input data and created a partial visualization, 
          we'll simply press the "Synthesize" button to let the synthesizer to do the job. :) 
          To learn how the synthesizer work internally, you can check 
          out our <a href="https://arxiv.org/abs/1911.09668">technical paper</a>.
        </p>
        <div className="centered-img">
          <figure>
            <img className="step-img" src={Step3Fig1} width="60%" />
          </figure>
        </div>
        <p>Synthesis results will then appear at the bottom of editor panel, and we can navigate
           candidate solutions to find our desired solution. 
           Since our demonstration can be ambiguous to the synthesizer, 
           there can often be more than one visualizations of the full dataset that generalize our input partial visualization.
           In cases when we cannot find the desired solution in the solution panel, we can include more elements 
           (i.e., rectangulars representing more entries in the dataset) 
           to the partial visualization to help the synthesizer to disambiguate.
        </p>
        <p>After obtained the desired solution, we can perform some post-processing to fix some 
            minor problems of the visualization (if necessary) and then export it.
        </p>

        <hr />

        <h4 id="step4">Step 4 (Optional): Post-process a Visualization</h4>
        <p>When we find a solution that looks desirable but requires some fine-tuning, the GUI editor can help us.
           The editor allows us to conduct the following edits:</p>
        <ul>
          <li>Change the visualization type: we can change the visualization type between 
              line chart, bar chart, area chart, scatter plot (point) by changing the mark option.</li>
          <li>Change properties of an axis: we can change the title, sorting order and the encoding type of an axis. 
              These options will alter aesthetics of the given axis.</li>
          <li>Remove unnecessary components in the canvas: when the synthesizer over generalizes our demonstration 
              (i.e., elements that are not supposed to appear in the final visualization), we can add a filter to remove them. 
              To do so, we can simply write conditions like "color > 10", "x != Q1" to remove undesired elements.</li>
        </ul>
        <p>All edits will be reflected in the main visualization panel, and we can export 
            final visualization through export buttons. 
            We can also view the underlying R script and Vega-Lite script using 
            the "Program Viewer" option to understand how the visualization is created. </p>
        <p>In our example, we can edit axis titles to make the visualization more comprehensive: we can set 
           the x-axis title to "Quarter", y-axis title to "Product", 
            color title to "Sales" and column title to "Year", the final visualization is shown as follows.</p>
        <div className="centered-img">
          <figure>
            <img className="step-img" src={Step4Fig1} width="50%" />
          </figure>
        </div>

        <hr />

        <h4>Summary</h4>
          <p>In this example, we showed how we can create a heat-map by demonstrating a partial heat-map of the sales data. 
           In practice, we can use Falx to create following types of data visualizations (and what we should demonstrate in the partial visualization):</p>
          <ul>
            <li>Line Chart (by demonstrating lines in the partial visualization)</li>
            <li>Scatter Plot (demonstrating points)</li>
            <li>Area Chart (demonstrating areas)</li>
            <li>Bar Chart (demonstrating bars)</li>
            <li>Heat Map (demonstrating rectangulars)</li>
            <li>Stacked Bar Chart (demonstrating bars with different colors)</li>
            <li>Stacked Area Chart (demonstrating areas with different colors)</li>
            <li>Multi-layered Visualizations (demonstrating more than one types of elements)</li>
            <li>Subplots (demonstrate any chart above with non-empty column attributes)</li>
          </ul>
          <p>Now you have pretty much learned everything about Falx, it's time to <Link to="/falx">try it out</Link> to create some visualizations. 
            You can start with examples in the gallary and then try to create your own. :)</p>
      </div>
    );
  }
}

export default Tutorial;

