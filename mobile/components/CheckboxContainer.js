import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Field } from 'redux-form';

export default class CheckboxContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Field
          name={this.props.name}
          component={inputProps => {
            const { input } = inputProps;

            return this.props.checkboxes.map(item => {
              const checkboxName = item.label;
              const isChecked = input.value.indexOf(checkboxName) !== -1;
              return (
                <CheckBox 
                  title={checkboxName} 
                  checked={isChecked} 
                  onPress={_ => {
                    const checkedBoxes = [...input.value];

                    if (!isChecked) {
                      checkedBoxes.push(checkboxName);
                    } else {
                      checkedBoxes.splice(checkedBoxes.indexOf(checkboxName), 1);
                    }
                    return input.onChange(checkedBoxes);
                  }}
                />
              )
            });
          }}
        />
    );
  }
}
