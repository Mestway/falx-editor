import React, { Component } from "react";
import ReactDOM from "react-dom";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Octicon from 'react-octicon'

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
      },
      tags: [
        "Rect(x=A, y=20)",
        "Rect(x=B, y=34)"
      ]
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
  removeTag(i) {
    const newTags = [ ...this.state.tags ];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
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
      <div className="editor">
        <SplitPane className="editor-plane" split="vertical" minSize={400} defaultSize={400}>
          <div className="input-panel">
            <Nav className="justify-content-center cntl-btns">
              <Nav.Item>
                <Files
                  className='files-dropzone'
                  onChange={this.onFilesChange}
                  onError={this.onFilesError}
                  accepts={['.csv', '.json']}
                  //multiple
                  //maxFiles={1}
                  maxFileSize={1000000}
                  minFileSize={0}
                  clickable>
                  <a href="#" className="nav-link">Load Data</a>
                </Files>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>Load Template</Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="table-display">
              <ReactTable
                data={this.state.data}
                //resolveData={data => this.state.data.map(row => row)}
                columns={columns}
                pageSize={Math.min(this.state.data.length, 10)}
                showPaginationBottom={true}
                showPageSizeOptions={false}
                className="-striped -highlight"
              />
            </div>
            <div className="example-chart">
              <div className="element-disp">
                <div className="input-tag">
                  <ul className="input-tag__tags">
                    { this.state.tags.map((tag, i) => (
                      <li key={tag}>
                        {tag}
                        <Octicon className="button" name="x" onClick={() => { this.removeTag(i); }}/>
                      </li>
                    ))}
                    <li id="add-btn-li" key="plus">
                        <Octicon name="plus" className="add-btn"/>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="chart-disp">
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
                }}/>
              </div>
            </div>
          </div>
          <Recommendations specs={specs} data={data}/>
        </SplitPane>
       </div>
    );
  }
}

// const wrapper = document.getElementById("falx-interface");
// wrapper ? ReactDOM.render(<Falx />, wrapper) : false;
export default Falx;

