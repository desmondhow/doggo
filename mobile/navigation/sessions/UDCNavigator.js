import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import UDCGeneralScreen from '../../screens/sessions/UDC/UDCGeneralScreen';
import UDCHidesScreen from '../../screens/sessions/UDC/UDCHidesScreen';
import TabBarIcon from '../../components/TabBarIcon';

const newSessionNavigator = createBottomTabNavigator({
  'UDC.General': UDCGeneralScreen,
  'UDC.Hides': UDCHidesScreen
});

// gets the current screen from navigation state
const getActiveRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

newSessionNavigator.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
    />
  )
};

const navigator = createStackNavigator({
  UDCNewSession: newSessionNavigator
}, {
  headerMode: 'none',
});


export default (navigator);