import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, createBottomTabNavigator, createDrawerNavigator} from 'react-navigation';
import { Button } from 'react-native-elements'

import TabBarIcon from '../components/TabBarIcon';

import TrainingSessionsNavigator from './TrainingSessionsNavigator';
import DogsHomeScreen from '../screens/dogs/DogsHomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/users/ProfileScreen';
import { mainNavHeader } from './helpers';

const DogsStack = createStackNavigator({
    Dogs: DogsHomeScreen,
});

DogsStack.navigationOptions = {
    tabBarLabel: 'Dogs',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
        />
    ),
};

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
        />
    ),
};

const ProfileStack = createStackNavigator({
    Profile: { 
      screen: ProfileScreen,
      navigationOptions: ({navigation}) => ({ 
        ...mainNavHeader(navigation)
      })
    }
});



ProfileStack.navigationOptions = {
    tabBarLabel: 'My Profile',
    tabBarIcon: ({focused}) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
        />
    ),
};

//Add here the link for the other components
export default createDrawerNavigator({
    'Training Sessions': TrainingSessionsNavigator,
    'Dogs': DogsStack,
    'Settings': SettingsStack,
    'My Profile': ProfileStack
});

