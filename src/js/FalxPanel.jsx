import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "./Input.jsx";
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Files from 'react-files'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import '../scss/app.scss';

class FalxPanel extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52},
        {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
      ]
    };
    this.onFilesChange = this.onFilesChange.bind(this);
  }
  onFilesChange(files) {
    const file = files[0]
    var reader = new FileReader();
    reader.onload = function(event) {
      // The file's text will be printed here
      console.log(event.target.result);
      this.setState({
        data: JSON.parse(event.target.result)
      });
    }.bind(this);
    reader.readAsText(file);
  }
  onFilesError(error, file) {
    console.log('error code ' + error.code + ': ' + error.message)
  }
  render() {

    const columns = []
    if (this.state.data.length > 0) {
      const keys = Object.keys(this.state.data[0]);
      for (const i in keys) {
        columns.push({
          Header: keys[i],
          accessor: keys[i]
        })
      }
    }

    return (
      <div class="container">
        <div class="row mt-5">
          <div class='col-4'>
            <ReactTable
              data={this.state.data}
              //resolveData={data => this.state.data.map(row => row)}
              columns={columns}
              defaultPageSize={Math.min(this.state.data.length, 15)}
              showPaginationBottom={this.state.data.length > 15}
              className="-striped -highlight"
            />
          </div>
          <div class='col-8'>
            <text>{JSON.stringify(this.state.data)}</text>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-4">
            <ButtonToolbar>
              <Button variant="outline-primary">
                <Files
                  className='files-dropzone'
                  onChange={this.onFilesChange}
                  onError={this.onFilesError}
                  accepts={['image/png', '.csv', '.json']}
                  //multiple
                  //maxFiles={1}
                  maxFileSize={1000000}
                  minFileSize={0}
                  clickable>
                  Load Data
                </Files>
              </Button>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    );
  }
}

const wrapper = document.getElementById("falx-interface");
wrapper ? ReactDOM.render(<FalxPanel />, wrapper) : false;
export default FalxPanel;

