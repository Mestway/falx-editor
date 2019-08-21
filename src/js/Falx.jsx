import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "./Input.jsx";
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Navbar from 'react-bootstrap/Navbar';

import VegaLite from 'react-vega-lite';

import Files from 'react-files'

// Import React Table
import ReactTable from "react-table";
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

    const visSpec = {
      "mark": "bar",
      "encoding": {
        "x": {"field": "a", "type": "ordinal"},
        "y": {"field": "b", "type": "quantitative"}
      }
    };

    const visData = {
      "values": [
        {"a": "A","b": 20}, {"a": "B","b": 34}, {"a": "C","b": 55},
        {"a": "D","b": 19}, {"a": "E","b": 40}, {"a": "F","b": 34},
        {"a": "G","b": 91}, {"a": "H","b": 78}, {"a": "I","b": 25}
      ]
    };

    return (
      <div className="falx">
        <div className="control-panel">
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
        <div className="editor container">
          <div className="row mt-2">
            <div className='col-4'>
              <ReactTable
                data={this.state.data}
                //resolveData={data => this.state.data.map(row => row)}
                columns={columns}
                pageSize={Math.min(this.state.data.length, 15)}
                showPaginationBottom={this.state.data.length > 15}
                className="-striped -highlight"
              />
            </div>
            <div className='col-8'>
              <VegaLite spec={visSpec} data={visData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const wrapper = document.getElementById("falx-interface");
// wrapper ? ReactDOM.render(<Falx />, wrapper) : false;
export default Falx;

