import React from 'react';
import {Button, Icon} from 'react-native-elements'
import store from '../redux/reduxConfig'


import {onSignOut} from '../components/auth';
import {View, StyleSheet, Text} from "react-native";
import {isOnline} from "../redux/actions/connection.actions";


export const mainNavHeader = navigation => ({
    headerLeft:
        <Icon
            type='font-awesome'
            name="paw"
            size={35}
            containerStyle={{marginLeft: 20}}
            onPress={() => navigation.toggleDrawer()}
        />
    ,
    headerRight:
    <View style={ styles.container}>
        {!isOnline(store.getState) && <Text style={styles.textNoConnection}>{'Offline'}</Text>}
        <Button
            transparent
            title='Logout'
            color='black'
            onPress={() => {
                onSignOut().then(() => {
                    store.dispatch({type: 'RESET_STATE'});
                    navigation.navigate('SignedOut');
                });

            }}
        />
    </View>


});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        backgroundColor: 'green',
        width: '40%',
        height: 40
    },
    text: {
        fontSize: 18,
        marginTop: 12,
        marginRight: 10,
        color: 'blue'
    },
    textNoConnection: {
        fontSize: 18,
        marginTop: 12,
        marginRight: 10,
        color: 'red'
    }
});
