import React, { Component, useState, useEffect } from "react";
import classNames from 'classnames';

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { orange, pink, green } from "@material-ui/core/colors";

import ReactJson from 'react-json-view'
import Form from "react-jsonschema-form";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';

import FormHelperText from '@material-ui/core/FormHelperText';
import ListSubheader from '@material-ui/core/ListSubheader';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import BuildIcon from '@material-ui/icons/Build';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import InputAdornment from '@material-ui/core/InputAdornment';

import Tooltip from '@material-ui/core/Tooltip'

import { useDrop } from 'react-dnd';
import { useDrag } from 'react-dnd';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


import 'bootstrap/dist/css/bootstrap.min.css';

import ReactFilterBox, {AutoCompleteOption, SimpleResultProcessing, GridDataAutoCompleteHandler} from "react-filter-box";
import "react-filter-box/lib/react-filter-box.css"

import '../scss/VisEditor.scss';

const colorSchemes = {
  "categorical": ["accent", "category10", "category20", "category20b", "category20c", "tableau10", "tableau20"],
  "sequential": ["blues", "tealblues", "oranges", "reds", "purples", "warmgreys", "yellowgreenblue", "yelloworangered", "goldgreen"],
  "diverging": ["redblue", "redgrey", "redyellowblue", "redyellowgreen", "spectral", "blueorange"]
}

const channelOrder = ["x", "x2", "y", "y2", "color", "size", "shape", "column", "row"];
const allChannels = {
  "bar": ["x", "y", "color", "column", "row"],
  "rect": ["x", "y", "color", "column", "row"],
  "line": ["x", "y", "color", "column", "row"],
  "point": ["x", "y", "color", "size", "column", "shape", "row"],
  "circle": ["x", "y", "color", "size", "column", "shape", "row"],
  "tick": ["x", "y", "color", "size", "column", "shape", "row"],
  "area": ["x", "y", "color", "column", "row"],
  "boxplot": ["x", "y", "color", "column", "row"]
}

//extend this class to add your custom operator
class CustomAutoComplete extends GridDataAutoCompleteHandler {
    // override this method to add new your operator

    constructor(data, options, encoding) {
        super(data, options);
        this.encoding = encoding;
    }

    needOperators(parsedCategory) {
        var result = super.needOperators(parsedCategory);
        return [ "==", "!=", ">", "<", ">=", "<="];
    }

    needValues(_parsedCategory, parsedOperator) {
      // use table data to help autocompletion in the filter
      const parsedCategory = ("field" in this.encoding[_parsedCategory]) ? this.encoding[_parsedCategory]["field"] : _parsedCategory;

      // parsedCategory = this.tryToGetFieldCategory(parsedCategory);
      var found = _.find(this.options, f => f.columnField == parsedCategory || f.columnText == parsedCategory);

      if (found != null && found.type == "selection" && this.data != null) {
          if (!this.cache[parsedCategory]) {
              this.cache[parsedCategory] = _.chain(this.data).map(f => f[parsedCategory]).uniq().value();
          }
          return this.cache[parsedCategory];
      }
      if (found != null && found.customValuesFunc) {
          return found.customValuesFunc(parsedCategory, parsedOperator);
      }
      return [];
  }
}

class CustomReactFilterBox extends ReactFilterBox {
  constructor(props) {
    super(props);
    this.state = {
        isFocus: false,
        isError: false,
        options: this.props.options
    }
    var autoCompleteHandler = this.props.autoCompleteHandler ||
        new GridDataAutoCompleteHandler(this.props.data, this.state.options)

    this.parser.setAutoCompleteHandler(autoCompleteHandler);    
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.options!==this.props.options){
      //Perform some operation here
      this.setState({options: this.props.options});
      var autoCompleteHandler = this.props.autoCompleteHandler ||
            new GridDataAutoCompleteHandler(this.props.data, this.props.options)
      this.parser.setAutoCompleteHandler(autoCompleteHandler);
    }
  }
  needAutoCompleteValues(codeMirror, text) {
    // don't suggest brackets
    const suggestions = this.parser.getSuggestions(text);
    return suggestions.filter(entry => (entry["value"] != "(" && entry["value"] != ")"));
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#007bff",
      contrastText: "#fff" //button text white instead of black
    }
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function calcTempFilter(spec) {
  const layerIDList = ("layer" in spec) ? [...spec["layer"].keys()] : [-1]
  var tempFilters = {}
  for (var i = 0; i < layerIDList.length; i ++) {
    const layerID = layerIDList[i];
    var layerSpec = Object.assign({}, spec);
    if (layerID != -1) {
      layerSpec = Object.assign({}, spec["layer"][layerID]);
    }
    tempFilters[layerID] = "";
  }
  return tempFilters;
}

