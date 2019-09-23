import React, { Component } from "react";
import ReactDOM from "react-dom";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Files from 'react-files';
import Octicon from 'react-octicon'
import ReactTable from "react-table";
import ReactTooltip from 'react-tooltip'
import SplitPane from 'react-split-pane';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';

import Recommendations from "./Recommendations.jsx"
import ChartTemplates from "./ChartTemplates.jsx"
import TaskGallery from "./TaskGallery.jsx"

// Import React Table
import "react-table/react-table.css";
import '../scss/Falx.scss';

class Falx extends Component {
  constructor() {
    super();
    this.state = {
      data: TaskGallery[0]["data"],
      spec: null,
      tags: JSON.parse(JSON.stringify(TaskGallery[0]["tags"])),
      tempTags: JSON.parse(JSON.stringify(TaskGallery[0]["tags"])),
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
      newTag = {"type": "bar", "props": {"x": "", "y": "", "color": "", "x2": "", "y2": "", "column": ""}}
    }
    if (tagName === "point") {
      newTag = {"type": "point", "props": {"x": "", "y": "", "color": "", "size": "", "column": ""}}
    }
    if (tagName === "line") {
      newTag = {"type": "line", "props": {"x1": "", "y1": "", "x2": "", "y2": "", "color": "", "column": ""}}
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
    this.setState({ status: "Running..." })

    fetch("http://127.0.0.1:5000/falx", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "data": this.state.data,
        "tags": this.state.tags,
      })
    }).then(res => res.json())
      .then(
        (result) => {
          this.setState({
            synthResult: result,
            status: "idle"
          })
        },
        (error) => {
          this.setState({
            synthResult: [],
            status: "Error"
          });
        }
      );
  }
  renderDataLoader() {

    const exampleTasks = TaskGallery
      .map(function(exampleTask, i) {
        return (<Dropdown.Item as="div" key={i} 
                onClick={() => {this.setState({
                  data: JSON.parse(JSON.stringify(exampleTask["data"])),
                  tags: JSON.parse(JSON.stringify(exampleTask["tags"])),
                  tempTags: JSON.parse(JSON.stringify(exampleTask["tags"])),
                })}}>{exampleTask["name"]}</Dropdown.Item>)
      }.bind(this));

    const menuItems = Object.keys(ChartTemplates)
      .map(function(key) {
        return (<Dropdown.Item as="div" key={key} 
                onClick={() => {this.setState({
                  tags: JSON.parse(JSON.stringify(ChartTemplates[key]["tags"])),
                  tempTags: JSON.parse(JSON.stringify(ChartTemplates[key]["tags"])),
                })}}>{key}</Dropdown.Item>)
      }.bind(this));

    return (
      <Nav className="justify-content-center cntl-btns">
        <Nav.Item>
          <Nav.Link>
            <Dropdown>
              <Dropdown.Toggle as="div">
                Falx Gallery
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {exampleTasks}
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Files className='files-dropzone' onChange={this.onFilesChange}
            onError={this.onFilesError} accepts={['.csv', '.json']} maxFileSize={1000000}
            minFileSize={0} clickable>
            <a className="nav-link" href="#">Upload Data</a>
          </Files>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>
            <Dropdown>
              <Dropdown.Toggle as="div">
                Chart Templates
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {menuItems}
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
  renderElementTags() {
    // Render element tags that displays current visual elements created by the user
    function tagToString(tagObj, tagId) {
      // maps each tag to a string
      const tagObjKeys = Object.keys(tagObj["props"])
        .filter(function(key) { return tagObj["props"][key] !== ""; })

      const content = tagObjKeys
        .map(function(key, i) {
          //const sep = (i == tagObjKeys.length - 1) ? "" : ", ";
          return (<div key={i}>
                    <span className="tag-label">{key} → </span>
                    {tagObj["props"][key]}
                  </div>);
        });
      return (
        <div className="tag-card">
          <div className="tag-type">{tagObj["type"] + " #" + tagId}</div>
          <div className="tag-body">{content}</div>
        </div>
      );
    }

    const elementTags = this.state.tags.map(function(tag, i) {
      const tagStr = tagToString(tag, i);
      // create a editor memu for each element
      const elementEditor = Object.keys(tag["props"])
        .map(function(key) {
          return (
            <MenuItem key={"element-editor" + i + key} preventClose={true} data={{ item: 'item 1' }}>
              <label htmlFor={"element-editor-input-" + i + key}>{key == "column" ? "col" : key}</label>
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
        <li key={i} className="tag-boxes">
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

      // the function to remove unused properties
      const removeUnusedProps = (props) => {
        return Object.keys(props)
                .filter((key) => {return props[key] !== "";})
                .reduce((map, key) => { map[key] = props[key]; return map; }, {});
      }

      if (markType == "line") {
        // use detail to distinguish line value from another
        var props_l = {"mark": markType, "x": tagObj["props"]["x1"], 
                       "y": tagObj["props"]["y1"], "color": tagObj["props"]["color"], "detail": i};
        var props_r = {"mark": markType, "x": tagObj["props"]["x2"], 
                       "y": tagObj["props"]["y2"], "color": tagObj["props"]["color"], "detail": i};
        props_l["element-id"] = markType + " #" + i;
        props_r["element-id"] = markType + " #" + i;
        previewElements.push(removeUnusedProps(props_l));
        previewElements.push(removeUnusedProps(props_r));
      } else {
        var props = removeUnusedProps(tagObj["props"]);
        props["mark"] = markType;
        props["element-id"] = markType + " #" + i;
        previewElements.push(props);
      } 
    }

    if (markTypes.length == 0) {
      return (<div className="grey-message">No element to preview</div>);
    }

    function processElementValues(elements) {
      // processing data type and values
      var fieldValues = {};
      const channels = ["x", "y", "color", "size", "x2", "y2", "detail", "column"];
      for (const i in channels) {
        const channel = channels[i];
        const values = [...new Set(elements.map((d) => {return d[channel];}))]
                          .filter((d) => {return d != undefined;});
        const dType = values.reduce((res, d) => {return res && !isNaN(Number(d))}, true) ? "number" : "string";
        if (values.length > 0) {
          fieldValues[channel] = {values: values, type: dType};
        }
      }
      return fieldValues;
    }

    function decideEncodingType(mark, channel, vType) {
      // given mark type, channel and value type, decide the encoding type
      if ("channel" == "column") 
        return "nominal";
      if (mark == "bar") {
        if (channel == "x"){
          return vType === "string" ? "nominal" : "quantitative";
        } else {
          return vType === "string" ? "nominal" : "quantitative"
        }
      } else {
        return vType === "string" ? "nominal" : "quantitative"
      }
    }

    const globalFieldValues = processElementValues(previewElements);

    // add place holder to make it a bit more spacious
    if ("x" in globalFieldValues && globalFieldValues["x"].type == "string")
      var xDomain = [""].concat(globalFieldValues["x"].values.concat([" "]));

    const layerSpecs = markTypes.map((mark) => {
      // obtain elements related to this layer
      const relatedElements = previewElements.filter((x) => (x["mark"] == mark));
      const fieldValues = processElementValues(relatedElements)
      var encoding = {}
      var tooltip = [{"field": "element-id", "type": "nominal", "title": "ID"}]
      for (const channel in fieldValues) {
        encoding[channel] = {"field": channel}
        if (channel != "x2" && channel != "y2") {
          // x2, y2 requires no type information as they should be consistent with x,y enc type
          encoding[channel]["type"] = decideEncodingType(mark, channel, fieldValues[channel].type);
        }
        if (channel == "x" && globalFieldValues["x"].vtype == "string") {
          // extend the deomain a little bit to make display more beautiful
          encoding[channel]["scale"] = {"domain": xDomain};
        }
        // add tooltip to the example chart
        if (channel != "detail")
          tooltip.push({"field": channel, "type": decideEncodingType(mark, channel, fieldValues[channel].type)})

        if (channel == "x") {
          encoding[channel]["axis"] = {"labelLimit": 35}
        }

        if (channel == "column") {
          encoding[channel]["header"] = {"title": null};
        }
      }
      encoding["tooltip"] = tooltip;
      const markObj = {"type": mark, "opacity": 0.8 }
      if (mark == "line") {
        markObj["point"] = true;
      }
      return {
        "mark": markObj,
        "transform": [{"filter": "datum.mark == \"" + mark + "\""}],
        "encoding": encoding,
      }
    })

    const data = {
      "values": previewElements
    };

    var spec = {"height": 150};
    if (layerSpecs.length == 1) {
      for (const key in layerSpecs[0]) {
        spec[key] = layerSpecs[0][key];
      }
      if ("column" in spec["encoding"]) {
        spec["height"] = 100;
      }
    } else {
      spec["layer"] = layerSpecs;
    }

    return (<VegaLite spec={spec} data={data} tooltip={new Handler().call}/>);
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

    var specs = this.state.synthResult.map((d) => {return JSON.parse(d["vl_spec"]); });
    const tableProgs = this.state.synthResult.map((d) => { return d["rscript"]; })

    const elementTags = this.renderElementTags();
    const recommendations = (specs.length > 0 ? 
                              (<Recommendations specs={specs} tableProgs={tableProgs}/>) : 
                              (<div className="output-panel">{this.state.status}</div>));
    return (
      <div className="editor">
        <SplitPane className="editor-plane" split="vertical" minSize={450} defaultSize={450}>
          <div className="input-panel">
            {this.renderDataLoader()}
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
                    <li className="tag-boxes" id="add-btn-li" key="plus">
                      <ContextMenuTrigger id="some_unique_identifier" className="okok" holdToDisplay={0}>
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