import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import { ButtonGroup } from 'react-native-elements';

export default class CustomButtonGroup extends Component {
  state = {
    index: 0
  }
  
  updateIndex = (index) => {
    this.setState({index})
  }
  
  render() {
    return (
      <View style={styles.container}>
      <ButtonGroup
        selectedBackgroundColor="pink"
        onPress={this.updateIndex}
        selectedIndex={this.state.index}
        buttons={this.props.buttons}
        containerStyle={{height: 30}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});