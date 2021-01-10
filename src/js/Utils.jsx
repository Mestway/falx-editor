import React, { Component } from "react";
import ReactDOM from "react-dom";

import { VegaLite, createClassFromSpec } from 'react-vega';
import * as vegaImport from 'vega';
import * as vegaLiteImport from 'vega-lite';

const vega = vegaImport;
const vegaLite = vegaLiteImport

// resize a vegalite spec to fit certain height
export const resizeVegaLiteSpec = (spec) => {
  var minWidth = 0;
  var maxWidth = 90 * 6;
  if (spec["width"] != 200) {
    minWidth = (spec["width"] / 20) * 8;
  }
  // in case we don't have enough room to show ticks and labels
  var disableXLabels = false;
  if (spec["width"] / 20 > (maxWidth / 8)) {
    disableXLabels = true;
    if (!("layer" in spec)) { } else { } // ignore multi-layered charts for now 
  }

  if (spec["height"] > 90) {
    spec["width"] = Math.min(Math.max(spec["width"] * (90.0 / spec["height"]), minWidth), maxWidth);
    // set spec size height to 90 (to fix the carousel)
    spec["height"] = 90;
  }
  
  if (!("layer" in spec)) {
    for (const key in spec["encoding"]) {
      spec["encoding"][key]["axis"] = {"labelLimit": 30, "title": null}
    }
    if (disableXLabels) {
      spec["encoding"]["x"]["axis"]["labels"] = false;
      spec["encoding"]["x"]["axis"]["ticks"] = false;
    }
  } else {
    for (var i = 0; i < spec["layer"].length; i ++) {
      for (const key in spec["layer"][i]["encoding"]) {
        spec["layer"][i]["encoding"][key]["axis"] = {"labelLimit": 30, "title": null}
      }
      if (disableXLabels) {
        spec["layer"][i]["encoding"]["x"]["axis"]["labels"] = false;
        spec["layer"][i]["encoding"]["x"]["axis"]["ticks"] = false;
      }
    }
  }
  return spec;
}

// download a vega-lite spec
export const downloadVis = (spec, ext) => {
  // spec: vega lite spec
  // ext: extension (svg / png)

  const element = document.createElement("a");
  const file = new Blob([spec], {type: 'text/plain'});

  var vgSpec = vegaLite.compile(JSON.parse(spec)).spec;
  var view = new vega.View(vega.parse(vgSpec), {renderer: 'none'});

  // generate a PNG snapshot and then download the image
  view.toImageURL(ext).then(function(url) {
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', 'vega-export.' + ext);
    link.dispatchEvent(new MouseEvent('click'));
  });//.catch(function(error) { /* error handling */ });

  // element.href = URL.createObjectURL(file);
  // element.download = "vis-save.json";
  // document.body.appendChild(element); // Required for this to work in FireFox
  // element.click();
}

// open the given string into vega editor
export const openInVegaEditor = (specStr) => {
  const editorURL = "https://vega.github.io/editor/";
  const editor = window.open(editorURL);

  const data = {
    config: {},
    mode: "vega-lite",
    renderer: "canvas",
    spec: specStr
  };
  const wait = 10000;
  const step = 250;
  // eslint-disable-next-line no-bitwise
  let count = ~~(wait / step);

  function listen(evt) {
    if (evt.source === editor) {
      count = 0;
      window.removeEventListener('message', listen, false);
    }
  }
  window.addEventListener('message', listen, false);

  // send message
  // periodically resend until ack received or timeout
  function send() {
    if (count <= 0) {
      return;
    }
    console.log(data);
    editor.postMessage(data, '*');
    setTimeout(send, step);
    count -= 1;
  }
  setTimeout(send, step);    
}

export const generateExampleVisualization = (inputTags) => {
  // visualize example tags created by the users in a VegaLite chart

  // remove tags that contain null values
  const validTags = inputTags.filter((element) => {
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

  if (markTypes.length == 0 || allNull) {
    return null;
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
  //console.log(JSON.stringify(spec)); 

  return spec;
}