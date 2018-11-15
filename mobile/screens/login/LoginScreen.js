import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    AsyncStorage, TouchableOpacity
} from 'react-native';
import {Icon} from 'native-base';
import Logo from "./Logo";
import LoginForm from "./LoginForm";
import Constants from "../../constants/Api";
import {onSignIn} from "../../auth";

export default class LoginScreen extends React.Component {
    //Modifies the top header
    static navigationOptions = ({
        title: 'Login',
        headerStyle: {
            backgroundColor: '#007dba'
        },
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
                if (res.success) {
                    onSignIn().then(() => navigation.navigate('SignedIn'));
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    };




/**
    //  * Checks if user has already logged in
    //  */
    // componentDidMount() {
    //     this._loadInitialState().done();
    // };
    //
    // _loadInitialState = async () => {
    //     let value = await AsyncStorage.getItem('email');
    //     if (value !== null) {
    //         this.props.navigation.navigate('ProfileScreen.js');
    //     }
    // };

    render() {
        return (
            <View style={(styles.container)}>
                <Logo/>
                <LoginForm onSelectEmail={this.handleEmail}
                           onSelectPassword={this.handlePassword}
                           onSelectLogin={this.handleLogin}
                />
                <View style={(styles.signUpTextContainer)}>
                    <Text style={styles.signUpText}>Don't have an account yet? </Text>
                    <TouchableOpacity
                        onPress={() =>  this.props.navigation.navigate("SignUp")}>
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






