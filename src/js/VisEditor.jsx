import React, { Component, useState, useEffect } from "react";
import classNames from 'classnames';

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { orange, pink, green } from "@material-ui/core/colors";

import ReactJson from 'react-json-view'
import Form from "react-jsonschema-form";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';

import BuildIcon from '@material-ui/icons/Build';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import 'bootstrap/dist/css/bootstrap.min.css';

import ReactFilterBox, {AutoCompleteOption, SimpleResultProcessing, GridDataAutoCompleteHandler} from "react-filter-box";
import "react-filter-box/lib/react-filter-box.css"

import '../scss/VisEditor.scss';

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
      contrastText: "white" //button text white instead of black
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

class VisEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableProg: props.tableProg,
      spec: props.spec,
      tempFilters: calcTempFilter(props.spec),
      panelID: 0,
      GUIEditorLayerPanelID: 0,
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
    this.setState({
        panelID: panelID
    });
  };

  handleLayerPanelChange(event, layerID) {
    this.setState({
      GUIEditorLayerPanelID: layerID
    })
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

  handleMarkChange(layerID, value) {
    // change the layer's (defined by layerID) property (specified by key) into value (value)'
    var newSpec = this.state.spec;

    if (layerID != -1) {
        if (newSpec["layer"][layerID]["mark"].constructor == Object) {
          newSpec["layer"][layerID]["mark"]["type"] = value;
        } else {
          newSpec["layer"][layerID]["mark"] = value;
        }
    } else {
      if (newSpec["mark"].constructor == Object) {
        newSpec["mark"]["type"] = value;
      } else {
        newSpec["mark"] = value;
      }
    }
    this.setState({
      spec: newSpec
    })
    this.props.visSpecUpdateHandle(this.props.specIndex, newSpec);
  }
  handleEncPropChange(layerID, channel, prop, value) {
    // change the layer's (defined by layerID) channel's property (specified by key) into value (value)'
    var newSpec = this.state.spec;
    if (layerID != -1)
      newSpec["layer"][layerID]["encoding"][channel][prop] = value;
    else
      newSpec["encoding"][channel][prop] = value;
    this.setState({
      spec: newSpec
    })
    this.props.visSpecUpdateHandle(this.props.specIndex, newSpec);
  }
  genEncodingEdit(layerID, channel, encoding) {
    const sortValue = ("sort" in encoding && encoding["sort"] != null) ? encoding["sort"] : "default";
    return (
      <Grid key={layerID + channel} container alignItems="center" spacing={3}>
        <Grid item xs={12} sm={3}>
          <TextField label="axis" value={channel} fullWidth disabled />
        </Grid>
        <Grid className="label-grid" item xs={12} sm={4}>
          <TextField id="title" name="title" 
              onChange={(event) => this.handleEncPropChange.bind(this)(layerID, channel, "title", event.target.value)} 
             label={"title"} value={("title" in encoding) ? encoding["title"] : encoding["field"]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={5}>
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
        {/*<Grid item xs={12} sm={3}>
          <InputLabel shrink htmlFor="sort-selector">
            sort
          </InputLabel>
          <Select fullWidth value={sortValue} 
              onChange={(event) => this.handleEncPropChange.bind(this)(layerID, channel, "sort", event.target.value)} 
              inputProps={{name: 'sort', id: 'sort-selector'}}>
            {[["default", "default", ""], ["ascending", <ArrowUpwardIcon />, "(asc)"], 
              ["descending", <ArrowDownwardIcon />, "(desc)"]].map(
                x => <MenuItem key={x[0]} value={x[0]} selected={x[0] == sortValue}>{x[1]}{x[2]}</MenuItem>)}
          </Select>
        </Grid>*/}
      </Grid>)
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
        if (str.startsWith("'") && str.endsWith("'")){
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
        <Grid container spacing={3}>
          <Grid item xs xs={3}>
            <Select fullWidth labelId="label" id="select" 
                value={markType} 
                onChange={(event) => this.handleMarkChange.bind(this)(layerID, event.target.value)}>
              {["bar", "line", "rect", "point", "area"].map(item => 
                  <MenuItem key={item} value={item} selected={markType == item}>{item}</MenuItem>)}
            </Select>
          </Grid>
          {
            (markType == "bar" && "color" in layerSpec["encoding"]) ? (
              <Grid item xs xs={9} style={{ margin: "auto" }}>
                <Typography component="div">
                  <Grid component="div" alignContent="center" container spacing={0}>
                    <Grid item className="switch-label">Layered Bar</Grid>
                    <Grid item>
                      <Switch color="primary" size="small"
                      checked={!("stack" in layerSpec["encoding"]["y"]) || layerSpec["encoding"]["y"]["stack"] != null} 
                      onChange={(event) => {
                          this.handleEncPropChange.bind(this)(layerID, "y", "stack", event.target.checked ? true : null);
                       }} name="checkedC" />
                    </Grid>
                    <Grid item className="switch-label">Stacked Bar</Grid>
                  </Grid>
                </Typography>  
              </Grid>
            ) : ("")
          }
        </Grid>

        <Divider className="invis-divider" />
        <Typography className="config-sec-title" variant="subtitle1" gutterBottom>
          Properties
        </Typography>
        {Object.keys(layerSpec["encoding"]).map(
           (key, index) => this.genEncodingEdit(layerID, key, layerSpec["encoding"][key]))}
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
                    style={{textTransform: "none"}}> {"Save Filter"} </Button>
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
              <Tab label="Layer 1" id="layer-tab-1" aria-controls="layer-tab-panel-1" />
              <Tab label="Layer 2" id="layer-tab-2" aria-controls="layer-tab-panel-2"/>
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.GUIEditorLayerPanelID} index={0}>
            {this.GUIEditor(0)}
          </TabPanel>
          <TabPanel value={this.state.GUIEditorLayerPanelID} index={1}>
            {this.GUIEditor(1)}
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
