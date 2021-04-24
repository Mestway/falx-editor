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


import AboutExample from '../images/about-example.png';
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

class Tutorial extends Component {

  render() {
    return (
      <div className="about-page">
        <h2>Tutorial: Data Visualization with <span className="tool-name">Falx</span></h2>
        

        <br />
        <p>
          <span className="sec-link"><a href="#step1">Step 1: Upload Data</a></span> <span className="sep">|</span>
          <span className="sec-link"><a href="#step2">Step 2: Create an Example</a></span> <span className="sep">|</span>
          <span className="sec-link"><a href="#step3">Step 3: Run Falx</a></span> <span className="sep">|</span>
          <span className="sec-link"><a href="#step4">Step 4: Edit the Design</a></span> <span className="sep">|</span>
          <span className="sec-link"><a href="#summary">Summary</a></span>
        </p>

{/*        <h4>Overview</h4>
        <ul>
          <li><a href="#step1">Task: Visualizing sales data</a></li>
          <li><a href="#step1">Step 1: Upload Data</a></li>
          <li><a href="#step2">Step 2: Create a demonstration</a></li>
          <li><a href="#step3">Step 3: Run Falx</a></li>
          <li><a href="#step4">Step 4: Enrich the demonstration and re-run Falx</a></li>
          <li><a href="#step4">Step 4: (Optional): Post-processing</a></li>
          <li><a href="#summary">Summary</a></li>
        </ul>*/}

        {/*<h4 id="step1">Our Task: Visualizing sales data</h4>*/}
        <p>In this tutorial, we’ll use Falx to build a heatmap to visualize the following sales dataset: 
         a dataset that contains sales data for 6 products (Product 1-6) from all quarters between 2011-2013. </p>


{/*        <div className="centered-img">
          <figure>
            <img className="step-img" src={AboutExample} width="80%" />
          </figure>
        </div>

         <table className="tutorial-table table table-bordered table-hover table-condensed"><thead><tr><th title="Field #1">product</th><th title="Field #2">Q4</th><th title="Field #3">Q3</th><th title="Field #4">Q2</th><th title="Field #5">Q1</th></tr></thead><tbody><tr><td>Product1_2011</td><td >3</td><td >5</td><td >5</td><td >10</td></tr><tr><td>Product2_2011</td><td >5</td><td >7</td><td >5</td><td >2</td></tr><tr><td>Product3_2011</td><td >3</td><td >9</td><td >10</td><td >7</td></tr><tr><td>Product4_2011</td><td >3</td><td >2</td><td >8</td><td >1</td></tr><tr><td>Product5_2011</td><td >1</td><td >7</td><td >1</td><td >6</td></tr><tr><td>Product6_2011</td><td >9</td><td >1</td><td >6</td><td >1</td></tr><tr><td>Product1_2012</td><td >3</td><td >3</td><td >6</td><td >4</td></tr><tr><td>Product2_2012</td><td >4</td><td >3</td><td >6</td><td >4</td></tr><tr><td>Product3_2012</td><td >3</td><td >6</td><td >6</td><td >4</td></tr><tr><td>Product4_2012</td><td >4</td><td >10</td><td >6</td><td >1</td></tr><tr><td>Product5_2012</td><td >8</td><td >5</td><td >4</td><td >7</td></tr><tr><td>Product6_2012</td><td >8</td><td >8</td><td >8</td><td >6</td></tr><tr><td>Product1_2013</td><td >10</td><td >2</td><td >3</td><td >9</td></tr><tr><td>Product2_2013</td><td >8</td><td >6</td><td >7</td><td >7</td></tr><tr><td>Product3_2013</td><td >9</td><td >8</td><td >4</td><td >9</td></tr><tr><td>Product4_2013</td><td >5</td><td >9</td><td >5</td><td >2</td></tr><tr><td>Product5_2013</td><td >1</td><td >5</td><td >2</td><td >4</td></tr><tr><td>Product6_2013</td><td >8</td><td >10</td><td >6</td><td >4</td></tr></tbody></table>
*/}
        <p id="our-goal">Our goal is to build a faceted heat-map. 
          We'll build a visualization with 3 subplots (one for each year). In each subplot, x-axis displays quarter numbers, 
          y-axis displays product names, and colors displays the number of product saled in the given quarter of the year. 
        </p>

        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["overview-task.png"]} width="90%" />
          </figure>
        </div>

{/*        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["task.png"]} width="50%" />
          </figure>
        </div>
*/}
        <hr />

        <h4 id="step1">Step 1: Upload Data</h4>


        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={7}>
            <p>First, click <Link to="/tool" target="_blank">Falx Editor</Link> to open Falx editor window. 
                Then, click "upload data" button and copy & paste the following data into the input box.</p>
              
              <pre style={{width: "450px", 
                          lineHeight: "1.4",
                          border: "1px solid #ccc",
                          padding: "5px 5px 5px 5px",
                          color: "#444",
                          marginRight: "auto",
                          marginLeft: "auto",
                          background: "#f8f8f8"}}><code style={{fontSize: "12px"}}>
              {"[" + [{"product":"Product1_2011","Q4":3,"Q3":5,"Q2":5,"Q1":10},
               {"product":"Product2_2011","Q4":5,"Q3":7,"Q2":5,"Q1":2},
               {"product":"Product3_2011","Q4":3,"Q3":9,"Q2":10,"Q1":7},
               {"product":"Product4_2011","Q4":3,"Q3":2,"Q2":8,"Q1":1},
               {"product":"Product5_2011","Q4":1,"Q3":7,"Q2":1,"Q1":6},
               {"product":"Product6_2011","Q4":9,"Q3":1,"Q2":6,"Q1":1},
               {"product":"Product1_2012","Q4":3,"Q3":3,"Q2":6,"Q1":4},
               {"product":"Product2_2012","Q4":4,"Q3":3,"Q2":6,"Q1":4},
               {"product":"Product3_2012","Q4":3,"Q3":6,"Q2":6,"Q1":4},
               {"product":"Product4_2012","Q4":4,"Q3":10,"Q2":6,"Q1":1},
               {"product":"Product5_2012","Q4":8,"Q3":5,"Q2":4,"Q1":7},
               {"product":"Product6_2012","Q4":8,"Q3":8,"Q2":8,"Q1":6},
               {"product":"Product1_2013","Q4":10,"Q3":2,"Q2":3,"Q1":9},
               {"product":"Product2_2013","Q4":8,"Q3":6,"Q2":7,"Q1":7},
               {"product":"Product3_2013","Q4":9,"Q3":8,"Q2":4,"Q1":9},
               {"product":"Product4_2013","Q4":5,"Q3":9,"Q2":5,"Q1":2},
               {"product":"Product5_2013","Q4":1,"Q3":5,"Q2":2,"Q1":4},
               {"product":"Product6_2013","Q4":8,"Q3":10,"Q2":6,"Q1":4}].map(line => JSON.stringify(line)).reduce((a, b) => (a + ",\n" + b)) + "]"}
              </code></pre>
              <p style={{marginBottom: "0px"}}>The data is now uploaded and displayed on the “Input Data” section.</p>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={4}>
            <video className='videoTag video-box' autoPlay width="100%" loop muted>
              <source src={tutorialImages["demo-data-upload.mp4"]} type='video/mp4' />
            </video>
          </Grid>
        </Grid>

        <hr />

        <h4 id="step2">Step 2: Create an Example</h4>

        <Grid container spacing={1} alignItems={"center"}>
          <Grid item xs={7}>
            <p>Now, let's create an example to demonstrate our visualization design: 
              we will create a mini heatmap using one data point and ask Falx to generalize it to a visualization of the full dataset.</p>
            
            <p style={{clear:"both"}}>Let’s create a mini heatmap with only one rectangle using the first data point 
              (the sales value <code>3</code> for <code>Product1</code> in <code>2011 Q4</code>). 
              Let's click the "+" button in the demonstration panel and add a rectangle. We will:
            </p>
            
            <div>
              <ul>
                <li>Map quarter number <code>Q4</code> to x-axis;</li>
                <li>Map product id <code>Product1</code> to y-axis;</li>
                <li>Map sales value <code>3</code> to the color-value, which allows the color of the rectangle to reflect the sales value 3;</li>
                <li>Map year number <code>2011</code> to column property, since this rectangle belongs to the subplot of the year 2011.</li>
              </ul>

              {/*<figure style={{ margin: "auto"}}>
                <img className="step-img" src={tutorialImages["step2-tag-editor.png"]} width="210px" />
              </figure>*/}
            </div>
            
            <p style={{marginBottom: "0px"}}>Click "Save", and the following rectangle will show up in the “Demonstration preview” panel. This is our visualization example.
            </p>
            
            <div className="centered-img">
              <figure>
                <img className="step-img" src={tutorialImages["step2-mini-visualization.png"]} width="32%" />
              </figure>
            </div>

          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={4}>
            <video className='videoTag video-box' autoPlay width="100%" loop muted>
              <source src={tutorialImages["demo-create-example.mp4"]} type='video/mp4' />
            </video>
          </Grid>
        </Grid>

        <hr />

        <h4 id="step3">Step 3: Run Falx</h4>

        <p>Now let's press the "Synthesize" button to let Falx synthesize the full heatmap from our demonstration. Internally, Falx synthesizes a script to reshape and visualize the dataset. 
            Synthesized visualizations are those contain our demonstrated rectangle. 
            You can learn more about how Falx works from our technical papers <a href="https://arxiv.org/abs/2102.01024" target="_blank">[CHI 2021]</a>, <a href="https://arxiv.org/abs/1911.09668" target="_blank">[POPL 2020]</a>.</p>
        <p>After a few seconds, synthesis results will appear at the bottom of the editor panel. 
           Click on ones you are interested in to view them in the editor and check whether it is our <a href="#our-goal">desired one</a>. Visualizations created by Falx are displayed in the editor panel. </p>


        {/*<div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["step3-result.png"]} width="100%" />
          </figure>
        </div>*/}


        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["step3-result-full-annotated.png"]} width="80%" />
          </figure>
        </div>

