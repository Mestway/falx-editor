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
        {"type": "bar", "props": {"x": "A", "y": 20, "color": "", "x2": "", "y2": ""}},
        {"type": "bar", "props": {"x": "B", "y": 34, "color": "", "x2": "", "y2": ""}},
      ],
      tempTags: [
        {"type": "bar", "props": {"x": "A", "y": 20, "color": "", "x2": "", "y2": ""}},
        {"type": "bar", "props": {"x": "B", "y": 34, "color": "", "x2": "", "y2": ""}},
      ],
      synthResult: [],
      status: "No result to show"
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
    // add a tag
    const newTags = [ ...this.state.tags ];
    const newTempTags = [ ...this.state.tempTags ];
    newTags.splice(i, 1);
    newTempTags.splice(i, 1);
    this.setState({ tags: newTags, tempTags: newTempTags });
  }
  addTagElement(tagName) {
    // add a new element to tags of the current input example
    const newTags = [ ...this.state.tags ];
    const newTempTags = [ ...this.state.tempTags ];
    var newTag = null
    if (tagName === "bar") {
      newTag = {"type": "bar", "props": {"x": "", "y": "", "color": "", "x2": "", "y2": ""}}
    }
    if (tagName === "point") {
      newTag = {"type": "point", "props": {"x": "", "y": "", "color": "", "size": ""}}
    }
    if (tagName === "line") {
      newTag = {"type": "line", "props": {"x1": "", "y1": "", "x2": "", "y2": "", "color": ""}}
    }
    newTags.push(newTag);
    newTempTags.push(JSON.parse(JSON.stringify(newTag)));
    this.setState({ tags: newTags, tempTags: newTempTags });
  }
  updateTempTagProperty(index, prop, value) {
    // update the temporary tag information
    const newTempTags = [ ...this.state.tempTags ];
    newTempTags[index]["props"][prop] = value;
    this.setState({ tempTags: newTempTags });
  }
  revertTempTagProperty() {
    // when the menu is closed, revert temp tag properties to current set properties
    const tags = [ ...this.state.tags ];
    this.setState({ tempTags: JSON.parse(JSON.stringify(tags)) });
  }
  updateTagProperty() {
    const tempTags = [ ...this.state.tempTags ];
    this.setState({ tags: JSON.parse(JSON.stringify(tempTags)) });
  }
  runSynthesis() {
    console.log(this.state.data);
    console.log(this.state.tags);
    this.setState({ status: "Running..." })
    const synthResult = [
      {
        "mark": "line",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      }
    ]

    fetch("http://127.0.0.1:5000/falx")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            synthResult: result,
            status: "idle"
          })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            synthResult: [],
            status: "Error"
          });
        }
      )

    
  }
  renderElementTags() {
    // Render element tags that displays current visual elements created by the user

    function tagToString(tagObj) {
      // maps each tag to a string
      const content = "".concat(Object.keys(tagObj["props"])
        .filter(function(key) { 
          return tagObj["props"][key] != ""; })
        .map(function(key) {
          return key + "→" + tagObj["props"][key];
        }));
      return tagObj["type"] + "(" + content + ")";
    }

    const elementTags = this.state.tags.map(function(tag, i) {
      const tagStr = tagToString(tag);
      // create a editor memu for each element
      const elementEditor = Object.keys(tag["props"])
        .map(function(key) {
          return (
            <MenuItem key={"element-editor" + i + key} preventClose={true} data={{ item: 'item 1' }}>
              <label htmlFor={"element-editor-input-" + i + key}>{key}</label>
              <input type="text" className="element-prop-editor" 
                     name={"input-box" + Math.random()} // use this to prevent Chrome to auto complete
                     id={"element-editor-input-" + i + key}
                     placeholder="empty"
                     value={this.state.tempTags[i]["props"][key]}
                     onChange={(e) => this.updateTempTagProperty(i, key, e.target.value)}
                     onKeyUp={(e) => { if (e.key === "Enter") { this.updateTagProperty();}}}/>
            </MenuItem>
        );
      }.bind(this));

      return (
        <li key={tagStr}>
          <ContextMenuTrigger className="tag-item" id={"tag" + i} holdToDisplay={0}>
            {tagStr}
          </ContextMenuTrigger>
          <ContextMenu id={"tag" + i} preventHideOnContextMenu={true} 
                       preventHideOnResize={true} preventHideOnScroll={true}
                       onShow={()=>{this.revertTempTagProperty();}}>
            {elementEditor}
            <MenuItem>
              <Button className="left-btn" variant="link" onClick={() => {this.updateTagProperty(); }}>
                Save Edits
              </Button>
              <Button className="right-btn" variant="link" onClick={() => { this.removeTag(i); }}>
                <Octicon name="trashcan"/>
              </Button>
            </MenuItem>
          </ContextMenu>
        </li>
      )
    }.bind(this));

    return elementTags;
  }
  renderExampleVisualization() {
    // visualize example tags created by the users in a VegaLite chart

    const markTypes = [...new Set(this.state.tags.map((d, i) => {return d["type"];}))];
    var previewElements = []
    for (const i in this.state.tags){
      const markType = this.state.tags[i]["type"];
      const tagObj = this.state.tags[i];
      function removeUnusedProps(props) {
        // remove unused props from the dict
        return Object.keys(props)
                .filter((key) => {return props[key] != "";})
                .reduce((map, key) => { map[key] = props[key]; return map; }, {});
      }
      if (markType == "line") {
        var props_l = {"mark": markType, "x": tagObj["props"]["x1"], "y": tagObj["props"]["y1"], "color": tagObj["props"]["color"]};
        var props_r = {"mark": markType, "x": tagObj["props"]["x2"], "y": tagObj["props"]["y2"], "color": tagObj["props"]["color"]};
        previewElements.push(removeUnusedProps(props_l));
        previewElements.push(removeUnusedProps(props_r));
      } else {
        var props = removeUnusedProps(tagObj["props"]);
        props["mark"] = markType;
        previewElements.push(props);
      } 
    }

    if (markTypes.length == 0) {
      return (<div className="grey-message">No element to preview</div>);
    }

    const xValues = [...new Set(previewElements.map((d) => {return d["x"];}))].filter((x) => {return x != undefined;});
    const yValues = [...new Set(previewElements.map((d) => {return d["y"];}))].filter((x) => {return x != undefined;});

    const xDomain = [""].concat(xValues.concat([" "]));

    const layerSpecs = markTypes.map((mark) => {
      return {
        "mark": {"type": mark, "opacity": 0.8 },
        "transform": [{"filter": "datum.mark == \"" + mark + "\""}],
        "encoding": {
          "x": {"field": "x", "type": "nominal", "scale": {"domain": xDomain}},
          "y": {"field": "y", "type": "quantitative"}
        }
      }
    })

    const spec = {
      "width": 150,
      "height": 150,
      "layer": layerSpecs
    };
    const data = {
      "values": previewElements
    };

    return (<VegaLite spec={spec} data={data}/>);
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
    const data = this.state.data;
    const specs = this.state.synthResult;

    const elementTags = this.renderElementTags();
    const recommendations = (specs.length > 0 ? 
                              (<Recommendations specs={specs} data={data}/>) : 
                              (<div className="output-panel">{this.state.status}</div>));

    return (
      <div className="editor">
        <SplitPane className="editor-plane" split="vertical" minSize={400} defaultSize={400}>
          <div className="input-panel">
            <Nav className="justify-content-center cntl-btns">
              <Nav.Item>
                <Files className='files-dropzone' onChange={this.onFilesChange}
                  onError={this.onFilesError} accepts={['.csv', '.json']} maxFileSize={1000000}
                  minFileSize={0} clickable>
                  <a href="#" className="nav-link">Load Data</a>
                </Files>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>Load Template</Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="input-display">
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
                        <MenuItem>
                          <Button className="add-btn-menu-btn" variant="outline-primary" onClick={() => {this.addTagElement("bar") ;}}>
                            bar
                          </Button>
                          <Button className="add-btn-menu-btn" variant="outline-primary" onClick={() => {this.addTagElement("point") ;}}>
                            point
                          </Button>
                          <Button className="add-btn-menu-btn" variant="outline-primary" onClick={() => {this.addTagElement("line") ;}}>
                            line
                          </Button>
                        </MenuItem>
                      </ContextMenu>
                      <ReactTooltip />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="chart-disp">
                {this.renderExampleVisualization()}
              </div>
              <div className="bottom-cntl">
                <Button variant="outline-primary" onClick={() => {this.runSynthesis();}}>
                  Synthesize
                </Button>
              </div>
            </div>
          </div>
          { recommendations }
        </SplitPane>
       </div>
    );
  }
}

export default Falx;

