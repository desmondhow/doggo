
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Logo from "./Logo";
import SignUpForm from "./SignUpForm";
import Constants from "../../constants/Api";
import {onSignIn} from "../../components/auth";
import {request} from "../../components/helpers";

export default class SignupScreen extends React.Component {
    //Modifies the top header
    static navigationOptions = ({
        title: 'Sign Up',
        headerStyle: {
            backgroundColor: '#007dba'
        },
        fontFamily: 'montserrat',
        fontWeight: 100,
        headerTintColor: 'white',
    });

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            password_conf: ''
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
     * Sets the value for the password conf
     * @param password
     */
    handlePasswordConfirmation = (password) => {
        this.setState({
            password_conf: password,
        })
    };


    /**
     * Send Register credentials to the server (POST req)
     */
    handleRegister = () => {
        request(
          Constants.registerURL,
          JSON.stringify({
            'email': this.state.email,
            'password': this.state.password,
            'password_conf': this.state.password_conf,
          })
        )
        .then((res) => res.json())
        .then((res) => {
            if (res.status === 200) {
              onSignIn(res.message).then(() => this.props.navigation.navigate('SignedIn'));
            }
            else {
                alert(res.message);
            }
        })
            .catch(err => alert('There was an issue connecting to the server. Please try again.'))
    };

    render() {
        return (
            <View style={(styles.container)}>
                <Logo/>
                <SignUpForm navigation={this.props.navigation}
                            onSelectEmail={this.handleEmail}
                            onSelectPassword={this.handlePassword}
                            onSelectPasswordConfirmation={this.handlePasswordConfirmation}
                            onSelectRegister={this.handleRegister}
                />
                <View style={(styles.signUpTextContainer)}>
                    <Text style={styles.signUpText}>Already have an account? </Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("SignIn")}>
                        <Text style={styles.signupButton}>Login</Text>
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