        <p>As we can see, the first visualization is the one we want (<a href="#our-goal">here</a>). We can then use the editor panel to edit it to improve its aesthetics.</p>

        <hr />
{/*
        <h4 id="step4">Step 4: Enrich the demonstration and re-run Falx </h4>

        <p>Right now, there are quite a lot of visualizations created by Falx that generalize our demonstration --- every one of them contain the rectangle we provided in the mini visualization. However, it is inconvenient for us to navigate through all of them to decide which is <a href="#our-goal">the one we want</a> due to the number of created visualizations. </p>
        <p>The cause of Falx generating quite a lot of visualizations is that our demonstration is inherently ambiguous: in our demonstration, we specified that “we want a heatmap that at contains the given rectangle (the sales value 3 for Product1, year 2011, Q4)”, but we didn’t provide much clue to Falx about things like “should the final visualization contain entries from Q3?” and “Should the final visualization include data from 2013?”.</p>
        <p>Of course, we don’t need to tell everything to Falx (since that’s a lot of work), But, we can easily help Falx by enriching our demonstration to reduce ambiguity. Here, besides the first rectangle we provided, we can add another rectangle to the mini heatmap. For example, we can add a new rectangle to show the sales data for Product2 at Quarter3 of year 2011 (which is 7):</p>

        <ul>
          <li>Set its x-value to <code>Q3</code>.</li>
          <li>Set its y-value to <code>Product2</code>.</li>
          <li>Set its color-value to <code>7</code>.</li>
          <li>Set its column-value to <code>2011</code>.</li>
        </ul>

        <p>Now we obtained a new mini heatmap in the preview section: it now contains two rectangles instead of one.</p>

        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["step4-mini-visualization.png"]} width="240px" style={{marginRight: "20px"}}/>
            <img className="step-img" src={tutorialImages["step4-tag-editor.png"]} width="360px" />           
          </figure>
        </div>

        <p>We can again use the “Synthesize” button to ask Falx to find visualizations that generalize the mini heatmap. Since our demonstration this time contains more information about our objective, it is less ambiguous to Falx, and Falx finds fewer number of visualizations that satisfy our demonstration and in a shorter amount of time. Visualizations created by Falx are displayed in the editor panel. </p>

        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["step4-result-full.png"]} width="80%" />
          </figure>
        </div>

        <p>As we can see, Falx only returns 4 visualizations this time due to reduced ambiguity from the demonstration, and the last visualization is the one we want (<a href="#our-goal">here</a>). Click on it to view it in the editor. After obtaining the desired visualization, we can post-process the visualization to fix some minor problems of the visualization (e.g., axis titles) and then export it.</p>

        <p className="tips">Tips: In general, we don’t have to create a lot of examples to Falx -- we can always start with 1-2 examples in our mini visualization. We only need to add more examples if (1) Falx failed to create the desired visualization or (2) there are too many visualizations showing up in the output panel that makes navigation difficult. More examples can both help disambiguate our intent and speed up Falx.</p>

        <hr />*/}

