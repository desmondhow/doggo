import React from 'react';
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { Dropdown } from 'react-native-material-dropdown';
import { Field } from 'redux-form';

export const connectReduxForm = (formName, formClass, mapStateToProps, mapDispatchToProps) => (
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({ 
      form: formName, 
      destroyOnUnmount: false 
    })(formClass)
  )
)

export const renderDropdown = (name, dropdownOptions, containerStyle) => (
  <Field name={name} component={(inputProps) => {
    const { input: { value, onChange } } = inputProps;
    return (
      <Dropdown 
        overlayStyle={{marginTop: 95}}
        containerStyle={containerStyle}
        value={value}
        data={dropdownOptions.map(option => ({ value: option }))} 
        onChangeText={onChange}
      />
    )
  }}/>
)



