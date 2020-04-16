import React, { Component } from "react";
import ReactDOM from "react-dom";

import AboutExample from '../images/about-example.png';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import '../scss/App.scss';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const tutorialImages = importAll(require.context('../tutorial-images', false, /\.(png|jpe?g|svg)$/));

console.log(tutorialImages)

// render the component

class Tutorial extends Component {

  render() {
    return (
      <div className="about-page">
        <h2>Tutorial: Data Visualization with <span className="tool-name">Falx</span></h2>
        <br />
        <p>This tutorial illustrates how to use Falx to create data visualizations. 
            Falx is a visualization tool that automatically synthesizes visualizations from demonstrations. 
            In this tutorial, we illustrate how to create visualizations with Falx.</p>
        <hr />

        <h4>Overview</h4>
        <ul>
          <li><a href="#step1">Task: Visualizing sales data</a></li>
          <li><a href="#step1">Step 1: Upload Data</a></li>
          <li><a href="#step2">Step 2: Create a demonstration</a></li>
          <li><a href="#step3">Step 3: Run Falx</a></li>
          <li><a href="#step4">Step 4: Enrich the demonstration and re-run Falx</a></li>
          <li><a href="#step5">Step 5: (Optional): Post-processing</a></li>
          <li><a href="#summary">Summary</a></li>
        </ul>

        <hr />

        <h4 id="step1">Our Task: Visualizing sales data</h4>
        <p>In this tutorial, we’ll build a heatmap to visualize the following sales dataset: 
         it contains sales data for 6 products (Product 1-6) from all quarters between 2011-2013. </p>

         <table className="tutorial-table table table-bordered table-hover table-condensed"><thead><tr><th title="Field #1">product</th><th title="Field #2">Q4</th><th title="Field #3">Q3</th><th title="Field #4">Q2</th><th title="Field #5">Q1</th></tr></thead><tbody><tr><td>Product1_2011</td><td >3</td><td >5</td><td >5</td><td >10</td></tr><tr><td>Product2_2011</td><td >5</td><td >7</td><td >5</td><td >2</td></tr><tr><td>Product3_2011</td><td >3</td><td >9</td><td >10</td><td >7</td></tr><tr><td>Product4_2011</td><td >3</td><td >2</td><td >8</td><td >1</td></tr><tr><td>Product5_2011</td><td >1</td><td >7</td><td >1</td><td >6</td></tr><tr><td>Product6_2011</td><td >9</td><td >1</td><td >6</td><td >1</td></tr><tr><td>Product1_2012</td><td >3</td><td >3</td><td >6</td><td >4</td></tr><tr><td>Product2_2012</td><td >4</td><td >3</td><td >6</td><td >4</td></tr><tr><td>Product3_2012</td><td >3</td><td >6</td><td >6</td><td >4</td></tr><tr><td>Product4_2012</td><td >4</td><td >10</td><td >6</td><td >1</td></tr><tr><td>Product5_2012</td><td >8</td><td >5</td><td >4</td><td >7</td></tr><tr><td>Product6_2012</td><td >8</td><td >8</td><td >8</td><td >6</td></tr><tr><td>Product1_2013</td><td >10</td><td >2</td><td >3</td><td >9</td></tr><tr><td>Product2_2013</td><td >8</td><td >6</td><td >7</td><td >7</td></tr><tr><td>Product3_2013</td><td >9</td><td >8</td><td >4</td><td >9</td></tr><tr><td>Product4_2013</td><td >5</td><td >9</td><td >5</td><td >2</td></tr><tr><td>Product5_2013</td><td >1</td><td >5</td><td >2</td><td >4</td></tr><tr><td>Product6_2013</td><td >8</td><td >10</td><td >6</td><td >4</td></tr></tbody></table>

        <p id="our-goal">Our goal is to build a faceted heat-map to visualize it. 
          We'll build a visualization with 3 subplots (one for each year), 
          and each subplot is a heatmap with x-axis showing quarter numbers, 
          y-axis showing product names, and colors showing the sales value of the product in the corresponding year/quarter. 
          Here is what the final visualization would look like:</p>

        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["task.png"]} width="50%" />
          </figure>
        </div>

        <p>Now, let’s use Falx to create this visualization.</p>

        <hr />

        <h4 id="step1">Step 1: Upload Data</h4>
        <p>To start with, click "Start with your data" option on the starting menu. 
          From there, copy and paste the following data into the input box and upload it by clicking the “Save” button.</p>
        
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

        <p>As a result, the input data is uploaded to Falx and is displayed on the “Input Data” section in the input panel.</p>

        <hr />

        <h4 id="step2">Step 2: Create a demonstration</h4>
        <p>Now, we'll create a demonstration to convey our visualization intent to Falx. 
          The idea is that we'll create a mini visualization that visualizes only a few data points from the input data, 
          and let Falx create the full visualization by generalizing our demonstration to the full dataset.</p>
        
        <p>In this task, since <a href="#our-goal">our goal</a> is to create a faceted heatmap for the sales data that is composed of rectangles, 
          we'll create a mini heatmap that contains only a few rectangles to illustrate our intent. 
          We’ll use the “Demonstration” panel to create the mini heatmap.</p>
        
        <p style={{clear:"both"}}>Starting from an empty canvas, let’s create a mini heatmap that contains only one rectangle to visualize the very first entry in the sales dataset 
          --- the sales value for Product1 in Quarter4 of year 2011 is 3. 
          To do so, we can click the "+" button in the demonstration panel and add a rectangle (a "rect") and edit its properties as follows:
        </p>
        
        <div style={{width: "100%"}}>
          <ul style={{width: "70%", float: "left", display:"block", clear: "both", marginRight: "20px"}}>
            <li>Set its x-value to <code>Q4</code>, since this rectangle would be placed at Q4 position on the x-axis.</li>
            <li>Set its y-value to <code>Product1</code>, for the similar reason.</li>
            <li>Set its color-value to <code>3</code>, since the color intensity for this rectangle is supposed to reflect the sales value 3.</li>
            <li>Set its column-value to <code>2011</code>, since this rectangle belongs to the facet (subplot) of the year 2011 in the faceted heatmap.</li>
          </ul>
          <figure style={{ margin: "auto"}}>
            <img className="step-img" src={tutorialImages["step2-tag-editor.png"]} width="210px" />
          </figure>
        </div>
        
        <p style={{clear:"both"}}>After finishing editing its properties, click "Save". The rectangle will show up in the “Demonstration” panel, 
          and the mini visualization will be displayed in the “Demonstration preview” section. 
          The mini visualization looks like this:
        </p>
        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["step2-mini-visualization.png"]} width="20%" />
          </figure>
        </div>

