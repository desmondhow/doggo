import React from 'react';
import { createStackNavigator } from 'react-navigation';

import TrainingSessionsHomeScreen from '../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../screens/sessions/UDC/UDCHomeScreen';
import UDCNewSessionScreen from '../screens/sessions/UDC/UDCNewSessionScreen';
import UDCBuildingSearchScreen from '../screens/sessions/UDC/UDCBuildingSearchScreen';
import UDCTrainDogScreen from '../screens/sessions/UDC/UDCTrainDogScreen';
import LHSHomeScreen from '../screens/sessions/LHS/LHSHomeScreen';
import LHSNewSessionScreen from '../screens/sessions/LHS/LHSNewSessionScreen';
import LHSSearchScreen from '../screens/sessions/LHS/LHSSearchScreen';
import LHSTrainDogScreen from '../screens/sessions/LHS/LHSTrainDogScreen';
import OBDHomeScreen from '../screens/sessions/Obedience/OBDHomeScreen';
import OBDNewSessionScreen from '../screens/sessions/Obedience/OBDNewSessionScreen';
import OBDFunctionScreen from '../screens/sessions/Obedience/OBDFunctionScreen';
// import OBDTrainDogScreen from '../screens/sessions/Obedience/OBDTrainDogScreen';

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
  },
  LHS: { 
    screen: LHSHomeScreen,
    navigationOptions: { 
      title: 'Live Human Search'
    }
  },
  LHSNewSession: {
    screen: LHSNewSessionScreen,
    navigationOptions: {
      title: 'New Live Human Search Session'
    }
  },
  LHSSearch: {
    screen: LHSSearchScreen,
    navigationOptions: { 
      title: 'Live Human Search'
    }
  },
  LHSTrainDog: {
    screen: LHSTrainDogScreen,
    navigationOptions: { 
      title: 'Live Human Search'
    }
  },
  OBD: { 
    screen: OBDHomeScreen,
    navigationOptions: { 
      title: 'Obedience'
    }
  },
  OBDNewSession: {
    screen: OBDNewSessionScreen,
    navigationOptions: {
      title: 'New Obedience Session'
    }
  },
  OBDFunction: {
    screen: OBDFunctionScreen,
    navigationOptions: { 
      title: 'Obedience Training'
    }
  }
});