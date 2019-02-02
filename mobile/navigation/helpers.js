import React from 'react';
import {Button, Icon} from 'react-native-elements'
import store from '../redux/reduxConfig'

import {onSignOut} from '../components/auth';

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
});
