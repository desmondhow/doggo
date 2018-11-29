import React from 'react';
import { Icon } from 'native-base';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon
        name='arrow-circle-right'
        type="FontAwesome"
        size={10}
      />
    );
  }
}