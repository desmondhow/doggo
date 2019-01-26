import React from 'react';
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { Dropdown } from 'react-native-material-dropdown';
import { Field } from 'redux-form';

export const connectReduxForm = (formName, formClass, mapStateToProps) => (
  connect(mapStateToProps)(
    reduxForm({
      form: formName
    })(formClass)
  )
);

export const renderDropdown = (
  value,
  onChange,
  dropdownOptions,
  containerStyle={},
  fontSize=16,
  placeholder=null,
) => (
  <Dropdown
    overlayStyle={{marginTop: 95}}
    containerStyle={containerStyle}
    fontSize={fontSize}
    value={value}
    data={dropdownOptions.map(option => ({ value: option }))}
    onChangeText={onChange}
    placeholder={placeholder}
  />
)

export const renderReduxDropdown = (
  name,
  dropdownOptions,
  containerStyle = {},
  customOwnChange = null,
  customValue = null,
  fontSize=16,
  placeholder = ''
) => (
  <Field name={name} component={(inputProps) => {
    const { input: { value, onChange } } = inputProps;
    return (
      renderDropdown(
        !!customValue ? customValue : value,
        !!customOwnChange ?
          val => {onChange(val); customOwnChange(val)} :
          onChange,
        dropdownOptions,
        containerStyle,
        fontSize,
        placeholder)
    )
  }}/>
)



