import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon, Button } from 'react-native-elements';

import TrainingSessionsHomeScreen from '../../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../../screens/sessions/UDC/UDCHomeScreen';
import UDCNewSessionScreen from '../../screens/sessions/UDC/UDCNewSessionScreen';
import UDCNavigator from './UDCNavigator';
import { onSignOut } from '../../components/auth';
import store from '../../redux/store';

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
    screen: UDCNavigator,
    navigationOptions: { 
      title: 'UDC'
    }
  },
  // 'UDC.NewSession': { 
  //   screen: UDCNewSessionScreen,
  //   navigationOptions: { 
  //     title: 'New UDC Session'
  //   }
  // }
});