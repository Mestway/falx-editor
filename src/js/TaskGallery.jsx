const TaskGallery = [
  {
    "name": "Budgeted vs Actual",
    "chart type": "Grouped Bar Chart",
    "data": [
      { "Bucket": "Bucket E", "Budgeted": 100, "Actual": 115 },
      { "Bucket": "Bucket D", "Budgeted": 100, "Actual": 90 },
      { "Bucket": "Bucket C", "Budgeted": 125, "Actual": 115 },
      { "Bucket": "Bucket B", "Budgeted": 125, "Actual": 140 },
      { "Bucket": "Bucket A", "Budgeted": 140, "Actual": 150 }
    ],
    "tags": [
      {"type": "bar", "props": { "x": "Actual", "y": 115,  "color": "Actual", "column": "Bucket E"}},
      {"type": "bar", "props": { "x": "Actual", "y": 90,"color": "Actual", "column": "Bucket D"}},
      {"type": "bar", "props": { "x": "Budgeted","y": 100,  "color": "Budgeted", "column": "Bucket D"}},
    ]
  }, {
    "name": "Profits",
    "chart type": "Line Chart + Bar Chart",
    "data": [
      { "Quarter": "Quarter1", "Number of Units": 23, "Actual Profits": 3358 },
      { "Quarter": "Quarter2", "Number of Units": 27, "Actual Profits": 3829 },
      { "Quarter": "Quarter3", "Number of Units": 15, "Actual Profits": 2374 },
      { "Quarter": "Quarter4", "Number of Units": 43, "Actual Profits": 3373 }
    ],
    "tags": [
      {"type": "bar", "props": { "x": "Quarter1", "y": 23 }},
      {"type": "bar", "props": { "x": "Quarter2", "y": 27 }},
      {"type": "line", "props": {"x1": "Quarter1", "y1": 3358, "x2": "Quarter2", "y2": 3829 }},
    ]
  }, {
    "name": "Profits Area Chart",
    "data": [
      { "Quarter": "Quarter1", "Number of Units": 23, "Actual Profits": 3358 },
      { "Quarter": "Quarter2", "Number of Units": 27, "Actual Profits": 3829 },
      { "Quarter": "Quarter3", "Number of Units": 15, "Actual Profits": 2374 },
      { "Quarter": "Quarter4", "Number of Units": 43, "Actual Profits": 3373 }
    ],
    "tags": [
      {"type": "area", "props": {"x_left": "Quarter1", "y_top_left": 3358, "x_right": "Quarter2", 
                                 "y_top_right": 3829}},
    ]
  }, {
    "name": "Confidence Interval",
    "data": [
      {"Value":"means","Y1":0.52,"Y2":0.57,"Y3":0.6,"Y4":0.63,"Y5":0.63},
      {"Value":"stddev","Y1":0.1328,"Y2":0.1321,"Y3":0.1303,"Y4":0.1266,"Y5":0.1225},
      {"Value":"upper range","Y1":0.66,"Y2":0.7,"Y3":0.73,"Y4":0.75,"Y5":0.75},
      {"Value":"lower range","Y1":0.39,"Y2":0.44,"Y3":0.47,"Y4":0.5,"Y5":0.51}
    ],
    "tags": [
      {"type": "area", "props": {"x_left": "Y1", "y_top_left": 0.66, "y_bot_left": 0.39,  
                                 "x_right": "Y2", "y_top_right": 0.7, "y_bot_right": 0.44 }},
      {"type": "line", "props": {"x1": "Y1", "y1": 0.52, "x2": "Y2", "y2": 0.57 }},
      {"type": "line", "props": {"x1": "Y2", "y1": 0.57, "x2": "Y3", "y2": 0.6 }}
    ]
  }, {
    "name": "Heatmap",
    "data": [{"product":"Product1_2011","Q4":3,"Q3":5,"Q2":5,"Q1":10},
             {"product":"Product2_2011","Q4":5,"Q3":7,"Q2":5,"Q1":2},
             {"product":"Product3_2011","Q4":3,"Q3":9,"Q2":10,"Q1":7},
             {"product":"Product4_2011","Q4":3,"Q3":2,"Q2":8,"Q1":1},
             {"product":"Product5_2011","Q4":1,"Q3":7,"Q2":1,"Q1":6},
             {"product":"Product6_2011","Q4":9,"Q3":1,"Q2":6,"Q1":1},
             {"product":"Product1_2012","Q4":3,"Q3":3,"Q2":6,"Q1":4},
             {"product":"Product2_2012","Q4":4,"Q3":3,"Q2":6,"Q1":4},
             {"product":"Product3_2012","Q4":3,"Q3":6,"Q2":6,"Q1":4},
             {"product":"Product4_2012","Q4":4,"Q3":10,"Q2":6,"Q1":1},
             {"product":"Product5_2012","Q4":8,"Q3":5,"Q2":4,"Q1":7},
             {"product":"Product6_2012","Q4":8,"Q3":8,"Q2":8,"Q1":6},
             {"product":"Product1_2013","Q4":10,"Q3":2,"Q2":3,"Q1":9},
             {"product":"Product2_2013","Q4":8,"Q3":6,"Q2":7,"Q1":7},
             {"product":"Product3_2013","Q4":9,"Q3":8,"Q2":4,"Q1":9},
             {"product":"Product4_2013","Q4":5,"Q3":9,"Q2":5,"Q1":2},
             {"product":"Product5_2013","Q4":1,"Q3":5,"Q2":2,"Q1":4},
             {"product":"Product6_2013","Q4":8,"Q3":10,"Q2":6,"Q1":4}],
    "tags": [
      {"type": "rect", "props": { "x": "Q2", "y": "Product4",  "color": 8, "column": "2011"}},
      {"type": "rect", "props": { "x": "Q2", "y": "Product5",  "color": 1, "column": "2011"}},
      {"type": "rect", "props": { "x": "Q1", "y": "Product3",  "color": 7, "column": "2011"}}
    ]
  }
]

export default TaskGallery;


