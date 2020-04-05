import React, { Component } from "react";
import ReactDOM from "react-dom";

import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Button as MaterialButton } from '@material-ui/core';
import Button from 'react-bootstrap/Button';
import Select from '@material-ui/core/Select';

import Dropdown from 'react-bootstrap/Dropdown';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton';

import { ContextMenu, MenuItem as ContextMenuItem, ContextMenuTrigger } from "react-contextmenu";
import Files from 'react-files';
//import ReactTable from "react-table";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import SplitPane from 'react-split-pane';
import { VegaLite } from 'react-vega';
import { Handler } from 'vega-tooltip';
import { readString } from 'react-papaparse'

import Recommendations from "./Recommendations.jsx"
import ChartTemplates from "./ChartTemplates.jsx"
import ReactTable from "./TableViewer.jsx"
import Draggable from 'react-draggable'; // The default
import AnimateOnChange from 'react-animate-on-change';

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";


import TaskGallery from "./TaskGallery.jsx"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const galleryImages = importAll(require.context('../gallery-images', false, /\.(png|jpe?g|svg)$/));

// Import React Table
//import "react-table/react-table.css";
import '../scss/Falx.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#007bff",
      contrastText: "white" //button text white instead of black
    }
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  }
});

class Falx extends Component {
  constructor(props) {

    // randomly select a task from the gallery
    const randomTaskID = Math.floor(Math.random() * TaskGallery.length);
    const data = TaskGallery[randomTaskID]["data"];

    super(props);
    this.state = {
      data: data,
      spec: null,
      constants: [],
      tags: [],
      tempTags: [],
      tagEditorOpen: -1,
      synthResult: [],
      status: "No result to show",
      dataUploadDialog: false,
      dataUploadText: "",
      galleryDialog: true,
      updateVisPreview: false

    };
    this.onFilesChange = this.onFilesChange.bind(this);
  }
  // the following two function deals with upload data from file
  onFilesChange(files) {
    const file = files[0]
    var reader = new FileReader();
    reader.onload = function(event) {
      // The file's text will be printed here
      console.log("--> loaded file");
      var data = null;
      if (file.extension == "csv") {
        // load csv data
        const csvData = readString(event.target.result.trim()).data
        const header = csvData[0];
        const content = csvData.slice(1).map((r) => {
          var row = {};
          for (var i = 0; i < header.length; i ++) {
            row[header[i]] = r[i];
          }
          return row;
        });
        console.log(JSON.stringify(content));
        data = content;
      } else {
        // load json data
        data =  JSON.parse(event.target.result);
      }
      this.setState({
        data: data
      });
    }.bind(this);
    reader.readAsText(file);
    this.setState({ dataUploadDialog: false });
  }
  onFilesError(error, file) {
    console.log('error code ' + error.code + ': ' + error.message);
    this.setState({ dataUploadDialog: false });
  }
  // the following function handle gallery related dialog
  handleGalleryDialogOpen() {
    this.setState({ galleryDialog: true });
  }
  handleGalleryDialogClose() {
    this.setState({ galleryDialog: false });
  }
  // the following two function deals with data upload dialog
  handleDataUploadDialogOpen() {
    this.setState({ dataUploadDialog: true });
  }
  handleDataUploadDialogClose(saveData) {
    if (saveData) {
      var isJSON = true;
      var data = null;
      const rawData = this.state.dataUploadText;
      try {
        data =  JSON.parse(rawData);
      } catch (e) {
        isJSON = false;
      }
      if (isJSON == false) {
        try {
          // load csv data
          const csvData = readString(rawData.trim()).data
          const header = csvData[0];
          const content = csvData.slice(1).map((r) => {
            var row = {};
            for (var i = 0; i < header.length; i ++) {
              row[header[i]] = r[i];
            }
            return row;
          });
          data = content;
        } catch(e) {
          this.setState({dataUploadTextError: true});
        }
      }
      this.setState({ data: data });
    }
    this.setState({ dataUploadDialog: false });
  }
  handleUploadedDataChange(e) {
    this.setState({ dataUploadText: e.target.value});
  }
  // handles tag updates
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
      newTag = {"type": "bar", "props": {"x": null, "y": null, "color": "", "column": ""}}
    }
    if (tagName === "float bar") {
      newTag = {"type": "bar", "props": {"x": null, "y": null, "y2": null, "color": "", "column": ""}}
    }
    if (tagName === "point") {
      newTag = {"type": "point", "props": {"x": null, "y": null, "color": "", "size": "", "column": ""}}
    }
    if (tagName === "rect") {
      newTag = {"type": "rect", "props": {"x": null, "y": null, "color": null, "column": ""}}
    }
    if (tagName === "line") {
      newTag = {"type": "line", "props": {"x1": null, "y1": null, "x2": null, "y2": null, "color": "", "column": ""}}
    }
    if (tagName === "area") {
      newTag = {
        "type": "area", 
        "props": {
          "x_left": "", "y_top_left": "", "y_bot_left": "",
          "x_right": "", "y_top_right": "", "y_bot_right": "",
          "color": "", "column": ""
        }
      }
    }
    if (tagName === "copy") {
      // copy the last element
      if (newTags.length > 0) {
        newTag = JSON.parse(JSON.stringify(newTags[newTags.length - 1]));
      }
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
    this.setState({ tags: JSON.parse(JSON.stringify(tempTags)), updateVisPreview: true });
  }
  runSynthesis() {

    if (this.state.data.length == 0) {
      this.setState({ status: "Error: empty input data", synthResult: []})
      return;
    }
    if (this.state.tags.length == 0) {
      this.setState({ status: "Error: empty demonstration", synthResult: []})
      return;
    }
    this.setState({ status: "Running...", synthResult: []})

    //FALX_SERVER is a environmental vairable defined in wepack.config.js
    // prepare tags to match falx API
    fetch(FALX_SERVER + "/falx", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "data": this.state.data,
        "tags": this.state.tags,
        "constants": this.state.constants
      })
    }).then(res => res.json())
      .then(
        (result) => {
          const synthStatus = (result.length == 0) ? "No solution found ..." : "idle";
          this.setState({
            synthResult: result,
            status: synthStatus
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
  renderElementTags() {
    // Render element tags that displays current visual elements created by the user
    function tagToString(tagObj, tagId) {
      // maps each tag to a string
      const tagObjKeys = Object.keys(tagObj["props"])
          .filter(function(key) { return tagObj["props"][key] !== ""; });

      const content = tagObjKeys
        .map(function(key, i) {
          //const sep = (i == tagObjKeys.length - 1) ? "" : ", ";
          return (<div key={i}>
                    <span className="tag-label">{key} → </span>
                    {tagObj["props"][key] == null ? "?" : tagObj["props"][key]}
                  </div>);
        });
      return (
        <div className="tag-card" 
            onClick={(()=>{this.setState({tagEditorOpen: tagId}); this.revertTempTagProperty();}).bind(this)}>
          <div className="tag-type">{tagObj["type"] + " #" + tagId}</div>
          <div className="tag-body">{content}</div>
        </div>
      );
    }

    /*<label htmlFor={"element-editor-input-" + i + key}>{key == "column" ? "column" : key}</label>
              <input type="text" className="element-prop-editor" 
                     name={"input-box" + Math.random()} // use this to prevent Chrome to auto complete
                     id={"element-editor-input-" + i + key}
                     placeholder="empty"
                     value={val}
                     onChange={(e) => this.updateTempTagProperty(i, key, e.target.value)}
                     onKeyUp={(e) => { if (e.key === "Enter") { this.updateTagProperty();}}}/>*/

    const elementTags = this.state.tags.map(function(tag, i) {
      const tagStr = tagToString.bind(this)(tag, i);
      // create a editor memu for each element
      const elementEditor = Object.keys(tag["props"])
        .map(function(key) {
          const val = this.state.tempTags[i]["props"][key] == null ? "" : this.state.tempTags[i]["props"][key];
          return (
            <Grid item xs className="not-draggable" key={"element-editor-" + i + key} xs={6}>
              <TextField 
                key={"element-editor-field" + i + key}
                id={"mui-element-editor-input-" + i + key}
                label={(key == "column" ? "column" : key) + ""} 
                margin="dense"
                size="small"
                autoComplete='off'
                value={val}
                placeholder="empty"
                variant="outlined"
                InputLabelProps={{shrink: true,}}
                onChange={(e) => this.updateTempTagProperty(i, key, e.target.value)}
                onKeyUp={(e) => { if (e.key === "Enter") { this.updateTagProperty();}}}/>
            </Grid>
        );
      }.bind(this));

      var editorStatus = "editor-hidden";
      if (this.state.tagEditorOpen == i) {
        editorStatus = "editor-visible";
      }

      return (
        <li key={i} className="tag-boxes">
          {tagStr}
          <Draggable cancel=".not-draggable">
            <Card id={"tag" + i} className={"tag-editor-card" + " " + editorStatus}>
              <CardContent className="tag-editor-card-content">
                <Grid container spacing={1}>
                  <Grid item xs xs={10} style={{ cursor: 'move' }}>
                    <Typography variant="body1" component="h2">
                      Editing <Typography variant="inherit">{tag["type"] + " #" + i}</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs xs={2} style={{textAlign: "right",  cursor: 'move'}}>
                    <CloseIcon fontSize="small" style={{cursor: 'pointer'}}
                      onClick={() => {this.setState({tagEditorOpen: -1});}}/>
                  </Grid>
                  <Divider />
                  {elementEditor}
                </Grid>
              </CardContent>
              <CardActions className="tag-editor-card-action">
                <ButtonGroup className="left-btn" color="secondary" size="small" aria-label="outlined primary button group">
                  <MaterialButton aria-label="delete" color="secondary" onClick={() => { this.removeTag(i); }}>
                    Delete
                  </MaterialButton>
                </ButtonGroup>
                <ButtonGroup className="right-btn" color="primary" size="small" aria-label="outlined primary button group">
                  <MaterialButton 
                    onClick={() => {this.updateTagProperty(); this.setState({tagEditorOpen: -1});}}>
                    Save
                  </MaterialButton>
                  <MaterialButton onClick={() => {
                      this.setState({tagEditorOpen: -1});
                    }}>Cancel</MaterialButton>
                </ButtonGroup>
              </CardActions>
            </Card>
          </Draggable>
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
      } else if (markType == "area") {
        // use detail to distinguish area values from each other
        var props_l = {"mark": markType, "x": tagObj["props"]["x_left"], 
                        "y": tagObj["props"]["y_top_left"], "y2": tagObj["props"]["y_bot_left"], 
                        "color": tagObj["props"]["color"], "detail": i};
        var props_r = {"mark": markType, "x": tagObj["props"]["x_right"], 
                        "y": tagObj["props"]["y_top_right"], "y2": tagObj["props"]["y_bot_right"], 
                        "color": tagObj["props"]["color"], "detail": i};
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

    // if the demonstration contains only null elements, we'll ask the user to edit before showing preview
    var allNull = true;
    for(const i in previewElements) {
      const element = previewElements[i];
      const attributes = Object.keys(element).filter((x) => (x != "mark" && x != "element-id" && x != "detail"));
      const values = attributes.map(x => element[x]);
      if (! values.every(x => x == null)) {
        allNull = false;
        break
      }
    }

    if (markTypes.length == 0) {
      return (<div className="grey-message">Add elements above to enable preview.</div>);
    }
    if (allNull) {
      return (<div className="grey-message">Edit elements above to enable preview.</div>);
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
      if (channel == "column") 
        return "nominal";
      if (mark == "bar") {
        if (channel == "x"){
          return "nominal"; // vType === "string" ? "nominal" : "quantitative";
        } else {
          return vType === "string" ? "nominal" : "quantitative"
        }
      } 
      return vType === "string" ? "nominal" : "quantitative"
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
        encoding[channel] = { "field": channel }
        if (channel == "color") {
          encoding[channel]["type"] = decideEncodingType(mark, channel, fieldValues[channel].type);
        }
        if (channel != "x2" && channel != "y2") {
          // x2, y2 requires no type information as they should be consistent with x,y enc type
          encoding[channel]["type"] = decideEncodingType(mark, channel, fieldValues[channel].type);
        }

        if (channel == "x" && globalFieldValues["x"].type == "string") {
          // extend the deomain a little bit to make display more beautiful
          // encoding[channel]["scale"] = {"domain": xDomain};

          // bar chart will not sort entries
          if (mark == "bar") {
            encoding[channel]["sort"] = null;
          }
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
      var width = 150;
      var height = 150;

      for (const key in layerSpecs[0]) {
        spec[key] = layerSpecs[0][key];
      }

      // adjust height and width based on values in the encoding
      if ("x" in spec["encoding"]) {
        if (spec["encoding"]["x"]["type"] == "nominal") {
          width = 30 * globalFieldValues["x"].values.length;
        } else {
          width = 150;
        }
      }
      if ("y" in spec["encoding"]) {
        if (spec["encoding"]["y"]["type"] == "nominal") {
          height = 30 * globalFieldValues["y"].values.length;
        } else {
          height = 150;
        }
      }

      spec["width"] = width;
      spec["height"] = height;

      if ("column" in spec["encoding"]) {
        spec["height"] = spec["height"] / 1.5;
        spec["width"] = spec["width"] / 1.5;
      }
    } else {
      spec["layer"] = layerSpecs;
    }

    spec["data"] = data

    //debug helper: print vis spec with data
    //console.log(JSON.stringify(spec)); 

    return (<VegaLite spec={spec} tooltip={new Handler().call} actions={false}/>);
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

    const galleryItems = TaskGallery
      .map(function(exampleTask, i) {
        return (<Grid className="gallery-card" item xs={3} key={i}>
                  <Card
                    onClick={() => {
                      this.setState({
                        data: JSON.parse(JSON.stringify(exampleTask["data"])),
                        tags: JSON.parse(JSON.stringify(exampleTask["tags"])),
                        tempTags: JSON.parse(JSON.stringify(exampleTask["tags"]))});
                      this.handleGalleryDialogClose();
                    }}>
                    <CardActionArea>
                      <CardContent className="card-content">
                        <Typography variant="subtitle1" component="h6">
                          {exampleTask["name"]}
                        </Typography> 
                        <CardMedia
                          component="img"
                          className="card-media"
                          image={galleryImages[exampleTask["preview"]]}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>)
      }.bind(this));

    const menuItems = Object.keys(ChartTemplates)
      .map(function(key) {
        return (<Dropdown.Item as="div" key={key} 
                onClick={() => {this.setState({
                  tags: JSON.parse(JSON.stringify(ChartTemplates[key]["tags"])),
                  tempTags: JSON.parse(JSON.stringify(ChartTemplates[key]["tags"])),
                })}}>{key}</Dropdown.Item>)
      }.bind(this));

    const data = this.state.data;

    var specs = this.state.synthResult.map((d) => {return JSON.parse(d["vl_spec"]); });
    const tableProgs = this.state.synthResult.map((d) => { return d["rscript"]; })

    const elementTags = this.renderElementTags();
    const recommendations = (specs.length > 0 ? 
                              (<Recommendations specs={specs} tableProgs={tableProgs}/>) : 
                              (<div className="output-panel">
                                {this.state.status == "Running..." ? 
                                    <div><p>Running...</p> <CircularProgress /></div> 
                                  : this.state.status}</div>));
    return (
      <ThemeProvider theme={theme}>
        <div className="editor">
          <SplitPane className="editor-plane" split="vertical" minSize={450} defaultSize={450}>
            <div className="input-panel">
              <div className="input-display">
                <div className="seg-title">
                  <div className="title">Input Data</div>
                  <div className="title-action">
                    <ul>
                      <li> 
                        <MaterialButton size="small" color="primary" variant="outlined"
                         onClick={this.handleGalleryDialogOpen.bind(this)}>
                          View Gallery +
                        </MaterialButton>
                        <Dialog 
                            className="gallery-dialog"
                            open={this.state.galleryDialog} maxWidth={"md"}
                            scroll="paper" fullWidth
                            onClose={this.handleGalleryDialogClose.bind(this)}
                            aria-labelledby="form-dialog-title">
                          <DialogTitle id="form-dialog-title">
                            Gallery
                            <IconButton className="gallery-close-btn" aria-label="close" 
                              onClick={this.handleGalleryDialogClose.bind(this)}>
                              <CloseIcon />
                            </IconButton>
                          </DialogTitle>
                          <DialogContent>
                            <Grid container>
                              {galleryItems}
                              <Grid className="gallery-card" item xs={3}>
                                <Card
                                  className="upload-data-card"
                                  variant="outlined"
                                  onClick={() => {
                                    this.setState({
                                      dataUploadDialog: true,
                                      galleryDialog: false
                                    })
                                  }}>
                                  <CardActionArea>
                                    <CardContent className="card-content" >
                                      <CardMedia
                                        component="img"
                                        className="card-media"
                                        image={galleryImages["upload-icon.png"]}
                                      />
                                      <Typography variant="subtitle1" color="primary" align="center" 
                                        style={{ fontStyle: "italic" }} component="h6">
                                        Start with your data
                                      </Typography> 
                                    </CardContent>
                                  </CardActionArea>
                                </Card>
                              </Grid>
                            </Grid>
                          </DialogContent>           
                        </Dialog>
                      </li>
                      <li>
                        <MaterialButton size="small" color="primary" variant="outlined" 
                        onClick={this.handleDataUploadDialogOpen.bind(this)}>
                          Upload Data
                        </MaterialButton>
                        <Dialog open={this.state.dataUploadDialog} 
                            onClose={(e) => {return this.handleDataUploadDialogClose.bind(this)(false)}}
                            aria-labelledby="form-dialog-title">
                          <DialogTitle id="form-dialog-title">Upload Data</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Upload a .csv or .json file from your local storage:
                            </DialogContentText>

                            <DialogContentText>
                              <MaterialButton color="primary" variant="outlined">
                                <Files className='files-dropzone' onChange={this.onFilesChange}
                                  onError={this.onFilesError} accepts={['.csv']} maxFileSize={1000000}
                                  minFileSize={0} clickable>
                                  Upload Data (.csv)
                                </Files>
                              </MaterialButton>
                              {" "}
                              <MaterialButton color="primary" variant="outlined">
                                <Files className='files-dropzone' onChange={this.onFilesChange}
                                  onError={this.onFilesError} accepts={['.json']} maxFileSize={1000000}
                                  minFileSize={0} clickable>
                                  Upload Data (.json)
                                </Files>
                              </MaterialButton>
                            </DialogContentText>
                            
                            <DialogContentText>
                              Or, paste your input data (csv or json format) into the following box:
                            </DialogContentText>
                            <TextField autoFocus margin="dense"
                              id="dataUploadBox" label="Upload data" type="text"
                              fullWidth multiline rows={10} rowsMax={20}
                              onChange={this.handleUploadedDataChange.bind(this)}
                            />
                          </DialogContent>
                          <DialogActions>
                            <MaterialButton color="primary"
                              onClick={(e) => {return this.handleDataUploadDialogClose.bind(this)(true)}}>
                              Save
                            </MaterialButton>
                            <MaterialButton color="primary"
                              onClick={(e) => {return this.handleDataUploadDialogClose.bind(this)(false)}}>
                              Cancel
                            </MaterialButton>
                          </DialogActions>
                        </Dialog>
                      </li>
                    </ul>
                  </div>
                </div>
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
                <div className="seg-title">
                  <div className="title">Demonstration</div>
                  <Dropdown className="clickable-style title-action">
                    <Dropdown.Toggle as="div">
                      <MaterialButton size="small" color="primary" variant="outlined">
                        Templates <ArrowDropDownIcon />
                      </MaterialButton>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {menuItems}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="element-disp">
                  <div className="input-tag">
                    <ul className="input-tag__tags">
                      {elementTags}
                      <li className="tag-boxes" id="add-btn-li" key="plus">
                        <ContextMenuTrigger id="add-visual-element" className="okok" holdToDisplay={0}>
                          <Tooltip title="Add new element">
                            <IconButton aria-label="add" color="primary">
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        </ContextMenuTrigger>
                        <ContextMenu id="add-visual-element" preventHideOnContextMenu={true} 
                                     preventHideOnResize={true} preventHideOnScroll={true}>
                          <ContextMenuItem>
                            {/*disable copy last when there is no element*/
                              this.state.tags.length > 0 ? <Button className="add-btn-menu-btn" 
                                                              variant="outline-info" 
                                                              onClick={() => {this.addTagElement("copy")}}>
                                                          copy last
                                                        </Button> : ""}
                            {["bar", "float bar", "point", "rect", "line", "area"].map(
                              (item) => (
                                <Button key={item} className="add-btn-menu-btn" 
                                  variant="outline-primary" 
                                  onClick={() => {this.addTagElement(item);}}>
                                  {item}
                                </Button>))}
                          </ContextMenuItem>
                        </ContextMenu>
                      </li>
                    </ul>
                  </div>
                </div>
                <AnimateOnChange
                      baseClassName="chart-disp"
                      animationClassName="update"
                      animate={this.state.updateVisPreview}
                      onAnimationEnd={function() {this.setState({updateVisPreview: false});}.bind(this)}>
                  {this.renderExampleVisualization()}
                </AnimateOnChange>
              </div>
              <div className="bottom-cntl">
                <Button variant="outline-primary" onClick={() => {this.runSynthesis();}}>
                  Synthesize
                </Button>
              </div>
            </div>
            { recommendations }
          </SplitPane>
         </div>
      </ThemeProvider>
    );
  }
}

export default Falx;