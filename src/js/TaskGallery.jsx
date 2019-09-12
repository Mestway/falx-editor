const TaskGallery = [
  {
    "name": "Budget Visualization",
    "data": [
      { "Bucket": "Bucket E", "Budgeted": 100, "Actual": 115 },
      { "Bucket": "Bucket D", "Budgeted": 100, "Actual": 90 },
      { "Bucket": "Bucket C", "Budgeted": 125, "Actual": 115 },
      { "Bucket": "Bucket B", "Budgeted": 125, "Actual": 140 },
      { "Bucket": "Bucket A", "Budgeted": 140, "Actual": 150 }
    ],
    "tags": [
      {"type": "bar", "props": { "x": "Actual", "y": 115,  "color": "Actual", "x2": "", "y2": "", "column": "Bucket E"}},
      {"type": "bar", "props": { "x": "Actual", "y": 90,"color": "Actual", "x2": "", "y2": "", "column": "Bucket D"}},
      {"type": "bar", "props": { "x": "Budgeted","y": 100,  "color": "Budgeted", "x2": "", "y2": "", "column": "Bucket D"}},
    ]
  }, {
    "name": "Profits",
    "data": [
      { "Quarter": "Quarter1", "Number of Units": 23, "Actual Profits": 3358 },
      { "Quarter": "Quarter2", "Number of Units": 27, "Actual Profits": 3829 },
      { "Quarter": "Quarter3", "Number of Units": 15, "Actual Profits": 2374 },
      { "Quarter": "Quarter4", "Number of Units": 43, "Actual Profits": 3373 }
    ],
    "tags": [
      {"type": "bar", "props": { "x": "Quarter1", "y": 23,  "color": "", "x2": "", "y2": "", "column": ""}},
      {"type": "bar", "props": { "x": "Quarter2", "y": 27,"color": "", "x2": "", "y2": "", "column": ""}},
      {"type": "line", "props": {"x1": "Quarter1", "y1": 3358, "x2": "Quarter2", "y2": 3829, "color": "", "column": ""}},
    ]
  }
]

export default TaskGallery;