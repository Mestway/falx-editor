import React, { Component } from "react";
import classNames from 'classnames';

import SplitPane from 'react-split-pane';
import { VegaLite, createClassFromSpec } from 'react-vega';
import AnimateOnChange from 'react-animate-on-change';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

//import expandButton from '../images/expand.svg';
import Octicon from 'react-octicon'
import ReactTooltip from 'react-tooltip'

import SaveAltIcon from '@material-ui/icons/SaveAlt';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button';

import Draggable from 'react-draggable';
import { Resizable, ResizableBox } from 'react-resizable';

import Card from '@material-ui/core/Card';
import { CardHeader } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import "regenerator-runtime/runtime.js";

import VisEditor from "./VisEditor.jsx"
import { EncodeEntryName, Loader, LoaderOptions, Renderers, Spec as VgSpec, TooltipHandler, View } from 'vega';

import ReactTable from "./TableViewer.jsx"
import { resizeVegaLiteSpec, openInVegaEditor, downloadVis } from "./Utils.jsx"

import '../scss/Recommendations.scss';

import * as vegaImport from 'vega';
import * as vegaLiteImport from 'vega-lite';

const vega = vegaImport;
const vegaLite = vegaLiteImport

const COLLAPSED_INFO_PANE_SIZE = 24;
const DEFAULT_INFO_PANE_SIZE = 402;

class Recommendations extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.specs !== state.specs) {
      const focusIndexHistory = state.focusIndexHistory;
      focusIndexHistory.push(-1);

      invisibleCharts = state.invisibleCharts;
      if (props.specs.length != state.specs.length) {
        var invisibleCharts = [];
        for (var i = 0; i < props.specs.length; i ++) {
          invisibleCharts.push(false);
        }
      }
      
