import React from 'react';
import {
    ListView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    AsyncStorage,
    KeyboardAvoidingView
} from 'react-native';
import {Icon} from 'native-base';
import Logo from "./Logo";
import Form from "./Form";

export default class LoginScreen extends React.Component {
    static SERVER_URL = 'http://localhost:3000';
    static LOGIN_API_URL = LoginScreen.SERVER_URL + '/api/users/login';
    //Modifies the top header
    static navigationOptions = ({navigation}) => ({
        title: 'Login',
        headerStyle: {
            backgroundColor: '#007dba'
        },
        headerTintColor: 'white',
        headerLeft: <Icon name="menu" size={35} color='white' style={{marginLeft: 30, color: 'white'}}
                          onPress={() => navigation.toggleDrawer()}/>,
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
        fetch(LoginScreen.LOGIN_API_URL, {
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
                    AsyncStorage.setItem('email', res.email);
                    this.props.navigation.navigate('Profile');
                }
                else {
                    alert(res.message);
                }
            })
                .done();
    };


    /**
     * Checks if user has already logged in
     */
    componentDidMount() {
        this._loadInitialState().done();
    };

    _loadInitialState = async () => {
        let value = await AsyncStorage.getItem('email');
        if (value !== null) {
            this.props.navigation.navigate('Profile');
        }
    };

    render() {
        return (
            <View style={(styles.container)}>
                <Logo/>
                <Form type="Login"
                      onSelectEmail={this.handleEmail}
                      onSelectPassword={this.handlePassword}
                      onSelectLogin={this.handleLogin}
                />
                <View style={(styles.signUpTextContainer)}>
                    <Text style={styles.signUpText}>Don't have an account yet? </Text>
                    <Text style={styles.signupButton}>Signup</Text>
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






