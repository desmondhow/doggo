import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon, Button } from 'react-native-elements';
import {AsyncStorage} from "react-native";

import TrainingSessionsHomeScreen from '../../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../../screens/sessions/UDC/UDCHomeScreen';
import UDCBuildingSearch from '../../screens/sessions/UDC/UDCBuildingSearchScreen';
import UDCTrainDog from '../../screens/sessions/UDC/UDCTrainDogScreen';
import UDCNavigator from './UDCNavigator';
import { onSignOut } from '../../components/auth';

export default createStackNavigator({
  Home: {
    screen: TrainingSessionsHomeScreen,
    navigationOptions: ({navigation}) => ({
      headerLeft: 
        <Icon 
          type='font-awesome' 
          name="paw" 
          size={35} 
          containerStyle={{marginLeft: 20}} 
          onPress={() => navigation.toggleDrawer()} 
        />,
      headerRight: 
        <Button
          transparent
          title='Logout'
          color='black'
          onPress={() => {
            onSignOut();
            navigation.navigate('SignedOut')
          }} 
        />,
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
    screen: UDCNavigator,
    navigationOptions: { 
      title: 'New UDC Session'
    }
  },
  UDCBuildingSearch: {
    screen: UDCBuildingSearch,
    navigationOptions: { 
      title: 'UDC Building Search'
    }
  },
  UDCTrainDog: {
    screen: UDCTrainDog,
    navigationOptions: { 
      title: 'UDC Train Dog'
    }
  }
});
