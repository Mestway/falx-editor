const TaskGallery = [
    {
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
    }
]

export default TaskGallery;