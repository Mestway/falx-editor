import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "./Input.jsx";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import SplitPane from 'react-split-pane';
import classNames from 'classnames';
import ReactTable from "react-table";
import VegaLite from 'react-vega-lite';
import Files from 'react-files';

import Recommendations from "./Recommendations.jsx"

// Import React Table
import "react-table/react-table.css";
import '../scss/Falx.scss';

class Falx extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        {"a": "A","b": 20}, {"a": "B","b": 34}, {"a": "C","b": 55},
        {"a": "D","b": 19}, {"a": "E","b": 40}, {"a": "F","b": 34},
        {"a": "G","b": 91}, {"a": "H","b": 78}, {"a": "I","b": 25}
      ],
      spec: {
        "description": "A simple bar chart with embedded data.",
        "mark": "bar",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      }
    };
    this.onFilesChange = this.onFilesChange.bind(this);
  }
  onFilesChange(files) {
    const file = files[0]
    var reader = new FileReader();
    reader.onload = function(event) {
      // The file's text will be printed here
      console.log(event.target.result);
      this.setState({
        data: JSON.parse(event.target.result)
      });
    }.bind(this);
    reader.readAsText(file);
  }
  onFilesError(error, file) {
    console.log('error code ' + error.code + ': ' + error.message)
  }
  render() {

    const columns = []
    if (this.state.data.length > 0) {
      const keys = Object.keys(this.state.data[0]);
      for (const i in keys) {
        columns.push({
          Header: keys[i],
          accessor: keys[i]
        })
      }
    }

    // const contextCharts = [
    //   (
    //     <div key={index} className={classes}>
    //       <VegaLiteChart vlSpec={spec} renderer="canvas" actions={false} />
    //       <div className="backdrop"></div>
    //       <div className="cost">
    //         {`${index === 0 ? 'cost: ' : ''}${this.props.results.models[index].costs[0]}`}
    //       </div>
    //     </div>
    //   )
    // ];

    // const ani = <AnimateOnChange
    //   baseClassName="chart"
    //   animationClassName="update"
    //   animate={this.state.updateFocus}>
    //     <VegaLiteChart vlSpec={focusSpec} renderer="svg" />
    // </AnimateOnChange>

    const data = [
      {"a": "A","b": 20}, {"a": "B","b": 34}, {"a": "C","b": 55},
      {"a": "D","b": 19}, {"a": "E","b": 40}, {"a": "F","b": 34},
      {"a": "G","b": 91}, {"a": "H","b": 78}, {"a": "I","b": 25}
    ]
    const specs = [
        {
          "mark": "line",
          "encoding": {
            "x": {"field": "a", "type": "ordinal"},
            "y": {"field": "b", "type": "quantitative"}
        }
        },{
          "mark": "bar",
          "encoding": {
            "x": {"field": "a", "type": "ordinal"},
            "y": {"field": "b", "type": "quantitative"}
          }
        },{
          "mark": "point",
          "encoding": {
            "x": {"field": "a", "type": "ordinal"},
            "y": {"field": "b", "type": "quantitative"}
          }
        },{
          "mark": "circle",
          "encoding": {
            "x": {"field": "a", "type": "ordinal"},
            "y": {"field": "b", "type": "quantitative"}
          }
        },{
          "mark": "rect",
          "encoding": {
            "x": {"field": "a", "type": "ordinal"},
            "y": {"field": "b", "type": "quantitative"}
          }
        },{
          "mark": "text",
          "encoding": {
            "x": {"field": "a", "type": "ordinal"},
            "y": {"field": "b", "type": "quantitative"}
          }
        },{
          "mark": "bar",
          "encoding": {
            "y": {"field": "a", "type": "ordinal"},
            "x": {"field": "b", "type": "quantitative"}
          }
        }
      ]

    return (
      <SplitPane className="editor" split="vertical" minSize={200} defaultSize={200}>
        <div id="control-panel">
          <ButtonGroup vertical>
            <Button variant="outline-primary">
              <Files
                className='files-dropzone'
                onChange={this.onFilesChange}
                onError={this.onFilesError}
                accepts={['image/png', '.csv', '.json']}
                //multiple
                //maxFiles={1}
                maxFileSize={1000000}
                minFileSize={0}
                clickable>
                Load Data
              </Files>
            </Button>
            <Button variant="outline-primary">
              Add Component
            </Button>
          </ButtonGroup>
        </div>
        <SplitPane split="vertical" minSize={300} defaultSize={300}>
          <div className="input-panel">
            <div className="table-display">
              <ReactTable
                  data={this.state.data}
                  //resolveData={data => this.state.data.map(row => row)}
                  columns={columns}
                  pageSize={Math.min(this.state.data.length, 15)}
                  showPaginationBottom={this.state.data.length > 15}
                  className="-striped -highlight"
              />
            </div>
            <div className="example-vis-display">
              <VegaLite spec={{
                  "mark": "bar",
                  "width": 150,
                  "height": 150,
                  "encoding": {
                    "x": {"field": "x", "type": "nominal", "scale": {"domain": ["A","B"," ","  ","   "]}},
                    "y": {"field": "y", "type": "quantitative", "scale": {"domain": [0, 100]}}
                  }
                }} data={{
                "values": [
                  {"x": "A","y": 20}, {"x": "B","y": 34}
                ]
              }} />
              <ul>
                <li>Rect(x=A, y=20)</li>
                <li>Rect(x=B, y=34)</li>
              </ul>
            </div>
          </div>
          <Recommendations specs={specs} data={data}/>
        </SplitPane>
       </SplitPane>
    );
  }
}

// const wrapper = document.getElementById("falx-interface");
// wrapper ? ReactDOM.render(<Falx />, wrapper) : false;
export default Falx;

