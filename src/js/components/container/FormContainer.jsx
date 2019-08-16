import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/Input.jsx";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


class FormContainer extends Component {
  constructor() {
    super();
    this.state = {
      seo_title: "",
      data: [
        {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
        {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
        {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52},
        {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
      ]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
    const { seo_title, data } = this.state;
    return (
      <div>
        <ReactTable
            data={data}
            resolveData={data => data.map(row => row)}
            columns={[
                  {
                    Header: "First Name",
                    accessor: "a"
                  },
                  {
                    Header: "Last Name",
                    accessor: "b"
                  }
            ]}
            defaultPageSize={Math.min(data.length, 15)}
            showPaginationBottom={data.length > 15}
            className="-striped -highlight"
          />

          <Input
            text="SEO title"
            label="seo_title"
            type="text"
            id="seo_title"
            value={seo_title}
            handleChange={this.handleChange}
          />
        </div>
    );
  }
}

const wrapper = document.getElementById("control-panel");
wrapper ? ReactDOM.render(<FormContainer />, wrapper) : false;
export default FormContainer;

