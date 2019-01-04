import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Checkbox } from 'react-native-elements';

export class CheckboxContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: new Map(),
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

  render() {
    return (
        <View>
        {
          this.props.checkboxes.map(item => (
            <View key={item.value}>
              <Text>{item.label}</Text>
              <Checkbox title={item.label} checked={this.state.checkedItems.get(item.value)} onPress={this.handleChange}/>
            </View>
          ))
        }
        </View>
    );
  }
}

export default CheckboxContainer;