import sys
import os

from flask import Flask, escape, request
import flask
import json
from flask_cors import CORS

sys.path.append(os.path.abspath('/Users/clwang/Research/falx-project/falx/falx'))

GRAMMAR_BASE_FILE = "/Users/clwang/Research/falx-project/falx/falx/dsl/tidyverse-lite.tyrell.base"

from falx.interface import FalxInterface

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    name = request.args.get("name", "World")

    input_data = [
        { "Bucket": "Bucket E", "Budgeted": 100, "Actual": 115 },
        { "Bucket": "Bucket D", "Budgeted": 100, "Actual": 90 },
        { "Bucket": "Bucket C", "Budgeted": 125, "Actual": 115 },
        { "Bucket": "Bucket B", "Budgeted": 125, "Actual": 140 },
        { "Bucket": "Bucket A", "Budgeted": 140, "Actual": 150 }
    ]

    raw_trace = [
        {"type": "bar", "props": { "x": "Actual", "y": 115,  "color": "Actual", "x2": "", "y2": "", "column": "Bucket E"}},
        {"type": "bar", "props": { "x": "Actual", "y": 90,"color": "Actual", "x2": "", "y2": "", "column": "Bucket D"}},
        {"type": "bar", "props": { "x": "Budgeted","y": 100,  "color": "Budgeted", "x2": "", "y2": "", "column": "Bucket D"}},
    ]

    result = FalxInterface.synthesize(inputs=[input_data], raw_trace=raw_trace, 
                extra_consts=[], backend="vegalite", 
                grammar_base_file=GRAMMAR_BASE_FILE)

    for c in result:
        print(c[0])
        print(c[1].to_vl_json())

    return 'Hello!'

@app.route('/falx', methods=['GET', 'POST'])
def run_falx_synthesizer():
    if request.is_json:
        app.logger.info("# request data: ")
        content = request.get_json()
        
        input_data = content["data"]
        visual_elements = content["tags"]

        app.logger.info(input_data)
        app.logger.info(visual_elements)

        print(input_data)
        print(visual_elements)

        result = FalxInterface.synthesize(
                    inputs=[input_data], 
                    raw_trace=visual_elements, 
                    extra_consts=[],
                    group_results=True,
                    config={"backend": "vegalite",
                            "search_start_depth_level": 0,
                            "search_stop_depth_level": 2,
                            "grammar_base_file": GRAMMAR_BASE_FILE})

        response = flask.jsonify([{"rscript": [str(x) for x in result[key][0][0]], "vl_spec": result[key][0][1].to_vl_json()} for key in result])
    else:
        response = falx.jsonify([])

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)