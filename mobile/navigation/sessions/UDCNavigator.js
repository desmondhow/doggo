import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import UDCHomeScreen from '../../screens/sessions/UDC/UDCHomeScreen';
import UDCNewSessionScreen from '../../screens/sessions/UDC/UDCNewSessionScreen';

const navigator = createStackNavigator({
  UDC: UDCHomeScreen,
  UDCNewSession: UDCNewSessionScreen
}, {
  // headerMode: 'none'
});



// export default navigator;
export default UDCHomeScreen;