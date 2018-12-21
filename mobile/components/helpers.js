import React from 'react';
import {
  View,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { Field } from 'redux-form'
import { center, inputStyle } from '../constants/Styles';
import Colors from '../constants/Colors';
import { Text, Icon } from 'react-native-elements';
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'

export const renderField = (name, inputType, dropdownOptions) => {
  let input;
  if (inputType == 'dropdown') {
    input = (inputProps) => _renderDropdown(dropdownOptions, inputProps);
  }
  return (
    <View style={{marginBottom: 30, flexDirection: 'row'}}>
      <Text style={{ marginTop: 5 }}>{name}:</Text>
      <Field name={name} key={name} type={inputType} component={input}/>
    </View>
  );
};

export const connectReduxForm = (formName, formClass, mapStateToProps, mapDispatchToProps) => 
  connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: formName })(formClass))

export const renderSubmitBtn = (handleSubmit, onSubmit) => 
  <Button 
    light 
    onPress={handleSubmit(onSubmit)} 
    style={{
      ...center,
      marginLeft: 60, 
      marginTop: 20, 
      width: '80%',     
    }}
  >
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Next</Text>
    <Icon
      name='arrow-circle-right'
      type="font-awesome"
      size={10}
    />
  </Button>

const _renderDropdown = (options, inputProps) => {
  const { input: { value, onChange }} = inputProps;
  return (
    <ModalDropdown 
      {...inputProps}
      style={{
        ...inputStyle,
        height: 45,
        marginLeft: 15,
      }}
      dropdownStyle={{
        ...inputStyle,
        height: 130,
      }}
      options={options}
      onSelect={(_, value) => onChange(value)}
      defaultIndex={options.indexOf(value)}
      renderRow={(option) => (
        <Text 
          style={{
            textAlign: 'center',
            backgroundColor: 'white',
            color: value == option ? 'black' : Colors.darkGrey,
            padding: 10,
            paddingLeft: 25, 
            paddingRight: 25,
            fontWeight: value == option ? 'bold' : 'normal',
            height: rowHeight
          }}
        >
          {option}
        </Text>
      )}
    >
      <View style={{ ...center, flexDirection: 'row' }}>
        <Text style={{fontSize: 19, margin: 10}}>{value}</Text>
        <Icon
          name='sort-down'
          type="font-awesome"
          size={10}
          color='white'
          style={{ marginLeft: 5, marginBottom: 10, marginRight: 10 }}
        />
      </View>
    </ModalDropdown>
  );
}