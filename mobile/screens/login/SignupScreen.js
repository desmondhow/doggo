import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Logo from "./Logo";
import SignUpForm from "./SignUpForm";
import {onSignIn} from "../../auth";

export default class SignupScreen extends React.Component {
    //Modifies the top header
    static navigationOptions = ({
        title: 'Sign Up',
        headerStyle: {
            backgroundColor: '#007dba'
        },
        headerTintColor: 'white',
    });

    render() {
        return (
            <View style={(styles.container)}>
                <Logo/>
                <SignUpForm navigation={this.props.navigation}/>
                <View style={(styles.signUpTextContainer)}>
                    <Text style={styles.signUpText}>Already have an account? </Text>
                    <TouchableOpacity
                    onPress={() =>  this.props.navigation.navigate("SignedIn")}>
                        <Text style ={styles.signupButton}>Login</Text>
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






