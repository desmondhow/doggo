import React from 'react';
import { createStackNavigator } from 'react-navigation';

import TrainingSessionsHomeScreen from '../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../screens/sessions/UDC/UDCHomeScreen';
import UDCNewSessionScreen from '../screens/sessions/UDC/UDCNewSessionScreen';
import UDCBuildingSearchScreen from '../screens/sessions/UDC/UDCBuildingSearchScreen';
import UDCTrainDogScreen from '../screens/sessions/UDC/UDCTrainDogScreen';
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
  UDCBuildingSearch: {
    screen: UDCBuildingSearchScreen,
    navigationOptions: { 
      title: 'UDC Building Search'
    }
  },
  UDCTrainDog: {
    screen: UDCTrainDogScreen,
    navigationOptions: { 
      title: 'UDC Train Dog'
    }
  },
  UDCNewSession: { 
    screen: UDCNewSessionScreen,
    navigationOptions: { 
      title: 'New UDC Session'
    }
  }
});