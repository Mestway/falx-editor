import React, { Component } from "react";
import ReactDOM from "react-dom";

import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Button as MaterialButton } from '@material-ui/core';
import Button from 'react-bootstrap/Button';
import Select from '@material-ui/core/Select';

import Dropdown from 'react-bootstrap/Dropdown';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';

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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import MessageIcon from '@material-ui/icons/Message';

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
import TagEditor from "./TagEditor.jsx"
import Draggable from 'react-draggable'; // The default
import AnimateOnChange from 'react-animate-on-change';

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import TaskGallery from "./TaskGallery.jsx"
//import TaskGallery from "./StudyTasks.jsx"

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const galleryImages = importAll(require.context('../gallery-images', false, /\.(png|jpe?g|svg)$/));

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
      task: "",
      data: [],
      dataValues: [],
      //spec: null,
      constants: [],
      tags: [],
      tagEditorOpen: -1,
      synthTaskToken: 0, // the token represents the current synthesis task is running
      synthResult: [],
      status: "No result to show",
      message: [],
      messageOpen: false,
      dataUploadDialog: false,
      dataUploadText: "",
      galleryDialog: false,
      updateVisPreview: false,
      loadGalleryInExerciseMode: false,
      displayPanelSize: 450,
      demoHistory: [] // log all demonstrations created by the user
    };
    this.onFilesChange = this.onFilesChange.bind(this);
    this.messageBtnRef = React.createRef();
  }

  // handles tag updates
  updateTags(newTags, dataValues=null) {
    // use this function to wrap all tag updates
    this.setState({tags: newTags});

    const values = dataValues == null ? this.state.dataValues : dataValues;
    if (dataValues != null) {
      // update data values if it is null
      this.setState({dataValues : dataValues});
    } 

    var newMessage = []
    for (var i = 0; i < newTags.length; i ++) {
      const tag = newTags[i];
      for (const [key, value] of Object.entries(tag["props"])) {
        if (typeof value == "string" && isNaN(value)) {
          // if we find an entry from the demo that cannot be derived from the input data
          if (values.length > 0 && values.indexOf(value) == -1) {
            newMessage.push(<span>Falx won't be able to derive the value <span className="message-color-style">{value}</span> 
              {" "} (in <span className="message-color-style">{tag["type"] + " #" + (i + 1)}</span>) from the input table.</span>);
          }
        }
      }
    }
    if (newMessage.length > 0) {
      newMessage.push(<span>To proceed, try fixing value errors (if they are typos) or removing elements that contain errors.</span>)
    }
   
    this.updateMessage(newMessage, "demo");
  }
  updateData(data, tags=[], task="") {
    // use this function to wrap all data updates
    // calculate what values are contained in the input table
    var values = []
    var splittedValues = []
    for (var i = 0; i < data.length; i ++) {
      const row = data[i];
      for (const [key, value] of Object.entries(row)) {
        if (i == 0) {
          values.push(key);
        }
        values.push(row[key]);
      }
    }
    values = Array.from(new Set(values));
    values.forEach(v => {
      if (typeof v == "string") {
        ["-", "_"].forEach(sep => {
          if (v.indexOf(sep) > -1) {
            v.split(sep).forEach(seg => {
              splittedValues.push(seg);
            })
          }
        })
      }
    })
    // stores all possible values that can be derived form the input table
    const dataValues = Array.from(new Set(values.concat(splittedValues)));
    this.setState({data: data, dataValues: dataValues, displayPanelSize: 600, demoHistory: []});
    this.updateTags(tags, dataValues);
    this.setState({ task: task });
  }
  updateMessage(rawMessages, source) {
    // update message will delete message of the same type and then set older message as "old"
    const newMessage = rawMessages.map(m => ({"source": source, "body": m, status: "new"}));

    // if (newMessage.length > 0)
    //   newMessage.push("Please check if there is a typo in the input. Or, consider removing attributes.")
    const updatedMessage = newMessage.concat(this.state.message
      .filter(m => (m["source"] != source))
      .map(m => ({"source": m["source"], "status": "old", "body": m["body"]})));
    this.setState({message: updatedMessage, messageOpen: updatedMessage.length > 0});
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
      this.updateData(data);
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
      this.updateData(data);
    }
    this.setState({ dataUploadDialog: false });
  }
  handleUploadedDataChange(e) {
    this.setState({ dataUploadText: e.target.value});
  }
  removeTag(i) {
    // add a tag
    const newTags = [ ...this.state.tags ];
    newTags.splice(i, 1);
    this.setState({ tagEditorOpen: -1 });
    this.updateTags(newTags);
  }
  addTagElement(tagName) {
    // add a new element to tags of the current input example
    const newTags = [ ...this.state.tags ];
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
    this.setState({ tagEditorOpen: newTags.length - 1 });
    this.updateTags(newTags);
  }
  updateTagProperty(tagId, tag) {
    const tempTags = JSON.parse(JSON.stringify([ ...this.state.tags ]));
    tempTags[tagId] = tag;
    this.updateTags(tempTags);
    this.setState({ updateVisPreview: true });
  }
  updateSynthResultHandle(index, newSpec) {
    var newResults = this.state.synthResult;
    newResults[index]["vl_spec"] = newSpec;
    this.setState({
      synthResult: newResults
    })
  }
  runSynthesis() {

    if (this.state.data.length == 0) {
      this.setState({ status: "Error: empty input data", synthResult: []})
      return;
    }

    // remove tags that contain null values
    const validTags = this.state.tags.filter((element) => {
      const attributes = Object.keys(element["props"]);
      return (! attributes.map(x => element["props"][x]).some(x => x == null));
    })

    console.log(validTags);

    if (validTags.length == 0) {
      this.setState({ status: "Error: empty demonstration", synthResult: []})
      return;
    }

    const taskToken = Date.now();


    const demoHistory = this.state.demoHistory;
    demoHistory.push(this.state.tags);
    this.setState({ status: "Running...", synthResult: [], synthTaskToken: taskToken, demoHistory: demoHistory});

    const taskParameter = {
      "data": this.state.data,
      "tags": validTags,
      "constants": this.state.constants,
      "token": taskToken // the token for the current synthesis task
    }

    // the function to update synthesis result
    const updateResult = (response) => {

      const result = response["result"];
      const synthStatus = (result.length == 0) ? (response["mode"] == "full" ? "No solution found ..." : "Running...") : "idle";

      console.log(this.state.synthTaskToken);
      console.log(response["token"]);

      if (this.state.synthTaskToken != response["token"]) {
        console.log("[info] ignore current synthesis result since task token changed")
        return
      }

      const proceededResult = result.map((d) => { 
        return {"vl_spec": JSON.parse(d["vl_spec"]), "rscript": d["rscript"] }; 
      })

      const fullResult = [].concat(this.state.synthResult, proceededResult.slice(this.state.synthResult.length));

      this.setState({
        synthResult: fullResult,
        status: synthStatus,
        displayPanelSize: 450
      })

      var messages = []

      if (fullResult.length == 0) {
        if (response["mode"] == "full") {
          messages.push(
            <span>Falx cannot find any program that matches the demonstration. 
            {" "} It's possible that the demonstration contains value errors (e.g., typos) or the visualization requires some data transformation unsupported by Falx.
            {" "} To proceed, try fixing value errors or simplifying the visualization.</span>)
        } else {
          messages.push(<span>Falx hasn't found any solution yet, it is still running...</span>)
        }
      } else if (fullResult.length > 10) {
        messages.push(
          <span>Falx found <span className="message-color-style">{fullResult.length}</span> visualizations that match the demonstration. 
            {" "} Consider adding more examples to help Falx narrow down the correct solution.</span>)
      } else {
        messages.push(
          <span>Falx found <span className="message-color-style">{fullResult.length}</span> visualization(s) that match the demonstration.</span>)
      }

      this.updateMessage(messages, "synthesis");
    }

    for (const mode of ["lightweight", "full"]) {
      taskParameter["mode"] = mode;
      //FALX_SERVER is a environmental vairable defined in wepack.config.js
      // prepare tags to match falx API
      fetch(FALX_SERVER + "/falx", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskParameter)
      }).then(res => res.json())
        .then(
          (response) => {
            updateResult.bind(this)(response);
          },
          (error) => {
            this.setState({
              synthResult: [],
              status: "Error",
            });
            const messages = [<span>Sorry! Falx encounted a system error. Please 
              <a href="https://github.com/Mestway/falx/issues" target="_blank">file us an issue</a>.</span>];
            this.updateMessage(messages, "synthesis");
          }
        );
    }
  }
  renderElementTags() {
    // Render element tags that displays current visual elements created by the user
    function tagToString(tagObj, index) {

      const tagId = index + 1;
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
            onClick={(()=>{this.setState({tagEditorOpen: index});}).bind(this)}>
          <div className="tag-type">{tagObj["type"] + " #" + tagId}</div>
          <div className="tag-body">{content}</div>
        </div>
      );
    }

    const elementTags = this.state.tags.map(function(tag, i) {

      const tagStr = tagToString.bind(this)(tag, i);
      const editorStatus = this.state.tagEditorOpen == i ? "editor-visible" : "editor-hidden";
      const tagAttrs = Object.keys(tag["props"]);
      const tagIncomplete = tagAttrs.map(x => tag["props"][x]).some(x => x == null);

      return (
        <li key={i} className={"tag-boxes " + (tagIncomplete ? "incomplete" : "")}>
          {tagStr}
          <TagEditor tagId={i} tagProps={tag} editorOpen={this.state.tagEditorOpen == i} 
            updateTagProperty={this.updateTagProperty.bind(this)} 
            closeTagEditor={(() => {this.setState({tagEditorOpen: -1})}).bind(this)} 
            removeTag={this.removeTag.bind(this)} />
        </li>)
    }.bind(this));

    return elementTags;
  }
  renderExampleVisualization() {
    // visualize example tags created by the users in a VegaLite chart

    // remove tags that contain null values
    const validTags = this.state.tags.filter((element) => {
      const attributes = Object.keys(element["props"]);
      return (! attributes.map(x => element["props"][x]).some(x => x == null));
    })

    const markTypes = [...new Set(validTags.map((d, i) => {return d["type"];}))];
    var previewElements = []
    for (const i in validTags){
      const markType = validTags[i]["type"];
      const tagObj = validTags[i];
      const elementID = markType + " #" + (parseInt(i) + 1);

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
        props_l["element-id"] = elementID;
        props_r["element-id"] = elementID;
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
        props_l["element-id"] = elementID;
        props_r["element-id"] = elementID;
        previewElements.push(removeUnusedProps(props_l));
        previewElements.push(removeUnusedProps(props_r));
      } else {
        var props = removeUnusedProps(tagObj["props"]);
        props["mark"] = markType;
        props["element-id"] = elementID;
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
      return (<div className="grey-message">Click "+" to add elements to your demonstration.</div>);
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
      if (channel == "column" || channel == "detail") {
        return "nominal";
      }
      if (mark == "bar") {
        if (channel == "x"){
          return "nominal"; // vType === "string" ? "nominal" : "quantitative";
        } else {
          return vType === "string" ? "nominal" : "quantitative";
        }
      }
      if (mark == "rect") {
        if (channel == "x" || channel == "y")
          return "nominal";
      }
      return vType === "string" ? "nominal" : "quantitative";
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

        if (encoding[channel]["type"] == "quantitative") {
          var values = fieldValues[channel].values.map(x => parseFloat(x));

          if (channel == "y" && "y2" in fieldValues) {
            values = values.concat(fieldValues["y2"].values.map(x => parseFloat(x)));
          }

          const maxVal = Math.max(...values);
          const minVal = Math.min(...values);
          const domainExtent = 0.1 * (maxVal - minVal);
          if (minVal - 0 > 5 * (maxVal - minVal)) {

            // do not start at non-zero when it's area chart or stacked bar chart
            if (mark != "area" && !(mark == "bar" && "color" in fieldValues && channel == "y")) {
              encoding[channel]["scale"] = {"zero": false, "domain": [minVal - domainExtent, maxVal + domainExtent]};
            }
          } else {
            encoding[channel]["scale"] = {"domain": [minVal < 0 ? minVal - domainExtent : 0, maxVal + domainExtent]};
          }
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

    const data = { "values": previewElements };

    var spec = {"height": 120};
    if (layerSpecs.length == 1) {
      var width = 120;
      var height = 120;

      for (const key in layerSpecs[0]) {
        spec[key] = layerSpecs[0][key];
      }

      // adjust height and width based on values in the encoding
      if ("x" in spec["encoding"]) {
        if (spec["encoding"]["x"]["type"] == "nominal") {
          width = 30 * globalFieldValues["x"].values.length;
        } else {
          width = 120;
        }
      }
      if ("y" in spec["encoding"]) {
        if (spec["encoding"]["y"]["type"] == "nominal") {
          height = 30 * globalFieldValues["y"].values.length;
        } else {
          height = 120;
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
    console.log(JSON.stringify(spec)); 

    return (<VegaLite spec={spec} tooltip={new Handler().call} actions={false}/>);
  }
  renderMessage() {
    // if (newMessage.length > 0)
    //   newMessage.push("Please check if there is a typo in the input. Or, consider removing attributes.")
    if (this.state.message.length > 0) {
      return (
        <ul style={{paddingLeft: "20px"}}>
          {this.state.message.map((s, i) => <li key={"message" + i} style={{"opacity": s["status"] == "new" ? 1 : 0.3, marginBottom: "8px"}}>
            {s["status"] == "new" ? (<span style={{fontSize: "12px", opacity: 0.7}}>[new]{" "}</span>) : ""} 
            {s["body"]}</li>)}
        </ul>);
    } else {
      return <p style={{fontStyle: "italic", color: "gray"}}>No message yet</p>
    }
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

    var tablePreview = (<div className="grey-message">Start by loading an example from the gallery or uploading your own input data.</div>);
    if (this.state.data.length > 0) { 
      tablePreview = (<ReactTable
        data={this.state.data}
        //resolveData={data => this.state.data.map(row => row)}
        columns={columns}
        defaultPageSize={this.state.data.length == 0 ? 5 : Math.min(this.state.data.length + 1, 8)}
        showPaginationBottom={true}
        showPageSizeOptions={false}
        className="-striped -highlight"
      />);
    }

    const galleryItems = TaskGallery
      .map(function(exampleTask, i) {

        var galleryTags = JSON.parse(JSON.stringify(exampleTask["tags"]));
        if (this.state.loadGalleryInExerciseMode) {
          // create empty tags in exercise mode
          galleryTags = galleryTags.map(e => { 
            var props = {}
            Object.entries(e["props"]).forEach(([key, val]) => { props[key] = null });
            return { "type": e["type"], "props": props }})
        }

        return (<Grid className="gallery-card" item xs={3} key={i}>
                  <Card
                    onClick={() => {
                      this.updateData(
                        JSON.parse(JSON.stringify(exampleTask["data"])), 
                        JSON.parse(JSON.stringify(galleryTags)),
                        "task" in exampleTask ? exampleTask["task"] : "");
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
                onClick={() => {
                  this.updateTags(JSON.parse(JSON.stringify(ChartTemplates[key]["tags"])));
                }}>{key}</Dropdown.Item>)
      }.bind(this));

    const data = this.state.data;

    var specs = this.state.synthResult.map((d) => {return d["vl_spec"]; });
    const tableProgs = this.state.synthResult.map((d) => { return d["rscript"]; })

    const elementTags = this.renderElementTags();
    const recommendations = (specs.length > 0 ? 
                              (<Recommendations specs={specs} tableProgs={tableProgs} 
                                  demoHistory={this.state.demoHistory}
                                  inputData={this.state.data}
                                  updateSpecHandle={this.updateSynthResultHandle.bind(this)}/>) : 
                              (<div className="output-panel">
                                {this.state.status == "Running..." ? 
                                    <div><p>Running...</p> <CircularProgress /></div> 
                                  : this.state.status}</div>));
    
    // the system message btn and the popper message
    const messageBtn = (
      <Draggable cancel=".not-draggable">
        <Badge style={{
              position: "absolute",
              left: "calc(100% - 200px)",
              top: "calc(100% - 50px)",
              zIndex: 10,
              // zIndex: this.state.message.length == 0 ? -99 : 10,
              // opacity: this.state.message.length == 0 ? 0 : 1
            }} 
          color="secondary" 
          //badgeContent={this.state.message.length}
        >
          <MaterialButton 
            onClick={(e =>  {this.setState({ messageOpen: ! this.state.messageOpen })}).bind(this)}
            ref={this.messageBtnRef}
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<MessageIcon />}
            //endIcon={this.state.messageOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
          >
              System Message
          </MaterialButton>
        </Badge>
      </Draggable>);

    const messagePopper = (
      <Popper style={{zIndex: 10}} 
          open={this.state.messageOpen /*&& this.state.message.length > 0 */} 
          anchorEl={this.messageBtnRef.current} placement="top-end" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={150}>
            <Card style={{maxWidth: "400px"}} variant="outlined">
              <CardContent style={{fontSize: "16px", "padding": "12px"}}>
                <Grid container spacing={1}>
                  <Grid item xs xs={10} style={{fontWeight: "bold"}}>System Message</Grid>
                  <Grid item xs xs={2} style={{textAlign: "right"}}>
                    <CloseIcon fontSize="small" style={{cursor: 'pointer'}}
                      onClick={() => {this.setState({messageOpen: false});}}/>
                  </Grid>
                  <Divider />
                  <Grid item xs xs={12} style={{ cursor: 'move' }}>
                    {this.renderMessage()}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Popper>)

    return (
      <ThemeProvider theme={theme}>
        <DndProvider backend={HTML5Backend} >
        <div className="editor">
          <SplitPane className="editor-plane" split="vertical" 
              minSize={450} size={this.state.displayPanelSize}
              onDragFinished={size => {
                this.setState({ displayPanelSize: size })
              }}>
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
                            <div>
                              <Typography component="span">
                                <Grid component="label" container justify="space-between" alignItems="center" spacing={1}>
                                  <Grid item> Start by selecting an example below or upload your data: </Grid>
                                  <Tooltip
                                   // leaveDelay={5000000}
                                    arrow
                                    title={<div>In exercise mode, only input data is loaded, it's your task to create demonstrations.</div>}>
                                    <Grid item>
                                        <span>
                                          Exercise mode 
                                          <HelpOutlineIcon 
                                            style={{fontSize: "12px", color: "grey", verticalAlign: "super"}}/>: {this.state.loadGalleryInExerciseMode ? "On" : "Off"}
                                        </span>
                                      <Switch checked={this.state.loadGalleryInExerciseMode}
                                        onChange={((event) => {this.setState({loadGalleryInExerciseMode : event.target.checked})}).bind(this)}
                                        name="loadGalleryInExerciseMode" color="primary"/>
                                    </Grid>
                                  </Tooltip>
                                </Grid>
                              </Typography>
                            </div>
                            <Grid container>
                              <Grid className="gallery-card" item xs={3}>
                                <Card className="upload-data-card" variant="outlined" 
                                  onClick={() => {this.setState({ dataUploadDialog: true, galleryDialog: false})}}>
                                  <CardActionArea>
                                    <CardContent className="card-content" >
                                      <CardMedia component="img" className="card-media" image={galleryImages["upload-icon.png"]} />
                                      <Typography variant="subtitle1" color="primary" align="center" 
                                        style={{ fontStyle: "italic" }} component="h6">
                                        Start with your data
                                      </Typography> 
                                    </CardContent>
                                  </CardActionArea>
                                </Card>
                              </Grid>
                              {galleryItems}
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
                            fullWidth
                            maxWidth="sm"
                            onClose={(e) => {return this.handleDataUploadDialogClose.bind(this)(false)}}
                            aria-labelledby="form-dialog-title">
                          <DialogTitle id="form-dialog-title">Upload Data</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Upload a .csv or .json file:
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
                              Or, copy and paste data (.csv or .json) to the following box to upload:
                            </DialogContentText>
                            <TextField autoFocus margin="dense"
                              id="dataUploadBox" label="Input data" type="text"
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
                  {tablePreview}
                </div>
                {( this.state.task == "" ? 
                    "": 
                    (<div>
                      <div className="seg-title">
                        <div className="title">Task</div>
                      </div>
                      <div className="task-display">
                        <div className="task-description">{this.state.task}</div>
                      </div>
                    </div>))}
                <div className="seg-title">
                  <div className="title">Demonstration</div>
                  {/*<Dropdown className="clickable-style title-action">
                    <Dropdown.Toggle as="div">
                      <MaterialButton size="small" color="primary" variant="outlined">
                        Templates <ArrowDropDownIcon />
                      </MaterialButton>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {menuItems}
                    </Dropdown.Menu>
                  </Dropdown>*/}
                </div>
                <div className="element-disp" style={{minHeight: this.state.task == "" ? "180px": "0px"}}>
                  <div className="input-tag">
                    <div className="input-tag__tags">
                      {elementTags}
                      <div className="tag-boxes" id="add-btn-li" key="plus">
                        <ContextMenuTrigger id="add-visual-element" className="okok" holdToDisplay={0}>
                          <Tooltip title="Add a new element">
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="seg-title-small">
                  <div className="title">Demonstration Preview</div>
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
        {messagePopper}
        {messageBtn}
        </DndProvider>
      </ThemeProvider>
    );
  }
}

export default Falx;