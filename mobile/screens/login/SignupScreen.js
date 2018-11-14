import React from 'react';
import {
    ListView,
    StyleSheet,
    View,
    Text,
    StatusBar
} from 'react-native';
import {Icon} from 'native-base';
import Logo from "./Logo";
import Form from "./Form";

export default class SignupScreen extends React.Component {
    //Modifies the top header
    static navigationOptions = ({navigation}) => ({
        title: 'Signup',
        headerStyle: {
            backgroundColor: '#007dba'
        },
        headerTintColor: 'white',
        headerLeft: <Icon name="menu" size={35} color='white' style={{marginLeft: 30, color: 'white'}}
                          onPress={() => navigation.toggleDrawer()}/>,
    });

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <View style={(styles.container)}>
                <Logo/>
                <Form type="Signup"/>
                <View style={(styles.signUpTextContainer)}>
                    <Text style={styles.signUpText}>Already have an account? </Text>
                    <Text style ={styles.signupButton}>Login</Text>
                </View>
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
    signUpTextContainer: {
        flexGrow: 1,
        alignItems:  'flex-end',
        justifyContent: 'center',
        paddingVertical: 15,
        flexDirection: 'row'
    },
    signUpText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 18,

    },
    signupButton: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500'
    }


});






