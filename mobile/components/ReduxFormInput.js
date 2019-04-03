import React, { Component } from "react";
import { FormInput } from "react-native-elements";
import { Field } from "redux-form";

export default class ReduxFormInput extends Component {
  constructor(props) {
    super(props);
    this.state = props;
    this.renderFormInput = this.renderFormInput.bind(this);
  }
  renderFormInput(reduxProps) {
    const {
      input: { value, onChange }
    } = reduxProps;
    return (
      <FormInput
        containerStyle={this.state.containerStyle}
        value={value}
        onChangeText={onChange}
        numberOfLines={this.state.numberOfLines}
        multiline={this.state.multiline}
        inputStyle={this.state.inputStyle ? inputStyle : { width: 400 }}
        placeholder={this.state.placeholder}
        maxHeight={100}
      />
    );
  }
  render() {
    return <Field name={this.state.name} component={this.renderFormInput} />;
  }
}
