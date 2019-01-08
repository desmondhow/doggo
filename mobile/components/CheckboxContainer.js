import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';

export default class CheckboxContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: new Map(),
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    const isChecked = this.state.checkedItems.get(value) ? this.state.checkedItems.get(value) : false;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(value, !isChecked) }));
  }

  render() {
    return (
        <View>
        {
          this.props.checkboxes.map(item => (
            <View key={item.value}>
              <CheckBox title={item.label} checked={this.state.checkedItems.get(item.value)} onPress={this.handleChange.bind(this, item.value)}/>
              {/* <CheckBox title={item.label} checked={this.state.checked} onPress={() => this.setState({checked: !this.state.checked})}/> */}
            </View>
          ))
        }
        </View>
    );
  }
}