      return {
        specs: props.specs,
        tableProgs: props.tableProgs,
        focusIndexHistory: focusIndexHistory,
        invisibleCharts: invisibleCharts
      };
    }
    return null;
  }
  constructor(props) {
    super(props);
    this.setFocusIndex = this.setFocusIndex.bind(this);
    this.previousInfoPaneSize = -1;

    var invisibleCharts = [];
    for (var i = 0; i < props.specs.length; i ++) {
      invisibleCharts.push(false);
    }

    this.state = {
      specs: props.specs,
      tableProgs: props.tableProgs,
      invisibleCharts: invisibleCharts,
      updateFocus: false,
      focusIndex: 0,
      focusIndexHistory: [0],
      dataVisible: false,
      showInfoPane: window.innerWidth > 1400 ? true : false, // hide the panel by defaul
      hoverOnContextChart: -1,
    };
  }
  updateSpec(index, newSpec) {
    var newSpecs = this.state.specs;
    newSpecs[index] = newSpec;
    this.setState({
      specs: newSpecs
    })
    // also tell the parents that the synthesis result needs update
    this.props.updateSpecHandle(index, newSpec);
  }
  setFocusIndex(focusIndex) {
    // update the focus index history to keep trace of it
    const focusIndexHistory = this.state.focusIndexHistory;
    focusIndexHistory.push(focusIndex);

    this.setState({
      focusIndex: focusIndex,
      updateFocus: true,
      focusIndexHistory: focusIndexHistory
    });
  }
  downloadInteractionTrace(spec, tableProg) {
    const trace = {
      "demo_history": this.props.demoHistory,
      "input_data": this.props.inputData,
      "output_visualization": spec,
      "focused_indexes": this.state.focusIndexHistory,
      "rscript": tableProg
    }

    const file = new Blob([JSON.stringify(trace, null, 4)], {type: 'text/plain'});

    var link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(file));
    link.setAttribute('target', '_blank');
    link.setAttribute('download', "falx_log.json");
    link.dispatchEvent(new MouseEvent('click'));
  }

  hideContextChart(idx) {
    let invisibleCharts = this.state.invisibleCharts;
    invisibleCharts[idx] = true;
    this.setState({invisibleCharts: invisibleCharts});
  }

  resumeHiddenContextChart() {
    let invisibleCharts = this.state.invisibleCharts;
    for (var i = 0; i < invisibleCharts.length; i ++) {
       invisibleCharts[i] = false;
    }
    this.setState({invisibleCharts: invisibleCharts});
  }

  renderTransformedData(switchFunc) {
    // render viewer for transformed data
    const visibleStatus = this.state.dataVisible ? "visible" : "";
    const transformedData = this.state.specs[this.state.focusIndex]["data"]["values"];
    const columns = []
    if (transformedData.length > 0) {
      var columnNames = [];
      // for multi-layered data, column names may come from different layers
      for (var i = 0; i < transformedData.length; i ++) {
        const keys = Object.keys(transformedData[i]);
        for (var j = 0; j < keys.length; j ++) {
          if (columnNames.includes(keys[j])) {
            continue
          } else {
            columnNames.push(keys[j])
          }
        }
      }
      for (const i in columnNames) {
        columns.push({
          Header: columnNames[i],
          accessor: columnNames[i]
        })
      }
    }

    var tablePreview = "";
    if (transformedData.length > 0) { 
      tablePreview = (
        <ReactTable
          data={transformedData} columns={columns}
          defaultPageSize={transformedData.length == 0 ? 5 : Math.min(transformedData.length + 1, 20)}
          paginationOption={true} enableClickCopy={false} useDraggableCell={false}
          className="-striped -highlight"
        />);
    }

    return (
      <Draggable cancel=".not-draggable">
        <Card className={"transformed-data-viewer" + " " + visibleStatus}>
          <CardContent>
            <div style={{textAlign: "left", cursor: "move"}}>
              <IconButton color="primary" fontSize="small" aria-label="settings" onClick={switchFunc}>
                <ExpandLessIcon />
              </IconButton>
              <span style={{fontWeight: "bold", "padding": "0px 12px"}}>Transformed Data</span>
            </div>
            {tablePreview}
          </CardContent>
        </Card>
      </Draggable>);
  }

  render() {

    const contextCharts = this.state.specs.map((spec, index) => {
      const classes = classNames({
        'context-chart': true,
        'selected': index === this.state.focusIndex
      })

      if (this.state.invisibleCharts[index]) {
        return "";
      }

      const specCopy = resizeVegaLiteSpec(JSON.parse(JSON.stringify(spec)));

      const hideBtn = (
        <Tooltip title={"Hide this visualization"}>
            <Fab className={(this.state.hoverOnContextChart == index) ? "action-visible" : "action-invisible"} 
                 style={{position: 'absolute', transform: "translate(0px, 120px)"}} 
                 onClick={(() => {this.hideContextChart(index)}).bind(this)}
                 size="small" color="secondary" aria-label="open">
              <VisibilityOffIcon />
            </Fab>
          </Tooltip>);

      const card = (
        <div key={index} className={classes} 
            className={classes}
            onMouseEnter={() => {this.setState({hoverOnContextChart: index})}}
            onMouseLeave={() => {this.setState({hoverOnContextChart: -1})}}
            onClick={() => {this.setFocusIndex(index);}}>
          <VegaLite spec={specCopy} renderer={"svg"} actions={false} />
          <div className="backdrop"></div>
          {hideBtn}
        </div>
      );

      return card;
    });

    const expandButton =  this.state.showInfoPane ? 
                  (<Octicon className="expand-icon" name="triangle-right"/>) 
                  : (<Octicon className="expand-icon" name="triangle-left"/>);

    // copy to force an update in vega lite
    const focusedSpec = JSON.parse(JSON.stringify(this.state.specs[this.state.focusIndex]));
    const focusedRScript = this.state.tableProgs[this.state.focusIndex];

    const maxWidth = 1600;
    if (focusedSpec["width"] > maxWidth) {
      // in case we don't have enough room to show ticks and labels
      if (focusedSpec["width"] / 20 > (maxWidth / 8)) {
        if (!("layer" in focusedSpec)) {
          focusedSpec["encoding"]["x"]["axis"] = {"labels": false, "ticks": false};
        } else {
          // ignore multi-layered charts for now
        }
      }
      focusedSpec["width"] = maxWidth;
    }
    const vlScript = (<VegaLite spec={focusedSpec} renderer="canvas" actions={false}/>);

    let invisibleCount = this.state.invisibleCharts.filter(Boolean).length;
    const countMessage = `${this.state.specs.length} synthesized`;
    const hiddenMessage = invisibleCount  > 0 ? 
          (<span>{`, ${invisibleCount} hidden `} 
              <a href="javascript:void(0);" onClick={this.resumeHiddenContextChart.bind(this)}>(click to resume)</a>
          </span>) : "";

    return (
      <div className="Recommendations">
        <div className="visualizations">
          <SplitPane split="vertical" 
          primary="second"
          size={
                this.state.showInfoPane ?
                  this.previousInfoPaneSize === -1 ? DEFAULT_INFO_PANE_SIZE : this.previousInfoPaneSize
                :
                  COLLAPSED_INFO_PANE_SIZE
              }
              allowResize={this.state.showInfoPane}
              onDragFinished={(size) => { this.previousInfoPaneSize = size }}
              minSize={24} maxSize={-400}>
            <div className={classNames({'vis-focus': true})}>
              <div className="save-btn-area">
                {"Actions:  "}
                {/*<Button size="small"  aria-label="save" 
                  color="primary" style={{minWidth: "0px"}}
                  onClick={() => this.downloadInteractionTrace(focusedSpec, focusedRScript)}>
                  Download
                </Button>
                {" | "}*/}
                <Button size="small"  aria-label="save" 
                  color="primary" style={{minWidth: "0px"}}
                  onClick={(() => { this.setState({dataVisible: !this.state.dataVisible}); }).bind(this)}>
                  {this.state.dataVisible ? "Hide" : "View"} transformed data
                </Button>
                {" | "}
                <Button size="small"  aria-label="save" 
                  color="primary" style={{minWidth: "0px"}}
                  onClick={() => this.props.bookmarkHandler(this.state.specs[this.state.focusIndex])}>
                  <BookmarkIcon style={{fontSize: "medium"}}/>{" "} Bookmark
                </Button>
                {" | "}
                <Button size="small"  aria-label="save" 
                  color="primary" style={{minWidth: "0px"}}
                  onClick={() => downloadVis(JSON.stringify(focusedSpec, null, '\t'), "png")}>
                  Download (.png)
                </Button>
                {/*{" | "}
                <Button size="small" color="primary" style={{minWidth: "0px"}}
                  aria-label="save" onClick={() => downloadVis(JSON.stringify(focusedSpec, null, '\t'), "svg")}>
                  Download (.svg)
                </Button>*/}
                {" | "}
                <Button aria-label="vega-editor" size="small" color="primary" style={{minWidth: "0px"}}
                  onClick={() => openInVegaEditor(JSON.stringify(focusedSpec, null, '\t'))}>
                  Open in Vega Editor
                </Button>
              </div>
              {this.renderTransformedData((() => { this.setState({dataVisible: !this.state.dataVisible}); }).bind(this))}
              <div className="main-vis-panel">
                <AnimateOnChange
                      baseClassName="chart"
                      animationClassName="update"
                      animate={this.state.updateFocus}
                      onAnimationEnd={function() {this.setState({"updateFocus": false});}.bind(this)} >
                  {vlScript}
                </AnimateOnChange>
              </div>
            </div>
            <div className="info">
                <Tooltip placement="left" 
                  title={this.state.showInfoPane ? "Collapse the editor" : "Open the editor"}>
                  <button className="expand-button" 
                          onClick={() => { this.setState({ showInfoPane: !this.state.showInfoPane }); }}>
                    {expandButton}
                  </button>
                </Tooltip>
                <VisEditor tableProg={this.state.tableProgs[this.state.focusIndex]} 
                           spec={this.state.specs[this.state.focusIndex]}
                           specIndex={this.state.focusIndex}
                           visSpecUpdateHandle={this.updateSpec.bind(this)} />
              </div>
          </SplitPane>
        </div>
        <div className={classNames({'context': true})}>
          <div className="title" style={{width: "100%"}}>
            Synthesized Visualizations: {countMessage} {hiddenMessage}</div>
          <div className="carousel">
            {contextCharts}
          </div>
        </div>
      </div>
      )
  }
}

export default Recommendations;