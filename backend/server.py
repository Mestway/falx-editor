from flask import Flask, escape, request
import flask
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'

@app.route('/falx', methods=['GET', 'POST'])
def run_falx_synthesizer():

    if request.is_json:
        app.logger.info("# request data: ")
        content = request.get_json()
        
        input_data = content["data"]
        visual_elements = content["tags"]

        app.logger.info(input_data)
        app.logger.info(visual_elements)

    specs = [
      {
        "mark": "line",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
      }
      },{
        "mark": "bar",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      },{
        "mark": "point",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      },{
        "mark": "circle",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      },{
        "mark": "rect",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      },{
        "mark": "text",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      },{
        "mark": "bar",
        "encoding": {
          "y": {"field": "a", "type": "ordinal"},
          "x": {"field": "b", "type": "quantitative"}
        }
      }
    ]
    response = flask.jsonify(specs)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)