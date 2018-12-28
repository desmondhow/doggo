import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon, Button } from 'react-native-elements';
import {AsyncStorage} from "react-native";

import TrainingSessionsHomeScreen from '../../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../../screens/sessions/UDC/UDCHomeScreen';
import UDCNavigator from './UDCNavigator';
import { onSignOut } from '../../auth';

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
  }
});
