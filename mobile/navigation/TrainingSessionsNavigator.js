import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon, Button } from 'react-native-elements';

import TrainingSessionsHomeScreen from '../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../screens/sessions/UDC/UDCHomeScreen';
import UDCNewSessionScreen from '../screens/sessions/UDC/UDCNewSessionScreen';
import UDCBuildingSearchScreen from '../screens/sessions/UDC/UDCBuildingSearchScreen';
import UDCTrainDogScreen from '../screens/sessions/UDC/UDCTrainDogScreen';
import { onSignOut } from '../components/auth';

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
