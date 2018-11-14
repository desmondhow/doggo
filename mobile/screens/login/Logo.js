import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text
} from 'react-native';

/**
 * Displays the logo for the login/register screen
 */
export default class Logo extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{width: 300, height: 80}}
                    source={require('../../assets/images/icon.png')}
                />
                <Text style = {styles.logoText}>Welcome!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    logoText : {
        marginVertical: 15,
        fontSize: 24,
        color: 'white'
    }

});






