import React from 'react';
import {
    ListView,
    StyleSheet,
    View,
    Text,
    StatusBar
} from 'react-native';
import { Icon } from 'native-base';
import Logo from "./Logo";
import Form from "./Form";

export default class LoginScreen extends React.Component {
    //Modifies the top header
    static navigationOptions  = ({navigation}) => ({
        title: 'Register / Login',
        headerStyle: {
            backgroundColor: '#007dba'
        },
        headerTintColor: 'white',
        headerLeft: <Icon name="menu" size={35}  color='white' style={{marginLeft: 30, color: 'white'}} onPress={ () => navigation.toggleDrawer() } />,
    });

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <View style={(styles.container)}>
                <Logo/>
                <Form/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#00aced',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});






