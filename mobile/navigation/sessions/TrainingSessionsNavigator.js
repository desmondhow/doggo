import React from 'react';
import {createStackNavigator} from 'react-navigation';
import {Icon, Button} from 'react-native-elements';

import TrainingSessionsHomeScreen from '../../screens/sessions/SessionsHomeScreen';
import UDCNavigator from './UDCNavigator';
import {onSignOut} from '../../components/auth';
import {RESET_STATE} from "@redux-offline/redux-offline/src/constants";
import store from '../../redux/reduxConfig'

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
                        store.dispatch({type: RESET_STATE});
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