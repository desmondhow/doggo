import React from 'react';

import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import UDCHomeScreen from '../../screens/sessions/UDC/UDCHomeScreen';
import UDCGeneralScreen from '../../screens/sessions/UDC/UDCGeneralScreen';

const newSessionNavigator = createBottomTabNavigator({
  'General': UDCGeneralScreen
});

const navigator = createStackNavigator({
  UDCNewSession: newSessionNavigator
}, {
  headerMode: 'none'
});


export default navigator;