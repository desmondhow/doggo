import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, Button,
} from 'react-native';
import {onSignOut} from "../../auth";
import {Card} from "react-native-elements";


/**
 * Displays the Sign up form
 */
export default class ProfileScreen extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{paddingVertical: 20}}>
                    <Card title="John Doe">
                        <View
                            style={{
                                backgroundColor: "#bcbec1",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                alignSelf: "center",
                                marginBottom: 20
                            }}
                        >
                            <Text style={{color: "white", fontSize: 28}}>JD</Text>
                        </View>
                        <Button
                            title="SIGN OUT"
                            onPress={() => onSignOut().then(() => this.props.navigation.navigate("SignedOut"))} // NEW
                        />
                    </Card>
                </View>
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


