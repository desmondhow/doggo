import React from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import {Icon} from 'react-native-elements';

export default class UserProfile extends React.Component {
    //Modifies the top header
    static navigationOptions = ({navigation}) => ({
        title: 'Profile',
        headerStyle: {
            backgroundColor: '#007dba'
        },
        headerTintColor: 'white',
        headerLeft: <Icon name="menu" size={35} color='white' style={{marginLeft: 30, color: 'white'}}
                          onPress={() => navigation.toggleDrawer()}/>,
    });

    render() {
        return (
            <View style={(styles.container)}>
                <Text style={styles.text}>Profile</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(225,226,225)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'black',

    }



});






