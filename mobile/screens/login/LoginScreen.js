import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements';

import Logo from "./Logo";
import LoginForm from "./LoginForm";
import Constants from "../../constants/Api";
import {onSignIn} from "../../components/auth";
  

export default class LoginScreen extends React.Component {
    //Modifies the top header
    static navigationOptions = ({
        title: 'Login',
        headerStyle: {
            backgroundColor: '#007dba',

        },
        fontFamily: 'montserrat',
        fontWeight: 100,
        headerTintColor: 'white',
    });


    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        };
    }


    /**
     * Sets the value for the email
     * @param email
     */
    handleEmail = (email) => {
        this.setState({
            email: email,
        })
    };

    /**
     * Sets the value for the password
     * @param password
     */
    handlePassword = (password) => {
        this.setState({
            password: password,
        })
    };

    /**
     * Send login credentials to the server (POST req)
     */
    handleLogin = () => {
        if (this.state.password.length === 0) return alert('Please type your password');
        if (this.state.email.length === 0) return alert('Please type your email');
        fetch(Constants.getLoginApiURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email': this.state.email,
                'password': this.state.password
            })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === 200) {
                    const message = res.message;
                    onSignIn(message).then(() => this.props.navigation.navigate('SignedIn'));
                }
                else {
                    alert(res.message);
                }
            })
            .catch(err => alert('There was an issue connecting to the server. Please try again.'))
            .done();
    };

    render() {
        return (
            <View style={(styles.container)}>
                <Logo/>
                <LoginForm navigation={this.props.navigation}
                           onSelectEmail={this.handleEmail}
                           onSelectPassword={this.handlePassword}
                           onSelectLogin={this.handleLogin}
                />
                <View style={(styles.signUpTextContainer)}>
                    <Text style={styles.signUpText}>Don't have an account yet? </Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("SignUp")}>
                        <Text style={styles.signupButton}>Sign Up</Text>
                    </TouchableOpacity>
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
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 15,
        flexDirection: 'row',
    },
    signUpText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 20,
        fontFamily: 'montserrat'

    },
    signupButton: {
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
        fontFamily: 'montserrat'
    }


});






