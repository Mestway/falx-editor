const ChartTemplates = {
    "Empty Canvas": {
        "tags": []
    },
    "Simple Bar Chart": {
        "tags": [
            {"type": "bar", "props": { "x": "A", "y": 28,  "color": "", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "B", "y": 55,"color": "", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "C","y": 43,  "color": "", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "D", "y": 91,"color": "", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "E","y": 81,  "color": "", "x2": "", "y2": "", "column": ""}}
        ]
    },
    "Stacked Bar Chart": {
        "tags": [
            {"type": "bar", "props": { "x": "A", "y": 28,  "color": "label 1", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "B", "y": 55,"color": "label 1", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "A","y": 43,  "color": "label 2", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "B", "y": 91,"color": "label 2", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "C","y": 81,  "color": "label 1", "x2": "", "y2": "", "column": ""}}
        ]
    },
    "Faceted Chart": {
        "tags": [
            {"type": "bar", "props": { "x": "A", "y": 28,  "color": "", "x2": "", "y2": "", "column": "label 1"}},
            {"type": "bar", "props": { "x": "B", "y": 55,"color": "", "x2": "", "y2": "", "column": "label 1"}},
            {"type": "bar", "props": { "x": "A","y": 43,  "color": "", "x2": "", "y2": "", "column": "label 2"}},
            {"type": "bar", "props": { "x": "B", "y": 91,"color": "", "x2": "", "y2": "", "column": "label 2"}}
        ]
    },
    "Waterfall Chart": {
        "tags": [
            {"type": "bar", "props": { "x": "A", "y": 0,  "color": "+", "x2": "", "y2": 100, "column": ""}},
            {"type": "bar", "props": { "x": "B", "y": 100,"color": "-", "x2": "", "y2": 120, "column": ""}},
            {"type": "bar", "props": { "x": "C", "y": 120,  "color": "+", "x2": "", "y2": 60, "column": ""}},
            {"type": "bar", "props": { "x": "D", "y": 60,  "color": "-", "x2": "", "y2": 70, "column": ""}},
            {"type": "bar", "props": { "x": "E", "y": 70,  "color": "-", "x2": "", "y2": 0, "column": ""}},
        ]
    },
    "Scatter Plot": {
        "tags": [
            {"type": "point", "props": { "x": "A", "y": 10, "color": "L1", "x2": "", "y2": "", "column": ""}},
            {"type": "point", "props": { "x": "B", "y": 5, "color": "L2", "x2": "", "y2": "", "column": ""}},
            {"type": "point", "props": { "x": "C", "y": 7, "color": "L1", "x2": "", "y2": "", "column": ""}},
            {"type": "point", "props": { "x": "D", "y": 12, "color": "L1", "x2": "", "y2": "", "column": ""}},
        ]
    },
    "Line Chart": {
        "tags": [
            {"type": "line", "props": {"x1": "A", "y1": 0, "x2": "B", "y2": 1, "color": "L1", "column": ""}},
            {"type": "line", "props": {"x1": "B", "y1": 1, "x2": "C", "y2": 5, "color": "L1", "column": ""}},
            {"type": "line", "props": {"x1": "A", "y1": 3, "x2": "B", "y2": 2, "color": "L2", "column": ""}},
            {"type": "line", "props": {"x1": "B", "y1": 2, "x2": "C", "y2": 4, "color": "L2", "column": ""}},
        ]
    },
    "Heatmap": {
        "tags": [
            {"type": "rect", "props": { "x": "Mon", "y": "Week 1", "color": 10, "x2": "", "y2": "", "column": ""}},
            {"type": "rect", "props": { "x": "Mon", "y": "Week 2", "color": 15, "x2": "", "y2": "", "column": ""}},
            {"type": "rect", "props": { "x": "Tue", "y": "Week 1", "color": 20, "x2": "", "y2": "", "column": ""}},
            {"type": "rect", "props": { "x": "Tue", "y": "Week 3", "color": 6, "x2": "", "y2": "", "column": ""}},
            {"type": "rect", "props": { "x": "Wed", "y": "Week 2", "color": 5, "x2": "", "y2": "", "column": ""}},
            {"type": "rect", "props": { "x": "Wed", "y": "Week 3", "color": 1, "x2": "", "y2": "", "column": ""}},
        ]
    },
    "Culminative Sum": {
        "tags": [
            {"type": "bar", "props": { "x": "A", "y": 1,  "color": "", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "B", "y": 2,"color": "", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "C","y": 3,  "color": "", "x2": "", "y2": "", "column": ""}},
            {"type": "bar", "props": { "x": "D", "y": 4,"color": "", "x2": "", "y2": "", "column": ""}},
            {"type": "line", "props": {"x1": "A", "y1": 1, "x2": "B", "y2": 3, "color": "", "column": ""}},
            {"type": "line", "props": {"x1": "B", "y1": 3, "x2": "C", "y2": 6, "color": "", "column": ""}},
            {"type": "line", "props": {"x1": "C", "y1": 6, "x2": "D", "y2": 10, "color": "", "column": ""}}
        ]
    },
}

export default ChartTemplates;