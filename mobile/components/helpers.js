import React from "react";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";
import { Field } from "redux-form";
import { FormInput } from "react-native-elements";

import API from "../constants/Api";

export const connectReduxForm = (
  formName,
  formClass,
  mapStateToProps,
  mapDispatchToProps
) =>
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    reduxForm({
      form: formName
    })(formClass)
  );

// takes in a reference to 'this' instance of current screen
export const updateProfileState = that =>
  new Promise((res, rej) =>
    API.loadProfileURL
      .then(url => request(url, null, "GET"))
      .then(res => res.json())
      .then(profile =>
        res(that.setState({ trainers: profile.trainers, dogs: profile.dogs }))
      )
      .catch(err => {
        console.log(err);
        rej(err);
      })
  );

export const renderDropdown = (
  value,
  onChange,
  dropdownOptions,
  containerStyle = {},
  fontSize = 16,
  placeholder = null
) => (
  <Dropdown
    overlayStyle={{ marginTop: 95 }}
    containerStyle={containerStyle}
    fontSize={fontSize}
    value={value}
    data={dropdownOptions.map(option => ({ value: option }))}
    onChangeText={onChange}
    placeholder={placeholder}
  />
);

export function renderReduxFormInput(name, options) {
  return (
    <Field
      name={name}
      component={inputProps => {
        const {
          input: { value, onChange }
        } = inputProps;
        return (
          <FormInput
            containerStyle={options.containerStyle}
            value={value}
            onChangeText={onChange}
            numberOfLines={options.numberOfLines}
            multiline={options.multiline}
            inputStyle={
              options.inputStyle ? options.inputStyle : { width: 400 }
            }
            placeholder={options.placeholder}
            maxHeight={100}
          />
        );
      }}
    />
  );
}

export const renderReduxDropdown = (
  name,
  dropdownOptions,
  containerStyle = {},
  customOwnChange = null,
  customValue = null,
  fontSize = 16,
  placeholder = ""
) => (
  <Field
    name={name}
    component={inputProps => {
      const {
        input: { value, onChange }
      } = inputProps;
      return renderDropdown(
        !!customValue ? customValue : value,
        !!customOwnChange
          ? val => {
              onChange(val);
              customOwnChange(val);
            }
          : onChange,
        dropdownOptions,
        containerStyle,
        fontSize,
        placeholder
      );
    }}
  />
);

export const request = (url, body, method = "POST") =>
  fetch(url, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: body
  });
