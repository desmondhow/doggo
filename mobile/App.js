import React from 'react';
import {NetInfo, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {AppLoading, Asset, Font, Icon} from 'expo';
import {createRootNavigator} from './navigation/AppNavigator';
import {isSignedIn} from "./components/auth";
import {createAppContainer} from 'react-navigation';

import store from './redux/reduxConfig'
import {Provider} from 'react-redux';
import {connectionState, dispatchActionQueueElt, pingServer} from "./redux/actions/connection.actions";
import Constants from "./constants/Api";
import {getProfileData} from "./redux/actions/general.actions";


export default class App extends React.Component {
    state = {
        isReady: false,
        signedIn: true,
        checkedSignIn: true
    };

    async componentDidMount() {
        //Check if user is already signed in
        await isSignedIn()
            .then(res => {
                if (res !== false) {
                    this.setState({signedIn: true, checkedSignIn: true})
                } else {
                    this.setState({signedIn: true, checkedSignIn: true});
                }
            })
            .catch((err) => {
                this.setState({signedIn: false, checkedSignIn: true});
                alert("An error occurred:\n" + err);
            });

        //Ping Our Server and check if the server is  working
        store.dispatch(pingServer({url: Constants.ping}));
        //Continue Pinging server every 10 sec
        setInterval(this.pingServerFunction,
            10 * 1000
        );
        //Get all trainers and dogs data
        store.dispatch(getProfileData());

        //Handle wifi/internet connectivity of the device
        this.subscription();
        this.isConnectedFetchInterval();
    }



    /**
     * Pings our server to make sure its working.
     */
    pingServerFunction() {
        store.dispatch(pingServer({url: Constants.ping}));
        const {isConnected, actionQueue, isServerOnline} = store.getState().connection;
        // Once the app connects, dispatch all requests
        if (isConnected && isServerOnline && actionQueue.length > 0) {
            store.dispatch(dispatchActionQueueElt({elts: actionQueue}));
        }
        store.dispatch(getProfileData());

    }

    isConnectedFetchInterval = () =>
        setInterval(async () => {
            await NetInfo.isConnected.fetch()
        }, 1000);

    subscription = () =>
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleConnectionChange
        );

    /**
     * If our server is working and the device has internet connection, this function dispatches every action in the
     * offline actions queue
     */
    handleConnectionChange = isConnected => {
        if (!isConnected) {
            //Todo: Change to GUI symbol
            alert('No internet connection. Everything will be stored locally.')
        }
        const {actionQueue, isServerOnline} = store.getState().connection;
        //Update connection state
        store.dispatch(connectionState({status: isConnected}));
        // Once the app connects, dispatch all requests
        if (isConnected && isServerOnline && actionQueue.length > 0) {
            store.dispatch(dispatchActionQueueElt({elts: actionQueue}));
        }
    };

    componentWillUnmount() {
        if (this.subscription && typeof this.subscription.remove === 'function') {
            this.subscription.remove()
            clearInterval(this.isConnectedFetchInterval)
        }
    }


    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={this._cacheResourcesAsync}
                    onFinish={() => this.setState({isReady: !this.state.isReady})}
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
        const App = createAppContainer(RootNav);


        return (

            <Provider store={store}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                    <App/>
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