const DraggableChip = ({ channel, field, updateFunc }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { field, type: "box" },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
              updateFunc(channel, dropResult.name);
              //alert(`You dropped ${item.field} (${channel}) into ${dropResult.name}!`);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0.4 : 1;
    const cursor = isDragging ? "grabbing" : "grab";
    return (
      <Tooltip
          arrow
          title={<div style={{"maxWidth": "160px"}}>Drag and drop the field to a different axis to modify the design.</div>}>
        <span ref={drag} style={{"opacity": opacity, transform: 'translate(0, 0)', "cursor": cursor, overflow: "hidden"}} 
          size="medium" className="field-chip"><span style={{fontSize: "12px", opacity:0.8, marginRight: "5px"}}>field:</span><span>{field}</span></span>
      </Tooltip>);
};

const ChannelShelf = ({field, channel, expandBtn, updateHandle}) => {
    const [{ canDrop, isOver}, drop] = useDrop({
        channel: channel,
        field: field,
        accept: "box",
        drop: () => ({ name: channel }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    const isActive = canDrop && isOver;
    let backgroundColor = '#FFFFFF';
    if (isActive) {
        backgroundColor = "rgba(255,250,205, 1)";
    }
    else if (canDrop) {
        backgroundColor = "rgba(255,250,205, 0.4)";
    }

    const content = (field != null) ? (
      <Grid className="channel-shelf" ref={drop} style={{ "background": backgroundColor}} container alignItems="center" spacing={0} >
        <Grid item xs={12} sm={3} style={{overflow: "hidden"}}>
          <span>{channel}</span>
        </Grid>
        <Grid item xs={12} sm={7}>
          <DraggableChip channel={channel} field={field} updateFunc={updateHandle}/>
        </Grid>
        <Grid item xs={12} sm={2}>
          {expandBtn}
        </Grid>
      </Grid>) : (
      <Grid className="channel-shelf" ref={drop} style={{ "background": backgroundColor}} container alignItems="center" spacing={0} >
        <Grid item xs={12} sm={12} style={{overflow: "hidden"}}>
          <span>{channel}</span>
        </Grid>
      </Grid>);

    return content;
};

class VisEditor extends Component {

  constructor(props) {
    super(props);

    var expanderStatus = {};

    if ("layer" in props.spec) {
      for (var i = 0; i < props.spec["layer"].length; i ++) {
        
        var channels = Object.keys(props.spec["layer"][i]["encoding"]);
        for (var j in channels) {
          const keyId = "expander_" + i.toString() + "_" + channels[j];
          expanderStatus[keyId] = false;

          const encoding = props.spec["layer"][i]["encoding"][channels[j]];
          const titleId = "title_" + i.toString() + "_" + channels[j];
          const title = ("title" in encoding) ? encoding["title"] : encoding["field"];
        }
      }
    } else {
      
      var channels = Object.keys(props.spec["encoding"]);
      for (var j in channels) {
        const keyId = "expander_-1" + "_" + channels[j];
        expanderStatus[keyId] = false;

        const encoding = props.spec["encoding"][channels[j]];
        const titleId = "title_-1" + "_" + channels[j];
        const title = ("title" in encoding) ? encoding["title"][channels[j]] : encoding["field"];
      }
    }
   
    this.state = {
      tableProg: props.tableProg,
      spec: props.spec,
      tempFilters: calcTempFilter(props.spec),
      panelID: 0,
      GUIEditorLayerPanelID: 0,
      expanderStatus: expanderStatus,
      showUnusedChannel: false
    };
  }

  // keep the state live with parent updates
  static getDerivedStateFromProps(props, state) {
    if (props.spec !== state.spec || props.tableProg !== state.tableProg) {
      return { 
        spec: props.spec,
        tableProg: props.tableProg,
        tempFilters: calcTempFilter(props.spec)
      };
    }
    return null;
  }

  handlePanelChange(event, panelID) {
    this.setState({ panelID: panelID });
  };

  handleLayerPanelChange(event, layerID) {
    this.setState({ GUIEditorLayerPanelID: layerID });
  }

  handleTempFilterChange(layerID, newFilter) {
    var tempFilters = this.state.tempFilters;
    if (newFilter != '') {
      tempFilters[layerID] = newFilter;
      this.setState({
          tempFilters: tempFilters
      });
    }
  }

  handleExpanderClick(expanderKey) {
    var newExpanderStatus = this.state.expanderStatus;
    newExpanderStatus[expanderKey] = !this.state.expanderStatus[expanderKey];
    this.setState({expanderStatus: newExpanderStatus});
  }

  extractLayerFilters(layerSpec) {
    var filters = []
    if ("transform" in layerSpec) {
      for (var i = 0; i < layerSpec["transform"].length; i ++) {
        console.log(layerSpec["transform"][i]["filter"]);
        console.log(layerSpec["transform"][i]["filter"].includes("layer_id"));
        if (layerSpec["transform"][i]["filter"].includes("layer_id")) {
          filters.push({"filter": layerSpec["transform"][i]["filter"]})
        }
      }
    }
    return filters;
  }

  saveTempFilters(layerID) {
    // save temporary filter
    var newSpec = this.state.spec;
    var layerSpec = layerID != -1 ? newSpec["layer"][layerID] : newSpec;

    var filters = this.extractLayerFilters(layerSpec);

    var f = this.state.tempFilters[layerID]
    if (f !== "") {
      try {
        eval(f); 
        filters.push({"filter": f.replace("\"", "\"")});
      } catch (e) {
        if (! (e instanceof SyntaxError)) {
          filters.push({"filter": f.replace("\"", "\"")});
        } 
      }      
    }
    layerSpec["transform"] = filters;
    this.setState({
      spec: newSpec,
    })
    this.props.visSpecUpdateHandle(this.props.specIndex, newSpec);
  }

  clearFilters(layerID) {
    var newSpec = this.state.spec;
    var layerSpec = layerID != -1 ? newSpec["layer"][layerID] : newSpec;
    var newTempFilters = this.state.tempFilters;
    newTempFilters[layerID] = "";

    var filters = this.extractLayerFilters(layerSpec);
    layerSpec["transform"] = filters;

    this.setState({
      spec: newSpec,
      tempFilters: newTempFilters
    })
    this.props.visSpecUpdateHandle(this.props.specIndex, newSpec);
  }
  handleSpecPropChange(key, value, propagateToMain = true) {
    // change the spec's top level value
    var newSpec = this.state.spec;
    newSpec[key] = value;
    this.setState({
      spec: newSpec
    })
    if (propagateToMain) {
      this.props.visSpecUpdateHandle(this.props.specIndex, newSpec);
    }
  }
  handleMarkChange(layerID, key, value) {
    // change the layer's (defined by layerID) property (specified by key) into value (value)'
    var newSpec = this.state.spec;
    var layerSpec = (layerID != -1) ? newSpec["layer"][layerID] : newSpec;

    if (layerSpec["mark"].constructor == Object) {
      layerSpec["mark"][key] = value;
    } else {
      layerSpec["mark"] = {"type": layerSpec["mark"]};
      layerSpec["mark"][key] = value;
    }

    // remove interpolate if the mark is no longer line
    if (layerSpec["mark"]["type"] != "line" && "interpolate" in layerSpec["mark"]) {
      delete layerSpec["mark"]["interpolate"];
    }

    // remove stack option if the mark is no longer bar / area chart
    if (!(value == "bar" || value == "area")) {
      const channels = ["x", "y"];
      for (var i in channels) {
        const ch = channels[i];
        if (ch in layerSpec["encoding"] && "stack" in layerSpec["encoding"][ch]) {
          delete layerSpec["encoding"][ch]["stack"];
        } 
      }
    }
    this.setState({ spec: newSpec });
    this.props.visSpecUpdateHandle(this.props.specIndex, newSpec);
  }
  handleEncPropChange(layerID, channel, prop, value, propagateToMain = true) {
    // change the layer's (defined by layerID) channel's property (specified by key) into value (value)'
    var newSpec = this.state.spec;
    var encoding = null;
    if (layerID != -1) {
      encoding = newSpec["layer"][layerID]["encoding"][channel];
    } else {
      encoding = newSpec["encoding"][channel];
    }
    encoding[prop] = value;

    if (prop == "type" && "scale" in encoding) {
      // prevent a problem that may cause menu crash
      delete encoding["scale"];
    }

    this.setState({ spec: newSpec });

    if (propagateToMain) {
      this.props.visSpecUpdateHandle(this.props.specIndex, this.state.spec)
    }
  }
  handleChannelSwap(layerID, oldChannel, newChannel, propagateToMain = true) {
    var newSpec = this.state.spec;
    if (layerID != -1) {
      if (newChannel in newSpec["layer"][layerID]["encoding"]) {
        const tempEnc = newSpec["layer"][layerID]["encoding"][newChannel];
        newSpec["layer"][layerID]["encoding"][newChannel] = newSpec["layer"][layerID]["encoding"][oldChannel];
        newSpec["layer"][layerID]["encoding"][oldChannel] = tempEnc;
      } else {
        newSpec["layer"][layerID]["encoding"][newChannel] = newSpec["layer"][layerID]["encoding"][oldChannel];
        delete newSpec["layer"][layerID]["encoding"][oldChannel];
      }
    } else {
      if (newChannel in newSpec["encoding"]) {
        const tempEnc = newSpec["encoding"][newChannel];
        newSpec["encoding"][newChannel] = newSpec["encoding"][oldChannel];
        newSpec["encoding"][oldChannel] = tempEnc;
      } else {
        newSpec["encoding"][newChannel] = newSpec["encoding"][oldChannel];
        delete newSpec["encoding"][oldChannel];
      }
    }
    this.setState({ spec: newSpec });
    if (propagateToMain) {
      this.props.visSpecUpdateHandle(this.props.specIndex, this.state.spec);
    }
  }
  genEncodingEdit(layerID, channel, encoding) {
    const sortValue = ("sort" in encoding && encoding["sort"] != null) ? encoding["sort"] : "default";
    const aggregateValue = ("aggregate" in encoding && encoding["aggregate"] != null) ? encoding["aggregate"] : "none";
    const scaleValue = ("scale" in encoding && encoding["scale"] != null) ? encoding["scale"] : {};
    const expanderKey = "expander_" + layerID.toString() + "_" + channel;
    const colorSchemeList = encoding["type"] == "nominal" ? colorSchemes["categorical"] : colorSchemes["sequential"].concat(colorSchemes["diverging"]);
    const isCategoricalColor = encoding["type"] == "nominal";

    // used for deciding mark specific props
    var layerSpec = this.state.spec;
    if (layerID != -1) {
      layerSpec = this.state.spec["layer"][layerID];
    }
    const markType = (layerSpec["mark"].constructor == Object) ? layerSpec["mark"]["type"] : layerSpec["mark"];

    var stackSelector = "";
    if (channel == "y" && markType == "bar" && "color" in layerSpec["encoding"] && !("y2" in  layerSpec["encoding"]) ) {
      const isStack = !("y" in layerSpec["encoding"] && "stack" in layerSpec["encoding"]["y"]) || layerSpec["encoding"]["y"]["stack"] != null;

      stackSelector = (
        <Grid item xs={12} sm={6}>
          <InputLabel shrink htmlFor="stack-selector">
            stack option
          </InputLabel>
          <Select fullWidth value={isStack} 
              onChange={(event) => this.handleEncPropChange.bind(this)(layerID, "y", "stack", event.target.value ? true : null)} 
              inputProps={{name: 'stack', id: 'stack-selector'}}>
            {[["stacked", true, " (default)"], 
              ["layered", false, ""]].map(
                x => <MenuItem key={x[0]} value={x[1]} selected={x[1] == isStack}>{x[0]}{x[2]}</MenuItem>)}
          </Select>
        </Grid>)
    }

    var colorSchemeSelector = "";
    if (channel == "color") {
      colorSchemeSelector = (
        <Grid item xs={12} sm={6}>
          <InputLabel shrink htmlFor="color-scheme-selector">
            color scheme
          </InputLabel>
          <Select fullWidth value={ ("scheme" in scaleValue) ? scaleValue["scheme"] : "default" }
              onChange={(event) => {
                if (event.target.value == "default") {
                  delete scaleValue["scheme"];
                } else {
                  scaleValue["scheme"] = event.target.value;
                }
                this.handleEncPropChange.bind(this)(layerID, channel, "scale", scaleValue);
              }} 
              inputProps={{name: 'aggregate', id: 'aggregate-selector'}}>
            <MenuItem key={"default"} value={"default"} 
                selected={"default" == (("scheme" in scaleValue) ? scaleValue["scheme"] : "default")}>
              {"default"}
            </MenuItem>
            {isCategoricalColor ? <ListSubheader>categorical</ListSubheader> : ""}
            {isCategoricalColor ?
              (colorSchemes["categorical"].map(
                x => <MenuItem key={x} value={x} 
                        selected={x == (("scheme" in scaleValue) ? scaleValue["scheme"] : "default")}>
                    {x}
                  </MenuItem>)) : ""}
            {isCategoricalColor ? "" : <ListSubheader>sequential</ListSubheader>}
            {isCategoricalColor ? "" : 
              (colorSchemes["sequential"].map(
                x => <MenuItem key={x} value={x} 
                        selected={x == (("scheme" in scaleValue) ? scaleValue["scheme"] : "default")}>
                    {x}
                  </MenuItem>))
            }
            {isCategoricalColor ? "" : <ListSubheader>diverging</ListSubheader>}
            {isCategoricalColor ? "" : 
              colorSchemes["diverging"].map(
                x => <MenuItem key={x} value={x} 
                        selected={x == (("scheme" in scaleValue) ? scaleValue["scheme"] : "default")}>
                    {x}
                  </MenuItem>)
            }
          </Select>
        </Grid>)
    }
                        
    return (
      <ListItem className="expander-grid" key={layerID + channel}>
        <Card className="expander-card">
          <CardContent className="expander-card-header">
            <ChannelShelf channel={channel} field={encoding["field"]}
              updateHandle={(oldChannel, newChannel) => {this.handleChannelSwap.bind(this)(layerID, oldChannel, newChannel);}}
              expandBtn={
                <IconButton aria-label="settings" style={{padding: "6px", "float": "right"}}
                            onClick={() => {this.handleExpanderClick.bind(this)(expanderKey);}}>
                  <SettingsIcon/>
                </IconButton>}
            />
          </CardContent>
          <Collapse in={this.state.expanderStatus[expanderKey]} timeout="auto" unmountOnExit>
            <CardContent className="expander-card-body">
              <Grid container alignItems="center" spacing={2}>
                {/* <Grid item xs={12} sm={3}>
                  <TextField label="axis" value={channel} fullWidth disabled />
                </Grid>*/}
                <Grid item xs={12} sm={6}>
                  <InputLabel shrink htmlFor="title">
                    title
                  </InputLabel>
                  <TextField id="title" name="title" 
                      autoComplete="off"
                      onChange={(e) => {
                        this.handleEncPropChange.bind(this)(layerID, channel, "title", event.target.value, false);
                      }}
                      onKeyUp={((e) => {
                        if (e.key === "Enter") { 
                          this.handleEncPropChange.bind(this)(layerID, channel, "title", event.target.value, false);
                          this.props.visSpecUpdateHandle(this.props.specIndex, this.state.spec); 
                        }
                      }).bind(this)}
                      //label={"title"} 
                      value={("title" in encoding) ? encoding["title"] : encoding["field"]} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel shrink htmlFor="enc-type-selector">
                    data type
                  </InputLabel>
                  <Select fullWidth value={encoding["type"]} 
                      onChange={(event) => this.handleEncPropChange.bind(this)(layerID, channel, "type", event.target.value)}
                      inputProps={{name: 'encType', id: 'enc-type-selector'}}>
                    {["quantitative", "nominal", "ordinal", "temporal"].map(
                        x => <MenuItem key={x} value={x} selected={x == encoding["type"]}>{x}</MenuItem>)}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InputLabel shrink htmlFor="sort-selector">
                    sort
                  </InputLabel>
                  <Select fullWidth value={sortValue} 
                      onChange={(event) => this.handleEncPropChange.bind(this)(layerID, channel, "sort", event.target.value)} 
                      inputProps={{name: 'sort', id: 'sort-selector'}}>
                    {[["default", "default"], 
                      ["ascending", "ascending"], 
                      ["descending", "descending"]].map(
                        x => <MenuItem key={x[0]} value={x[0]} selected={x[0] == sortValue}>{x[1]}</MenuItem>)}
                  </Select>
                </Grid>

                {encoding["type"] == "quantitative" ?
                  (<Grid item xs={12} sm={6}>
                    <InputLabel shrink htmlFor="aggregation-selector">
                      aggregate
                    </InputLabel>
                    <Select fullWidth value={aggregateValue} disabled={encoding["type"] != "quantitative"}
                        onChange={(event) => {
                          const val = event.target.value == "none" ? "" : event.target.value;
                          this.handleEncPropChange.bind(this)(layerID, channel, "aggregate", val);
                        }} 
                        inputProps={{name: 'aggregate', id: 'aggregate-selector'}}>
                      {["none", "min", "max", "sum", "average", "count"].map(
                          x => <MenuItem key={x} value={x} selected={x == aggregateValue}>{x}</MenuItem>)}
                    </Select>
                  </Grid>) : ""}

                {stackSelector}

                {colorSchemeSelector}
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      </ListItem>
    )
  }
  genUnusedEncodingEdit(layerID, channel) {
    return (
      <ListItem className="unused-expander-grid" key={layerID + channel}>
        <Card className="unused-expander-card">
          <CardContent className="expander-card-header">
            <ChannelShelf channel={channel} field={null}
              updateHandle={(oldChannel, newChannel) => {this.handleChannelSwap.bind(this)(layerID, oldChannel, newChannel);}}
              expandBtn={""}
            />
          </CardContent>
        </Card>
      </ListItem>
    )
  }
  genWidthHeighSetter(layerSpec) {
    // use a smaller maxWidth / maxHeight if column / row exists.
    const maxWidth = ("column" in layerSpec["encoding"]) ? 200 : 800;
    const maxHeight = ("row" in layerSpec["encoding"]) ? 200 : 600;
    return (
      <Grid container alignItems="center" spacing={8}>
        <Grid item xs={12} sm={6}>
          <Typography id="discrete-slider-always" className="config-sec-title" variant="subtitle1" gutterBottom>
            Width
          </Typography>
          <Slider value={this.state.spec["width"]} step={10} min={60} max={maxWidth}
            marks={[{value: 60,label: '60px'}, {value: maxWidth, label: maxWidth.toString() + 'px'}]}
            onChange={((evt, value) => {this.handleSpecPropChange.bind(this)("width", value, false);})}
            onChangeCommitted={((evt, newVal) => {this.handleSpecPropChange.bind(this)("width", newVal);})}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography id="discrete-slider-always" className="config-sec-title" variant="subtitle1" gutterBottom>
            Height
          </Typography>
          <Slider
            value={this.state.spec["height"]} step={10} min={60} max={maxHeight}
            marks={[{value: 60,label: '60px'}, {value: maxHeight,label: maxHeight.toString() + 'px'}]}
            onChange={((evt, value) => {this.handleSpecPropChange.bind(this)("height", value, false);})}
            onChangeCommitted={((evt, newVal) => {this.handleSpecPropChange.bind(this)("height", newVal);})}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>);
  }

  genMarkEditor(layerID, layerSpec) {
    const markType = (layerSpec["mark"].constructor == Object) ? layerSpec["mark"]["type"] : layerSpec["mark"];

    var lineInterpolateEditor = "";
    if (markType == "line") {
      const interpolate = ((layerSpec["mark"].constructor == Object && 
                              "interpolate" in layerSpec["mark"]) ? 
                            layerSpec["mark"]["interpolate"] : "default");
      lineInterpolateEditor = (
        <Grid item xs xs={4}>
          <InputLabel shrink id="interpolate-selector-a-label" htmlFor="interpolate-selector">
            interpolate
          </InputLabel>
          <Select fullWidth labelId="interpolate-selector-a-label" id="interpolate-selector" 
              value={interpolate} 
              onChange={((event) => {
                const val = event.target.value == "default" ? null : event.target.value;
                this.handleMarkChange(layerID, "interpolate", val)}).bind(this)}>
            {["default", "linear", "step", "step-before", "step-after", "monotone", "cardinal"].map(x => 
                <MenuItem key={x} value={x} selected={interpolate == x}>{x}</MenuItem>)}
          </Select>
        </Grid>);
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs xs={4}>
          {markType == "line" ? <InputLabel shrink id="interpolate-selector-a-label" htmlFor="interpolate-selector"> type </InputLabel> : ""}
          <Select fullWidth labelId="label" id="marktype-selector" 
              value={markType} 
              onChange={(event) => this.handleMarkChange.bind(this)(layerID, "type", event.target.value)}>
            {["bar", "line", "rect", "point", "area", "circle", "tick", "boxplot"].map(item => 
                <MenuItem key={item} value={item} selected={markType == item}>{item}</MenuItem>)}
          </Select>
        </Grid>
        {lineInterpolateEditor}
      </Grid>);
  }

  onParseOk(expressions, layerID, layerSpec) {
    var data = [];
    //var newData = new SimpleResultProcessing(this.options).process(data,expressions);
    //your new data here, which is filtered out of the box by SimpleResultProcessing
    var exprStr = "";
    for (var i = 0; i < expressions.length; i ++) {
      const space = (i == 0) ? "" : " ";
      exprStr += space + recursiveTranslate(expressions[i]);
    }
    this.handleTempFilterChange.bind(this)(layerID, exprStr);

    function recursiveTranslate(expr) {
      function wrapStr(str) {
        if (str.startsWith("'") && str.endsWith("'")) {
          return ("\"" + str.substring(1, str.length - 1) + "\"")
        }
        if (str.startsWith("\"") && str.endsWith("\"")) {
          return ("\"" + str.substring(1, str.length - 1) + "\"")
        }
        return ("\"" + str + "\"")
      }
      const prefix = "conditionType" in expr ? (expr["conditionType"] == "AND" ? "&&" : "||") : "";
      var body = "";
      const encoding = layerSpec["encoding"][expr["category"]];
      if ("category" in expr) {
        const lhs = "datum['" + encoding["field"] + "']";
        const op = expr["operator"];
        const rhs = (encoding["type"] == "quantitative") ? parseFloat(expr["value"]) : wrapStr(expr["value"]);
        body = lhs + " " + op + " " + rhs;
        return prefix + " " + body;
      }
    }
  }

  displayFilter(filterStr, fieldNameToChannel) {
    let re = /datum\['([^\]]+)']/g
    function replacer(match, p1, offset, string) {
      // p1 is nondigits, p2 digits, and p3 non-alphanumerics
      return fieldNameToChannel[p1];
    }
    var outStr = filterStr.replace(re, replacer).replace("&&", "AND").replace("||", "OR");    
    return outStr
  }

  GUIEditor(layerID) {
    var layerSpec = this.state.spec;
    var layerData = this.state.spec["data"]["values"];
    if (layerID != -1) {
      layerSpec = this.state.spec["layer"][layerID];
      layerData = this.state.spec["data"]["values"].filter(r => (r["layer_id"] == layerID));
    }
    function encTypeToFilterType(ty) {
      if (ty == "nominal")
        return "selection";
      else
        return "text";
    }
    var fieldNameToChannel = {};
    const channels = Object.keys(layerSpec["encoding"]);
    for (var i = 0; i < channels.length; i++) {
      const ch = channels[i];
      const f = layerSpec["encoding"][ch]["field"];
      if (! (f in fieldNameToChannel)) {
        fieldNameToChannel[f] = ch;
      }
    }
    var filterBoxOptions = Object.keys(layerSpec["encoding"]).map(ch => {
      const encoding = layerSpec["encoding"][ch];
      return {
        "columnField": encoding["field"], 
        "columnText": ch, //(("title" in encoding) ? encoding["title"] : encoding["field"]),
        "type": encTypeToFilterType(encoding["type"])}})

    var customAutoCompleteHandler = new CustomAutoComplete(layerData, filterBoxOptions, layerSpec["encoding"]);
    
    const markType = (layerSpec["mark"].constructor == Object) ? layerSpec["mark"]["type"] : layerSpec["mark"];
    
    return (
      <React.Fragment>
        <Typography className="config-sec-title" variant="subtitle1" gutterBottom>
          Mark
        </Typography>
        {this.genMarkEditor(layerID, layerSpec)}

        <Divider className="invis-divider" />
        <Typography className="config-sec-title" variant="subtitle1" gutterBottom>
          Axes
        </Typography>
          <List className="expander-grid-list">
           {Object.keys(layerSpec["encoding"]).map(
               (key, index) => this.genEncodingEdit(layerID, key, layerSpec["encoding"][key]))}
            <Link href="#" style={{"fontSize": "12px"}} 
              onClick={( (event) => {this.setState({showUnusedChannel: !this.state.showUnusedChannel});}).bind(this)}>
              {this.state.showUnusedChannel ? "- hide unused axes" : "+ show unused axes"}
            </Link> 
            {this.state.showUnusedChannel ? 
              <div style={{display: "flex"}}>
                {allChannels[markType].filter(x => !Object.keys(layerSpec["encoding"]).includes(x)).map(
                               key => this.genUnusedEncodingEdit(layerID, key))}
              </div> : ""}
          </List>
        {/*<Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="outlined" color="primary" size="small"
                    onClick={((event) => {this.props.visSpecUpdateHandle(this.props.specIndex, this.state.spec);}).bind(this)}
                    style={{textTransform: "none"}}> {"Apply Changes"} </Button>
          </Grid>
        </Grid>*/}
        <Divider className="invis-divider" />
        {this.genWidthHeighSetter(layerSpec)}
        <Divider className="invis-divider" />
        <Typography className="config-sec-title" variant="subtitle1" gutterBottom>
          Filter
        </Typography>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12}>
            <CustomReactFilterBox 
              data = {layerData}
              query={this.displayFilter(this.state.tempFilters[layerID], fieldNameToChannel)}
              options={filterBoxOptions}
              onParseOk={(expr) => this.onParseOk.bind(this)(expr, layerID, layerSpec)}
              autoCompleteHandler = {customAutoCompleteHandler}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="outlined" color="primary" size="small"
                    onClick={(event) => this.saveTempFilters.bind(this)(layerID)}
                    style={{textTransform: "none"}}> {"Apply Filter"} </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="outlined" color="primary" size="small" style={{textTransform: "none"}}
                    onClick={(event) => this.clearFilters.bind(this)(layerID)}> {"Clear Filter"} </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  fullGUIEditor() {
    if ("layer" in this.state.spec) {
      return (
        <div className="multi-layer-editor-panel">
          <AppBar position="static">
           <Tabs value={this.state.GUIEditorLayerPanelID} 
                onChange={this.handleLayerPanelChange.bind(this)} 
                aria-label="gui-editor-layer-selection"
                indicatorColor="secondary"
                textColor="secondary"
                className ="editor-switch layer-editor-switch"
                centered>
              <Tab className="layer-switch-tab" label="Layer 1" id="layer-tab-1" aria-controls="layer-tab-panel-1"/>
              <Tab className="layer-switch-tab" label="Layer 2" id="layer-tab-2" aria-controls="layer-tab-panel-2"/>
            </Tabs>
          </AppBar>
          <TabPanel>
            {this.state.GUIEditorLayerPanelID == 0 ? this.GUIEditor(0) : this.GUIEditor(1)}
          </TabPanel>
          <Typography className="config-sec-title-2" variant="subtitle1" gutterBottom>
            Layering Options
          </Typography>
          <Grid container spacing={0}>
            {["y", "color"].map((key) => {
              return (
                <Grid key={key} item xs xs={12}>
                  <Typography  component="div">
                    <Grid component="div" alignContent="center" container spacing={0}>
                      <Grid item className="switch-label">Independent 
                       {" "}<span style={{fontStyle: "italic"}}>{key}</span> {key == "color" ? "scheme" : "axis scale"}</Grid>
                      <Grid item>
                        <Switch color="primary" size="small"
                        checked={("resolve" in this.state.spec && "scale" in this.state.spec["resolve"] 
                                    && this.state.spec["resolve"]["scale"][key] == "independent")} 
                        onChange={((event) => {
                          var newSpec = this.state.spec;
                          var value = event.target.checked ? "independent" : "shared";
                          if (!("resolve" in newSpec))
                            newSpec["resolve"] = {};
                          if (!("scale" in newSpec["resolve"]))
                            newSpec["resolve"]["scale"] = {}
                          newSpec["resolve"]["scale"][key] = value;
                          this.setState({ spec: newSpec })
                          this.props.visSpecUpdateHandle(this.props.specIndex, newSpec);
                        }).bind(this)} />
                      </Grid>
                    </Grid>
                  </Typography>
                </Grid>)
            })}
          </Grid>
        </div>)
    } else {
      return (<div>{this.GUIEditor(-1)}</div>);
    } 
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className={classNames("vis-editor")}>
          <AppBar position="static">
            <Tabs value={this.state.panelID} 
                  onChange={this.handlePanelChange.bind(this)} 
                  aria-label="editor-selection"
                  indicatorColor="primary"
                  textColor="primary"
                  className ="editor-switch"
                  variant="fullWidth"
                  centered>
              <Tab label="Gui Editor" id="tab-1" aria-controls="tabpanel-1" />
              <Tab label="Program Viewer" id="tab-2" aria-controls="tabpanel-2"/>
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.panelID} index={0}>
            {this.fullGUIEditor()}
          </TabPanel>
          <TabPanel value={this.state.panelID} index={1}>
            <div className="raw">
              <ReactJson src={{"r_script": this.state.tableProg,
                               "vl_spec": this.state.spec}} iconStyle="triangle"
                displayObjectSize={false} enableClipboard={false} //displayDataTypes={false}
                shouldCollapse={({ src, namespace, type }) => {
                  // collapse "data" field in the namespace
                  if (namespace.indexOf("values") == namespace.length - 1 
                     && namespace.indexOf("data") == namespace.length - 2) {
                      return true
                  }
                  return false
              }}/>
            </div>
          </TabPanel>
        </div>
      </ThemeProvider>)
  }
}

export default VisEditor;