import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

/**
 * Displays the login form
 */
export default class LoginForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder= 'Email'
                           placeHolderTextColor= 'white'
                           onChangeText = { (email) => this.props.onSelectEmail(email)}
                />
                <TextInput style={styles.inputBox}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder= 'Password'
                           secureTextEntry ={true}
                           placeHolderTextColor= 'white'
                           onChangeText = { (password) => this.props.onSelectPassword(password)}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress = {() => this.props.onSelectLogin()}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 25,
        height: 50,
        fontSize: 20,
        paddingHorizontal: 16,
        marginVertical: 15

    },
    button: {
        backgroundColor: '#212121',
        borderRadius: 25,
        width: 300,
        marginVertical: 15,
        paddingVertical: 13

    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center'

    }

});






