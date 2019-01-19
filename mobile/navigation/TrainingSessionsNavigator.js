import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon, Button } from 'react-native-elements';

import TrainingSessionsHomeScreen from '../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../screens/sessions/UDC/UDCHomeScreen';
import UDCNewSessionScreen from '../screens/sessions/UDC/UDCNewSessionScreen';
import { mainNavHeader } from './helpers';

export default createStackNavigator({
  Home: {
    screen: TrainingSessionsHomeScreen,
    navigationOptions: ({navigation}) => ({
      ...mainNavHeader(navigation),
      title: 'Sessions'
    })
  },
  UDC: { 
    screen: UDCHomeScreen,
    navigationOptions: { 
      title: 'UDC'
    }
  },
  UDCNewSession: { 
    screen: UDCNewSessionScreen,
    navigationOptions: { 
      title: 'New UDC Session'
    }
  }
});