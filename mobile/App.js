import React from 'react';
import {Platform, StatusBar, StyleSheet, View, Image, Text} from 'react-native';
import {AppLoading, Asset, Font, Icon} from 'expo';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

import {createRootNavigator} from './navigation/AppNavigator';
import {isSignedIn} from "./auth";
import reducer from './reducers/'

const store = createStore(reducer);

export default class App extends React.Component {
    state = {
        isReady: false,
        signedIn: false,
        checkedSignIn: false
    };


    /**
     * Checks if user is signed in before accesing profile
     */
    async componentDidMount() {
        await isSignedIn()
            .then(res => {
                this.setState({signedIn: res, checkedSignIn: true})
            })
            .catch((err) => alert("An error occurred:\n" + err));
    }

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={this._cacheResourcesAsync}
                    onFinish={() => this.setState({ isReady: true })}
                    onError={console.warn}
                />
            );
        }

        // Check if user is signed in
        const {checkedSignIn} = this.state;
        if (!checkedSignIn) {
            return null;
        }
        const {signedIn} = this.state;
        let RootNav = createRootNavigator(signedIn);

        return (
            <Provider store={store}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                    <RootNav/>;
                </View>
            </Provider>
        );
    }



    async _cacheResourcesAsync() {
        const images = [
            require('./assets/images/splash.png'),
            require('./assets/images/icon.png'),
            require('./assets/images/doggo.png'),
        ];

        const cacheImages = images.map((image) => {
            return Asset.fromModule(image).downloadAsync();
        });

        await Font.loadAsync({
            // This is the font that we are using for our tab bar
            ...Icon.Ionicons.font,
            // Fonts we are using in our app
            'montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
        });

        return Promise.all(cacheImages)
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
