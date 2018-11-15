import React from 'react';
import {Platform, StatusBar, StyleSheet, View, Image} from 'react-native';
import {AppLoading, Asset, Font, Icon} from 'expo';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

import {createRootNavigator} from './navigation/AppNavigator';
import {isSignedIn} from "./auth";
import reducer from './reducers/'

const store = createStore(reducer);

export default class App extends React.Component {
    state = {
        isSplashReady: false,
        isAppReady: false,
        signedIn: false,
        checkedSignIn: false
    };


    /**
     * Checks if user is signed in before accesing profile
     */
    componentDidMount() {
        isSignedIn()
            .then(res => this.setState({signedIn: res, checkedSignIn: true}))
            .catch((err) => alert("An error occurred:\n" + err));
    }

    render() {
        // Check if user is signed in
        const {checkedSignIn} = this.state;
        if (!checkedSignIn) {
            return null;
        }
        const {signedIn} = this.state;
        let RootNav = createRootNavigator(signedIn);
        // if (!this.state.isSplashReady) {
        //     return (
        //         <AppLoading
        //             //Load Splash Screen x
        //             startAsync={this._cacheSplashResourcesAsync}
        //             onFinish={() => this.setState({isSplashReady: true})}
        //             onError={console.warn}
        //             autoHideSplash={false}
        //         />
        //     );
        // }
        // if (!this.state.isAppReady) {
        //     return (
        //         <View style={{flex: 1}}>
        //             <Image
        //                 source={require('./assets/images/splash.png')}
        //                 onLoad={this._cacheResourcesAsync}
        //             />
        //         </View>
        //     );
        // }
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                    <RootNav/>;
                </View>
            </Provider>
        );
    }


}

// Load the graphics for the splash screen
_cacheSplashResourcesAsync = async () => {
    const png = require('./assets/images/splash.png');
    return Asset.fromModule(png).downloadAsync()
};


// Load the resources that we need for our app
_cacheResourcesAsync = async () => {
    Expo.SplashScreen.hide();
    await Promise.all([
        Asset.loadAsync([
            require('./assets/images/robot-dev.png'),
            require('./assets/images/robot-prod.png'),
            require('./assets/images/icon.png'),

        ]),
        Font.loadAsync({
            // This is the font that we are using for our tab bar
            ...Icon.Ionicons.font,
            // Fonts we are using in our app
            // Todo: Remove Space mongo from all screens and the delete it here.
            'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
            'montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),

        }),
    ]);
    this.setState({isAppReady: true});
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
