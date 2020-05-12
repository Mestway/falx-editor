const ChartTemplates = {
    "Empty Canvas": {
        "tags": []
    },
    "Simple Bar Chart": {
        "tags": [
            {"type": "bar", "props": { "x": null, "y": null, "color": "", "column": ""}},
            {"type": "bar", "props": { "x": null, "y": null, "color": "", "column": ""}}
        ]
    },
    "Stacked Bar Chart": {
        "tags": [
            {"type": "bar", "props": { "x": null, "y": null, "color": null, "column": ""}},
            {"type": "bar", "props": { "x": null, "y": null, "color": null, "column": ""}},
            {"type": "bar", "props": { "x": null, "y": null, "color": null, "column": ""}},
        ]
    },
    "Waterfall Chart": {
        "tags": [
            {"type": "bar", "props": { "x": null, "y": null, "y2": null, "color": null, "column": ""}},
            {"type": "bar", "props": { "x": null, "y": null, "y2": null, "color": null, "column": ""}},
        ]
    },
    "Scatter Plot": {
        "tags": [
            {"type": "point", "props": { "x": null, "y": null, "color": null, "column": ""}},
            {"type": "point", "props": { "x": null, "y": null, "color": null, "column": ""}},
        ]
    },
    "Line Chart": {
        "tags": [
            {"type": "line", "props": {"x1": null, "y1": null, "x2": null, "y2": null, "color": null, "column": ""}},
            {"type": "line", "props": {"x1": null, "y1": null, "x2": null, "y2": null, "color": null, "column": ""}},
        ]
    },
    "Heatmap": {
        "tags": [
            {"type": "rect", "props": { "x": null, "y": null, "color": null, "column": ""}},
            {"type": "rect", "props": { "x": null, "y": null, "color": null, "column": ""}},
            {"type": "rect", "props": { "x": null, "y": null, "color": null, "column": ""}},
        ]
    },
    // "Culminative Sum": {
    //     "tags": [
    //         {"type": "bar", "props": { "x": "A", "y": 1,  "color": "", "x2": "", "y2": "", "column": ""}},
    //         {"type": "bar", "props": { "x": "B", "y": 2,"color": "", "x2": "", "y2": "", "column": ""}},
    //         {"type": "bar", "props": { "x": "C","y": 3,  "color": "", "x2": "", "y2": "", "column": ""}},
    //         {"type": "bar", "props": { "x": "D", "y": 4,"color": "", "x2": "", "y2": "", "column": ""}},
    //         {"type": "line", "props": {"x1": "A", "y1": 1, "x2": "B", "y2": 3, "color": "", "column": ""}},
    //         {"type": "line", "props": {"x1": "B", "y1": 3, "x2": "C", "y2": 6, "color": "", "column": ""}},
    //         {"type": "line", "props": {"x1": "C", "y1": 6, "x2": "D", "y2": 10, "color": "", "column": ""}}
    //     ]
    // },
}

export default ChartTemplates;