

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