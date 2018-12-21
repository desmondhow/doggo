import React from 'react';
import { Icon } from 'react-native-elements';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon
        name='arrow-circle-right'
        type="font-awesome"
        size={10}
      />
    );
  }
}