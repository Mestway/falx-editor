const TaskGallery = [
  {
    "name": "Budgeted vs Actual",
    "chart type": "Grouped Bar Chart",
    "preview": "budget.png",
    "task": "For each Bucket, create a bar chart to compare the budget and actual spending (label each bar as \"Budgeted\" and \"Actual\").",
    "data": [
      { "Bucket": "Bucket E", "Budgeted": 100, "Actual": 115 },
      { "Bucket": "Bucket D", "Budgeted": 100, "Actual": 90 },
      { "Bucket": "Bucket C", "Budgeted": 125, "Actual": 115 },
      { "Bucket": "Bucket B", "Budgeted": 125, "Actual": 140 },
      { "Bucket": "Bucket A", "Budgeted": 140, "Actual": 150 }
    ],
    "tags": [
      {"type": "bar", "props": { "x": "Actual", "y": "115",  "color": "Actual", "column": "Bucket E"}},
      {"type": "bar", "props": { "x": "Actual", "y": "90","color": "Actual", "column": "Bucket D"}},
      {"type": "bar", "props": { "x": "Budgeted","y": "100",  "color": "Budgeted", "column": "Bucket D"}},
    ]
  }, {
    "name": "Profits",
    "chart type": "Line Chart + Bar Chart",
    "preview": "quarter-line.png",
    "task": "Create a line chart to show the actual profits change at each quarter, and create a bar chart to show the number of units per quarter.",
    "data": [
      { "Quarter": "Quarter1", "Number of Units": 23, "Actual Profits": 3358 },
      { "Quarter": "Quarter2", "Number of Units": 27, "Actual Profits": 3829 },
      { "Quarter": "Quarter3", "Number of Units": 15, "Actual Profits": 2374 },
      { "Quarter": "Quarter4", "Number of Units": 43, "Actual Profits": 3373 }
    ],
    "tags": [
      {"type": "bar", "props": { "x": "Quarter1", "y": "23" }},
      {"type": "bar", "props": { "x": "Quarter2", "y": "27" }},
      {"type": "line", "props": {"x1": "Quarter1", "y1": "3358", "x2": "Quarter2", "y2": "3829" }},
    ]
  }, {
    "name": "Profits Area Chart",
    "preview": "quarter-area.png",
    "task": "Creat an area chart to show the actual profits change during the four quarters.",
    "data": [
      { "Quarter": "Quarter1", "Number of Units": 23, "Actual Profits": 3358 },
      { "Quarter": "Quarter2", "Number of Units": 27, "Actual Profits": 3829 },
      { "Quarter": "Quarter3", "Number of Units": 15, "Actual Profits": 2374 },
      { "Quarter": "Quarter4", "Number of Units": 43, "Actual Profits": 3373 }
    ],
    "tags": [
      {"type": "area", "props": {"x_left": "Quarter1", "y_top_left": "3358", "x_right": "Quarter2", 
                                 "y_top_right": "3829"}},
    ]
  }, {
    "name": "Confidence Interval",
    "preview": "confidence-interval.png",
    "task": "Create a line chart to show the trend of the mean value from Y1 to Y5. Then, create an area chart to show upper and lower range on top of the line chart.",
    "data": [
      {"Value":"means","Y1":0.52,"Y2":0.57,"Y3":0.6,"Y4":0.63,"Y5":0.63},
      {"Value":"stddev","Y1":0.1328,"Y2":0.1321,"Y3":0.1303,"Y4":0.1266,"Y5":0.1225},
      {"Value":"upper range","Y1":0.66,"Y2":0.7,"Y3":0.73,"Y4":0.75,"Y5":0.75},
      {"Value":"lower range","Y1":0.39,"Y2":0.44,"Y3":0.47,"Y4":0.5,"Y5":0.51}
    ],
    "tags": [
      {"type": "area", "props": {"x_left": "Y1", "y_top_left": "0.66", "y_bot_left": "0.39",  
                                 "x_right": "Y2", "y_top_right": "0.7", "y_bot_right": "0.44" }},
      {"type": "line", "props": {"x1": "Y1", "y1": "0.52", "x2": "Y2", "y2": "0.57" }},
      {"type": "line", "props": {"x1": "Y2", "y1": "0.57", "x2": "Y3", "y2": "0.6" }}
    ]
  }, {
    "name": "Heatmap",
    "preview": "heatmap.png",
    "task": "Create a faceted heat map to show sales value for each product in each quarter during 2011-2013. For each year, create a subplot (a heatmap) that uses color to reflect the sales value.",
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
      {"type": "rect", "props": { "x": "Q2", "y": "Product4",  "color": "8", "column": "2011"}},
      {"type": "rect", "props": { "x": "Q1", "y": "Product3",  "color": "7", "column": "2011"}}
    ]
  }, {
    "name": "Waterfall Chart",
    "preview": "waterfall.png",
    "task": "Create a waterfall chart to show changes of net cash flow, use color to show different between the value of the current month and that from the last month.",
    "data": [
      {"Net Cash Flow": 80000, "Month": "Start"},
      {"Net Cash Flow": -5003, "Month": "Jan"},
      {"Net Cash Flow": -16700, "Month": "Feb"},
      {"Net Cash Flow": 48802, "Month": "Mar"},
      {"Net Cash Flow": -11198, "Month": "Apr"},
      {"Net Cash Flow": -35260, "Month": "May"},
      {"Net Cash Flow": 18220, "Month": "Jun"},
      {"Net Cash Flow": -23840, "Month": "Jul"},
      {"Net Cash Flow": 43250, "Month": "Aug"},
      {"Net Cash Flow": -18280, "Month": "Sep"},
      {"Net Cash Flow": 26670, "Month": "Oct"},
      {"Net Cash Flow": 15000, "Month": "Nov"},
      {"Net Cash Flow": 24750, "Month": "Dec"}
    ],
    "tags": [
       {"type": "bar", "props": { "x": "Start", "y": "0", "y2": "80000", "color": "80000" }},
       {"type": "bar", "props": { "x": "Jan", "y": "80000", "y2": "74997", "color": "-5003" }},
       {"type": "bar", "props": { "x": "Feb", "y": "74997", "y2": "58297", "color": "-16700" }},
    ]
  }, {
    "name": "Subplots",
    "preview": "subplots.png",
    "task": "For each area (North_America, EMEA, ...), create a line chart as a subplot to show the price change between phases (Targeted, Pitched, Engaged, Adopted) of the project. Use lines with different colors to distinguish prices from different quarters.",
    "data": [
      {"C1":"Q1","C2":"Targeted","North_America":56,"EMEA":66,"APAC":48,"LATAM":48},
      {"C1":"Q1","C2":"Engaged","North_America":52,"EMEA":65,"APAC":47,"LATAM":48},
      {"C1":"Q1","C2":"Pitched","North_America":45,"EMEA":59,"APAC":45,"LATAM":44},
      {"C1":"Q1","C2":"Adopted","North_America":36,"EMEA":52,"APAC":38,"LATAM":31},
      {"C1":"Q2","C2":"Targeted","North_America":50,"EMEA":56,"APAC":39,"LATAM":43},
      {"C1":"Q2","C2":"Engaged","North_America":43,"EMEA":54,"APAC":37,"LATAM":41},
      {"C1":"Q2","C2":"Pitched","North_America":39,"EMEA":50,"APAC":35,"LATAM":37},
      {"C1":"Q2","C2":"Adopted","North_America":31,"EMEA":42,"APAC":27,"LATAM":26},
      {"C1":"Q3","C2":"Targeted","North_America":70,"EMEA":91,"APAC":87,"LATAM":95},
      {"C1":"Q3","C2":"Engaged","North_America":55,"EMEA":78,"APAC":75,"LATAM":80},
      {"C1":"Q3","C2":"Pitched","North_America":50,"EMEA":72,"APAC":74,"LATAM":73},
      {"C1":"Q3","C2":"Adopted","North_America":40,"EMEA":62,"APAC":59,"LATAM":53}
    ],
    "tags": [
      {"type": "line", "props": {"x1": "Targeted", "y1": "56", "x2": "Engaged", "y2": "52", "color": "Q1", "column": "North_America"}},
      //{"type": "line", "props": {"x1": "Targeted", "y1": 56, "x2": "Engaged", "y2": 54, "color": "Q2", "column": "EMEA"}},
    ]
  }, {
    "name": "Scatter Subplots",
    "preview": "subplots-point.png",
    "task": "For each region (North, West), create a scatter plot as a subplot to show the sales value for each year. Use different color to distinguish the Choc from Bisc.",
    "data": [
      {"Year":"2007","SOUTH-Choc":10,"SOUTH-Bisc":4,"WEST-Choc":6,"WEST-Bisc":4,"NORTH-Choc":14,"NORTH-Bisc":6},
      {"Year":"2008","SOUTH-Choc":11,"SOUTH-Bisc":5,"WEST-Choc":10,"WEST-Bisc":5,"NORTH-Choc":18,"NORTH-Bisc":6.7},
      {"Year":"2009","SOUTH-Choc":14,"SOUTH-Bisc":5.7,"WEST-Choc":12,"WEST-Bisc":5.7,"NORTH-Choc":19,"NORTH-Bisc":7},
      {"Year":"2010","SOUTH-Choc":16,"SOUTH-Bisc":6,"WEST-Choc":15,"WEST-Bisc":6,"NORTH-Choc":21,"NORTH-Bisc":8}
    ],
    "tags": [
      {"type": "point", "props": {"x": "2007", "y": "14", "column": "NORTH", "color": "Choc" }},
      {"type": "point", "props": {"x": "2008", "y": "18", "column": "NORTH", "color": "Choc" }},
      {"type": "point", "props": {"x": "2007", "y": "4", "column": "WEST" , "color": "Bisc"}},
    ]
  }, {
    "name": "Layered",
    "preview": "layered-line-bar.png",
    "data": [
      {"x": "Label_1", "bar 0": 100, "bar 1": 77, "bar 2": 21, "bar 3": 20},
      {"x": "Label_2", "bar 0": 114, "bar 1": 94, "bar 2": 38, "bar 3": 17},
      {"x": "Label_3", "bar 0": 151, "bar 1": 79, "bar 2": 31, "bar 3": 26},
      {"x": "Label_4", "bar 0": 175, "bar 1": 87, "bar 2": 30, "bar 3": 16},
      {"x": "Label_5", "bar 0": 178, "bar 1": 51, "bar 2": 20, "bar 3": 29},
      {"x": "Label_6", "bar 0": 187, "bar 1": 54, "bar 2": 26, "bar 3": 19},
      {"x": "Label_7", "bar 0": 113, "bar 1": 74, "bar 2": 25, "bar 3": 15},
      {"x": "Label_8", "bar 0": 140, "bar 1": 100, "bar 2": 34, "bar 3": 26},
      {"x": "Label_9", "bar 0": 119, "bar 1": 84, "bar 2": 24, "bar 3": 25},
      {"x": "Label_10", "bar 0": 113, "bar 1": 92, "bar 2": 30, "bar 3": 21},
      {"x": "Label_11", "bar 0": 179, "bar 1": 61, "bar 2": 20, "bar 3": 23},
      {"x": "Label_12", "bar 0": 143, "bar 1": 74, "bar 2": 26, "bar 3": 28}
    ],
    "tags": [
      {"type": "line", "props": {"x1": "Label_1", "y1": "100", "x2": "Label_2", "y2": "114", "color": "bar 0" }},
      {"type": "bar", "props": {"x": "Label_1", "y": "77", "color": "bar 1" }},
      {"type": "bar", "props": {"x": "Label_2", "y": "38", "color": "bar 2" }},
    ]
  }, {
    "name": "Stacked Bar",
    "preview": "stacked-bar.png",
    "data": [
      {"Period":1,"APPRENTICE":8.8,"CLERICAL":14.7,"ENGINEERING SPECIALIST":13.2,"MAJOR EXECUTIVE":22,"SKILLED LABOR":11.8,"MINOR EXECUTIVE":16,"SALESMAN":5.1,"NO CLASS":5.9,"MISC.":1.9},
      {"Period":2,"APPRENTICE":4.2,"CLERICAL":9.7,"ENGINEERING SPECIALIST":16.6,"MAJOR EXECUTIVE":29.2,"SKILLED LABOR":5.5,"MINOR EXECUTIVE":25,"SALESMAN":5.5,"NO CLASS":4.2,"MISC.":0},
      {"Period":3,"APPRENTICE":1,"CLERICAL":0,"ENGINEERING SPECIALIST":14.3,"MAJOR EXECUTIVE":43,"SKILLED LABOR":1.6,"MINOR EXECUTIVE":30.4,"SALESMAN":5.5,"NO CLASS":4.2,"MISC.":0},
      {"Period":4,"APPRENTICE":1,"CLERICAL":0,"ENGINEERING SPECIALIST":9,"MAJOR EXECUTIVE":51,"SKILLED LABOR":0,"MINOR EXECUTIVE":28.8,"SALESMAN":5.5,"NO CLASS":4,"MISC.":0.7},
      {"Period":5,"APPRENTICE":0,"CLERICAL":0,"ENGINEERING SPECIALIST":10.7,"MAJOR EXECUTIVE":57,"SKILLED LABOR":0,"MINOR EXECUTIVE":21.4,"SALESMAN":7.2,"NO CLASS":1.8,"MISC.":1.9},
      {"Period":6,"APPRENTICE":0,"CLERICAL":0,"ENGINEERING SPECIALIST":10.9,"MAJOR EXECUTIVE":65,"SKILLED LABOR":0,"MINOR EXECUTIVE":13.2,"SALESMAN":6.6,"NO CLASS":2.8,"MISC.":1.8},
      {"Period":7,"APPRENTICE":0,"CLERICAL":0,"ENGINEERING SPECIALIST":7.1,"MAJOR EXECUTIVE":67,"SKILLED LABOR":0,"MINOR EXECUTIVE":14.1,"SALESMAN":4.4,"NO CLASS":2.4,"MISC.":4.4},
      {"Period":8,"APPRENTICE":0,"CLERICAL":0,"ENGINEERING SPECIALIST":2.8,"MAJOR EXECUTIVE":75,"SKILLED LABOR":0,"MINOR EXECUTIVE":11.2,"SALESMAN":2.4,"NO CLASS":2.8,"MISC.":5.6},
      {"Period":9,"APPRENTICE":0,"CLERICAL":0,"ENGINEERING SPECIALIST":4.5,"MAJOR EXECUTIVE":77,"SKILLED LABOR":0,"MINOR EXECUTIVE":9,"SALESMAN":4.5,"NO CLASS":0,"MISC.":4.5},
      {"Period":10,"APPRENTICE":0,"CLERICAL":0,"ENGINEERING SPECIALIST":5.6,"MAJOR EXECUTIVE":88.8,"SKILLED LABOR":0,"MINOR EXECUTIVE":0,"SALESMAN":5.6,"NO CLASS":0,"MISC.":0}
    ],
    "tags": [
      {"type": "bar", "props": {"x": "1", "y": "8.8", "color": "APPRENTICE" }},
      {"type": "bar", "props": {"x": "2", "y": "9.7", "color": "CLERICAL" }},
    ]
  }, {
    "name": "Line Chart",
    "preview": "line-chart.png",
    "task": "Create a line chart to show how values changes from id 0 to 11 for each column. Values from different columns should have different colors.",
    "data": [
      {"Consuntivo 2010":42560,"Consuntivo 2011":64146,"Obiettivo 2011":51072.0,"id":0},
      {"Consuntivo 2010":46368,"Consuntivo 2011":74043,"Obiettivo 2011":64915.2,"id":1},
      {"Consuntivo 2010":46826,"Consuntivo 2011":110358,"Obiettivo 2011":65556.4,"id":2},
      {"Consuntivo 2010":53090,"Consuntivo 2011":132409,"Obiettivo 2011":74326.0,"id":3},
      {"Consuntivo 2010":60331,"Consuntivo 2011":162675,"Obiettivo 2011":84463.4,"id":4},
      {"Consuntivo 2010":64501,"Consuntivo 2011":171886,"Obiettivo 2011":90301.4,"id":5},
      {"Consuntivo 2010":69244,"Consuntivo 2011":184259,"Obiettivo 2011":96941.6,"id":6},
      {"Consuntivo 2010":73102,"Consuntivo 2011":188505,"Obiettivo 2011":102342.8,"id":7},
      {"Consuntivo 2010":80000,"Consuntivo 2011":204907,"Obiettivo 2011":112000.0,"id":8},
      {"Consuntivo 2010":83922,"Consuntivo 2011":212013,"Obiettivo 2011":117490.8,"id":9},
      {"Consuntivo 2010":86729,"Consuntivo 2011":221144,"Obiettivo 2011":121420.6,"id":10},
      {"Consuntivo 2010":88889,"Consuntivo 2011":221709,"Obiettivo 2011":124444.6,"id":11}
    ],
    "tags": [
      {"type": "line", "props": {"x1": "0", "y1": "42560", "x2": "1", "y2": "46368", "color": "Consuntivo 2010" }}
    ]
  }
]

export default TaskGallery;


