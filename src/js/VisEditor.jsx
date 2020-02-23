import React, { Component } from "react";
import Form from "react-jsonschema-form";

const schema = {
  "title": "A registration form",
  "description": "A simple form example.",
  "type": "object",
  "required": [
    "firstName",
    "lastName"
  ],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name",
      "default": "Chuck"
    },
    "lastName": {
      "type": "string",
      "title": "Last name"
    },
    "age": {
      "type": "integer",
      "title": "Age"
    },
    "bio": {
      "type": "string",
      "title": "Bio"
    },
    "password": {
      "type": "string",
      "title": "Password",
      "minLength": 3
    },
    "telephone": {
      "type": "string",
      "title": "Telephone",
      "minLength": 10
    }
  }
}

const uiSchema = {
  "firstName": {
    "ui:autofocus": true,
    "ui:emptyValue": ""
  },
  "age": {
    "ui:widget": "updown",
    "ui:title": "Age of person",
    "ui:description": "(earthian year)"
  },
  "bio": {
    "ui:widget": "textarea"
  },
  "password": {
    "ui:widget": "password",
    "ui:help": "Hint: Make it strong!"
  },
  "date": {
    "ui:widget": "alt-datetime"
  },
  "telephone": {
    "ui:options": {
      "inputType": "tel"
    }
  }
}

const formData = {
  "firstName": "Chuck",
  "lastName": "Norris",
  "age": 75,
  "bio": "Roundhouse kicking asses since 1940",
  "password": "noneed"
}

class VisEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spec: props.spec
    };
  }

  render() {
      return (<Form
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onSubmit={({ formData }, e) => {
          console.log("submitted formData", formData);
          console.log("submit event", e);
        }}
        onBlur={(id, value) =>
          console.log(`Touched ${id} with value ${value}`)
        }
        onFocus={(id, value) =>
          console.log(`Focused ${id} with value ${value}`)
        }>
        <div className="row">
          <div className="col-sm-3">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </div>
      </Form>)
  }
}


export default VisEditor;