        <hr />

        <h4 id="step3">Step 3: Run Falx</h4>

        <p>We have just provided the input data and created a mini visualization to demonstrate our intent, now we simply need to press the "Synthesize" button to let Falx create the real heatmap for the full dataset that generalizes our mini visualization. </p>

        <p>Internally, Falx will try different <a href="https://www.tidyverse.org/">data transformation functions</a> and <a href="https://vega.github.io/vega-lite/">visualization functions</a> to reshape and visualize the full dataset. Falx will record all function combinations such that the generated visualization contains all elements demonstrated by us in the mini visualization. In our case, Falx will try to find all heatmaps that contain the demonstrated rectangle, and present these results to us. To learn more about how Falx works internally, check out our <a href="https://arxiv.org/abs/1911.09668">technical paper</a>.</p>
        <p>After a few seconds, synthesis results will appear at the bottom of the editor panel. The results will look like this:</p>

        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["step3-result.png"]} width="100%" />
          </figure>
        </div>

        <p>We can click on some of them to view them in the editor to check if <a href="#our-goal">the desired one</a> is indeed created by Falx.</p>

        <hr />

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

        <hr />

        <h4 id="step5">Step 5 (Optional): Post-processing</h4>
        <p>When we find a desired visualization that requires some fine-tuning, the GUI editor can help. The editor allows us to conduct the following edits:</p>
        
        <ul>
          <li>Change the visualization type: we can change the visualization type among line chart, bar chart, area chart, scatter plot (point) by changing the mark option to explore different designs.</li>
          <li>Change axis properties: we can change the title and the encoding type of an axis. These options will alter aesthetics of the given axis.</li>
          <li>Remove unnecessary components in the visualization: when the synthesizer over generalizes our demonstration (i.e., elements that are not supposed to appear in the final visualization), we can add a filter to remove them. To do so, we can simply write conditions like <code>x != Q1</code> to remove undesired elements (remove all elements whose x value is Q1).</li>
        </ul>
        <p>In our example, we only need to change axis titles to make the visualization more comprehensive: we can set the x-axis title to "Quarter", y-axis title to "Product ID", color title to "Sales" and column title to "Year", the final visualization is shown as follows. It looks pretty good, isn’t it?</p>

        <div className="centered-img">
          <figure>
            <img className="step-img" src={tutorialImages["task.png"]} width="50%" />
          </figure>
        </div>
     
        <p>Now that we finished our visualization. We can export the visualization by downloading it to the computer (use “Download .png” or “Download .svg” using actions in the editor) or open in Vega editor (use “Export to Vega editor” option) for more advanced editing. </p>
   
        <hr />

        <h4 id="summary">Summary</h4>
          <p>In this tutorial, we presented how to create a heatmap by demonstrating a mini heatmap of the sales data. We can use Falx to create following types of data visualizations (and what we should demonstrate in the mini visualization):</p>
          <ul>
            <li>Line Chart (demonstrating line segments)</li>
            <li>Scatter Plot (demonstrating points)</li>
            <li>Area Chart (demonstrating areas)</li>
            <li>Bar Chart (demonstrating bars)</li>
            <li>Heatmap (demonstrating rectangles)</li>
            <li>Stacked Bar Chart (demonstrating bars with different colors)</li>
            <li>Stacked Area Chart (demonstrating areas with different colors)</li>
            <li>Multi-layered Visualizations (demonstrating more than one types of elements)</li>
            <li>Subplots / Faceted Visualizations (demonstrating any chart above with non-empty column properties)</li>
          </ul>
          <p>Now you have pretty much learned everything about Falx, it's time to <Link to="/tool">try it out</Link> to create some visualizations.</p>
      </div>
    );
  }
}

export default Tutorial;

