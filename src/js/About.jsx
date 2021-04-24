import React, { Component } from "react";
import ReactDOM from "react-dom";

import '../scss/About.scss';
import AboutExample from '../images/about-example-2.png';
import FalxEditorImg from '../images/falx-editor.png';
import CreateIcon from '@material-ui/icons/Create';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// render the component

class About extends Component {

  render() {
    return (
      <div className="about-page">

        <h2><span style={{fontWeight: 600, color:"cornflowerblue"}}>Falx:</span> Synthesis-powered Visualization Authoring</h2>
        
        <h5>What's Falx?</h5>

        <p> With modern visualization tools like Tableau, ggplot2 or Vega-Lite, we can often create a visualization easily by mapping data columns to visual properties.
            However, when there is a mismatch between data layout and the design, we can't do it easily in such way. We need to spend significant effort on data transformation and visualization scripting.</p>

        {/*<p>
        Designing data visualizations is fun, but how about implementing them? In order to create a data visualization, 
          we need to prepare the data to a format expected by the tool and then choose the right combination of visualization functions to plot it. 
          This means -- if we are not current with data preparation or not very familiar with the visualization tool, 
          we need to go through a tedious and challenging process to implement our insightful visualization designs.</p>*/}

      	<p><span className="tool-name">Falx</span> is a visualization-by-example tool to bypass these challenges. In Falx, 
          we demonstrate how a few data points from the dataset would be mapped to the canvas, 
          and <span className="tool-name">Falx</span> automatically generalizes the example to visualize the full dataset. </p>
      	
        {/*<p> To use <span className="tool-name">Falx</span>, your input to the tool includes (1) a tabular dataset that you'd like to visualize 
      		and (2) a partial visualization that visualizes a small subset of the dataset. <span className="tool-name">Falx</span> will then synthesize a visualization that generalizes your demonstration to the full dataset:
      		the output visualization will be a visualization of the full dataset that generalizes your demonstrated partial visualization.</p>
    		*/}

        <img className="centered-img" src={AboutExample} height="280px" alt="Falx Example" />

{/*        <p> Because <span className="tool-name">Falx</span> automatically prepares the data and generates the visualization script, we don't need to worry about creating them manually. Synthesized data preparation scripts is in R and the visualization script is in Vega-Lite. </p>
*/}

        <div style={{fontWeight: 400, 
                    color: "darkslategray",
                    borderWidth: "1px",
                    borderColor: "gray",
                    padding: "8px",
                    borderStyle: "dashed",
                    textAlign: "center",
                    borderRadius: "10px"}}>
            <CreateIcon /> Visit <Link to="/tool">Falx Editor</Link>,  <Link to="/tutorial">the tutorial page</Link> and <Link to="/tutorial">the quick reference</Link> to view demos and create visualizations yourself!
        </div>
        
        {/*<img className="centered-img" src={FalxEditorImg} height="300px" alt="Falx Editor Image" />
*/}


        <h5>Publications</h5>

        <p>Falx is powered by a technique named program synthesis; it generalizes user example by searching for programs that are consistent with the user inputs in the program space defined by the data transformation language and the visualization language. You can learn more about it from our research papers.</p>
        <ul>
          <li>Falx: Synthesis-Powered Visualization Authoring (CHI 2021, Best Paper) <a href="https://arxiv.org/abs/2102.01024">[link]</a></li>
          <li>Visualization by Example (POPL 2020) <a href="https://arxiv.org/abs/1911.09668">[link]</a></li>


          
        </ul>

        <h5>The Team</h5>

        <p>Falx is being developed at the <a href="http://uwplse.org/">PLSE lab</a> at University of Washington. 
           The main contributors are: <a href="http://chenglongwang.org/">Chenglong Wang</a>, <a href="https://fredfeng.github.io/">Yu Feng</a>, <a href="https://homes.cs.washington.edu/~bodik/">Ras Bodik</a>, <a href="https://www.cs.utexas.edu/~isil/">Isil Dillig</a>, <a href="https://people.eecs.berkeley.edu/~akcheung/">Alvin Cheung</a> and <a href="https://faculty.washington.edu/ajko/">Amy J. Ko</a>.</p>

        <p>If you have any questions, want to collaborate, or just want to say hi, email us at <a href="">falx@cs.washington.edu</a>.</p>

      </div>
    );
  }
}

export default About;

