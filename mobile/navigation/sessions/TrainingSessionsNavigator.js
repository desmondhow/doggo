import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'native-base';

import TrainingSessionsHomeScreen from '../../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../../screens/sessions/UDC/UDCHomeScreen';
import UDCNavigator from './UDCNavigator';

export default createStackNavigator({
  Home: {
    screen: TrainingSessionsHomeScreen,
    navigationOptions: ({navigation}) => ({
      headerLeft: <Icon type='FontAwesome' name="paw" size={35} style={{marginLeft: 30}} onPress={ () => navigation.toggleDrawer() } />,
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
