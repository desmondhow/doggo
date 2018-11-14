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
export default class Form extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder= 'Email'
                           placeHolderTextColor= 'white'
                />
                <TextInput style={styles.inputBox}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder= 'Password'
                           placeHolderTextColor= 'white'
                />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
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
        marginVertical: 10

    },
    button: {
        backgroundColor: '#212121',
        borderRadius: 25,
        width: 300,
        marginVertical: 10,
        paddingVertical: 12

    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center'

    }

});






