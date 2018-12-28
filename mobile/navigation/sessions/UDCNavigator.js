import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import UDCGeneralScreen from '../../screens/sessions/UDC/UDCGeneralScreen';
import UDCHidesScreen from '../../screens/sessions/UDC/UDCHidesScreen';
import TabBarIcon from '../../components/TabBarIcon';

const newSessionNavigator = createBottomTabNavigator({
  'General': UDCGeneralScreen,
  'Hides': UDCHidesScreen
});

newSessionNavigator.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
};

const navigator = createStackNavigator({
  UDCNewSession: newSessionNavigator
}, {
  headerMode: 'none'
});


export default navigator;