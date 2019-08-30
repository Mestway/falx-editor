import React, { Component } from "react";
import ReactDOM from "react-dom";

import classNames from 'classnames';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Files from 'react-files';
import Octicon from 'react-octicon'
import ReactTable from "react-table";
import ReactTooltip from 'react-tooltip'
import SplitPane from 'react-split-pane';
import VegaLite from 'react-vega-lite';


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
        {"type": "rect", "props": {"x": "A", "y": 20}},
        {"type": "rect", "props": {"x": "B", "y": 34}},
      ],
      tempTags: [
        {"type": "rect", "props": {"x": "A", "y": 20}},
        {"type": "rect", "props": {"x": "B", "y": 34}},
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
    const newTempTags = [ ...this.state.tempTags ];
    newTags.splice(i, 1);
    newTempTags.splice(i, 1);
    this.setState({ tags: newTags, tempTags: newTempTags });
  }
  handleClick(e, data) {
    console.log(data.foo);
  }
  updateTempTagProperty(index, prop, value) {
    const newTempTags = [ ...this.state.tempTags ];
    newTempTags[index]["props"][prop] = value;
    this.setState({ tempTags: newTempTags });
  }
  revertTempTagProperty() {
    const tags = [ ...this.state.tags ];
    this.setState({ tempTags: JSON.parse(JSON.stringify(tags)) });
  }
  updateTagProperty() {
    const tempTags = [ ...this.state.tempTags ];
    this.setState({ tags: JSON.parse(JSON.stringify(tempTags)) });
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

    function tagToString(tagObj) {
      const content = "".concat(Object.keys(tagObj["props"]).map(function(key, index) {
        return tagObj["props"][key] + "→" + key;
      }));
      return tagObj["type"] + "(" + content + ")";
    }

    const elementTags = this.state.tags.map(function(tag, i) {
      const tagStr = tagToString(tag);

      const elementEditor = Object.keys(tag["props"]).map(function(key, idx) {
        return (
          <MenuItem key={"element-editor" + i + key} preventClose={true} data={{ item: 'item 1' }}>
            <label htmlFor={"element-editor-input-" + i + key}>{key}: </label>
            <input type="text" className="element-prop-editor" 
                   id={"element-editor-input-" + i + key} 
                   value={this.state.tempTags[i]["props"][key]}
                   onChange={(e) => this.updateTempTagProperty(i, key, e.target.value)}/>
          </MenuItem>
        );
      }.bind(this));

      return (
        <li key={tagStr}>
          <ContextMenuTrigger id={"tag" + i} holdToDisplay={0}>
            {tagStr}
          </ContextMenuTrigger>
          <ContextMenu id={"tag" + i} preventHideOnContextMenu={true} 
                       preventHideOnResize={true} preventHideOnScroll={true}
                       onHide={()=>{this.revertTempTagProperty();}}>
            {elementEditor}
            <MenuItem>
              <Button variant="success" size="sm" onClick={() => {this.updateTagProperty(); }}>
                Save
              </Button>
              <Button variant="danger" size="sm" onClick={() => { this.removeTag(i); }}>
                Delete
              </Button>
            </MenuItem>
          </ContextMenu>
        </li>
      )
    }.bind(this));

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
                    {elementTags}
                    <li id="add-btn-li" key="plus">
                      <ContextMenuTrigger id="some_unique_identifier" holdToDisplay={0}>
                        <Octicon name="plus" data-tip="Add new element" className="add-btn"/>
                      </ContextMenuTrigger>
                      <ContextMenu id="some_unique_identifier" preventHideOnContextMenu={true} 
                                   preventHideOnResize={true} preventHideOnScroll={true}>
                        <MenuItem onClick={this.handleClick} preventClose={true} data={{ item: 'item 1' }}>
                          <input type="text" name="fname" /></MenuItem>
                        <MenuItem onClick={this.handleClick} preventClose={true} data={{ item: 'item 2' }}>Menu Item 2</MenuItem>
                        <MenuItem divider />
                        <MenuItem onClick={this.handleClick} preventClose={true} data={{ item: 'item 3' }}>Menu Item 3</MenuItem>
                      </ContextMenu>
                      <ReactTooltip />
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

export default Falx;

