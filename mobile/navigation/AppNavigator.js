import React from 'react';
import {createStackNavigator, createSwitchNavigator} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SignupScreen from "../screens/login/SignupScreen";
import LoginScreen from "../screens/login/LoginScreen";

/**
 * Handles routing in the application, checking if user is signed in or not, and displaying the correct screen
 */



//If the user is not signed in, we show them this
export const SignedOut = createStackNavigator({
    SignIn: {
        screen: LoginScreen,
    },
    SignUp: {
        screen: SignupScreen,
    }
});

//Else, they can access everything
export const SignedIn = MainTabNavigator;

export const createRootNavigator = (signedIn = false) => {
    return createSwitchNavigator(
        {
            SignedIn: {
                screen: SignedIn
            },
            SignedOut: {
                screen: SignedOut
            }
        },
        {
            initialRouteName: signedIn ? "SignedIn" : "SignedOut"
        }
    );
};

// export default createSwitchNavigator(
//   {
//       SignedIn: {
//           screen: SignedIn
//       },
//       SignedOut: {
//           screen: SignedOut
//       }
//   },
//   {
//       initialRouteName: true ? "SignedIn" : "SignedOut"
//   }
// );
