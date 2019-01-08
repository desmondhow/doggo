import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Icon, Button } from 'react-native-elements';
import {AsyncStorage} from "react-native";

import TrainingSessionsHomeScreen from '../../screens/sessions/SessionsHomeScreen';
import UDCHomeScreen from '../../screens/sessions/UDC/UDCHomeScreen';
import UDCNavigator from './UDCNavigator';
import { onSignOut } from '../../components/auth';
import store from '../../redux/store';

const TraningSessionsNavigator = createStackNavigator({
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
  'UDC.NewSession': { 
    screen: UDCNavigator,
    navigationOptions: { 
      title: 'New UDC Session'
    }
  }
});

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

export default () => 
  <TraningSessionsNavigator 
    onNavigationStateChange={(prevState, currState) => {
      const currScreen = getActiveRouteName(currState);
      const prevScreen = getActiveRouteName(prevState);

      if (currScreen === 'UDC' && prevScreen === 'UDC.General') {
        console.log(JSON.stringify(store.getState()));
      }

      // console.log(`currScreen: ${currScreen}, prevScreen: ${prevScreen}`)
    }}
  />