        <h4 id="step4">Step 4 (Optional): Edit the Design</h4>
        <p>After getting the desired visuaalization, we can use the GUI editor to explore different designs and enhance its aesthetics. The editor allows us to conduct the following edits (click to view demos):</p>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography >1. <span className="list-header">Change the visualization mark type:</span> bar, line, rect, point, area, circle, tick, boxplot.</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <video className='videoTag' autoPlay width="800px" loop muted>
                <source src={tutorialImages["demo-change-mark.mp4"]} type='video/mp4' />
              </video>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>2. <span className="list-header">Swap data field among axis:</span> drag a data field and drop it to another axis to swap the two axes.</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <video className='videoTag' autoPlay width="800px" loop muted>
              <source src={tutorialImages["demo-swap-axis.mp4"]} type='video/mp4' />
            </video>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>3. <span className="list-header">Change axis properties:</span> change axis title, data type, sort order and color scheme.</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <video className='videoTag' autoPlay width="800px" loop muted>
              <source src={tutorialImages["demo-edit-axis.mp4"]} type='video/mp4' />
            </video>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>4. <span className="list-header">Filter data:</span> we can add a filter predicate to remove unwanted data from the visualization.</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <video className='videoTag' autoPlay width="800px" loop muted>
              <source src={tutorialImages["demo-filtering.mp4"]} type='video/mp4' />
            </video>
          </AccordionDetails>
        </Accordion>

        <br />

        <p>In our example, we only need to change axis titles to make the visualization more comprehensive: we can set the x-axis title to "Quarter", y-axis title to "Product ID", color title to "Sales" and column title to "Year".</p>

        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["task.png"]} width="50%" />
          </figure>
        </div>
     
        <p>Now that we finished our visualization. We can download the visualization or open in Vega editor for additional editing (use actions in the main view). If you'd like to see the program behind our visualization, you can click "Program Viewer" tab on the editor panel. </p>
   
        <hr />

        <h4 id="summary">Summary</h4>
          <p>In this tutorial, we presented how to create a heatmap by demonstrating a mini heatmap of the sales data. In general to create following types of data visualizations (and what we should demonstrate in the mini visualization).</p>
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
        
          <p>Now you have pretty much learned everything about Falx, it's time to <Link to="/tool" target="_blank">try it out</Link> to create some visualizations.</p>
      </div>
    );
  }
}

export default Tutorial;

