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