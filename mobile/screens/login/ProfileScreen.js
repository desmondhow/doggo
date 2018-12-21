import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, Button, ActivityIndicator, ListView,
} from 'react-native';
import {getUserID, onSignOut} from "../../auth";
import {Card, Icon} from "react-native-elements";
import Constants from "../../constants/Api";

/**
 * Displays the Sign up form
 */
export default class ProfileScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Login',
        headerStyle: {
            backgroundColor: '#007dba',
        },
        headerLeft: <Icon name="menu" size={35} style={{marginLeft: 30}}
                          onPress={() => navigation.toggleDrawer()}/>,
        fontFamily: 'montserrat',
        fontWeight: 100,
        headerTintColor: 'white',
    });

    // Fetch profile data once the component loads
    componentDidMount() {
        this.loadProfile()
    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            name: '',
            last_name: '',
            role: '',
            current_sessions: '',
            isLoading: true,
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
        }
    }


    loadProfile = () => {
        getUserID().then((user_id) => {
            user_id = user_id.replace(/['"]+/g, '');
            console.log(Constants.getProfileApiURL + "/" + user_id);
            fetch(Constants.getProfileApiURL + "/" + user_id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.message === 'success') {
                        console.log(res);
                        this.setState({
                            name: res.first_name,
                            last_name: res.last_name,
                            isLoading: false,
                        });
                        console.log("State ", this.state);
                    }
                    else {
                        alert(res.message);
                    }
                })
                .done();
        });
    };

    /**
     * Send logout get req to server
     */
    handleSignOut = () => {
        fetch(Constants.getLogoutApiURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.message === 'success') {
                    onSignOut().then(() => this.props.navigation.navigate("SignedOut"));
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    };


    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={{paddingVertical: 20}}>
                    <Card
                        title={'Welcome ' + this.state.name + ' ' + this.state.last_name + '!'}
                        titleStyle={styles.title}>
                        <Text style={styles.subtitle}>My Sessions</Text>
                        {/*<ListView*/}
                            {/*// style={styles.myListView}*/}
                            {/*// dataSource={this.state.dataSource}*/}
                            {/*// renderRow={(rowData) => {*/}
                            {/*//     /!*<Text>{rowData}</Text>*!/*/}
                            {/*// }*/}
                            {/*// }*/}
                        {/*/>*/}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.handleSignOut()}>
                            <Text style={styles.buttonText}>Sign Out</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(225, 226, 225)',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#212121',
        borderRadius: 25,
        width: 300,
        marginVertical: 15,
        paddingVertical: 13

    },
    text: {
        fontSize: 20,
        fontWeight: '100',
        color: 'black',
        textAlign: 'center',
        fontFamily: 'montserrat',

    },
    subtitle: {
        fontSize: 23,
        fontWeight: '300',
        color: 'black',
        textAlign: 'center',
        fontFamily: 'montserrat',

    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: 'montserrat',

    },
    title: {
        fontSize: 25,
        fontWeight: '500',
        color: 'black',
        textAlign: 'center',
        fontFamily: 'montserrat',
    },
    card: {
        backgroundColor: "rgb(245, 246, 245)",
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 300,
        alignSelf: "center",
        marginBottom: 20
    },
    myListView: {
        height: 200,
    }


});


