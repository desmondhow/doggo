import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
} from 'react-native';
import {Table, TableWrapper, Row, Cell, Col} from 'react-native-table-component';
import {center, inputStyle} from '../../../constants/Styles';
import {Text, Button} from 'react-native-elements';
import {withMappedNavigationProps} from 'react-navigation-props-mapper';
import Constants from "../../../constants/Api";

const currentSessionsTableHeaderText = [
    'Setup By',
    // 'Location',
    'Dogs Trained'
];


@withMappedNavigationProps()
export default class UDCHomeScreen extends React.Component {
    interval;

    constructor(props) {
        super(props);
        this.state = {
            currentSessionsData: [],
            currSessionIDS: []
        };
        this._fetchCurrentUDCSessions = this._fetchCurrentUDCSessions.bind(this);
    }

    componentDidMount() {
        this._fetchCurrentUDCSessions();
        //Refresh every 5 seconds
        this.interval = setInterval(() => this._fetchCurrentUDCSessions(), 5 * 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    async _fetchCurrentUDCSessions() {
        fetch(Constants.getCurrentUDCSessions)
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    if (res.list.length === 0) {
                        // alert('There are no active UDC Sessions')
                    } else {
                        this.setState({
                            currentSessionsData: [],
                            currSessionIDS: []
                        });

                        for (let i = 0; i < res.list.length; i++) {
                            this.setState(prevState => ({
                                currentSessionsData: [...prevState.currentSessionsData, [res.list[i].creator_name, res.list[i].dogs,]],
                                currSessionIDS: [...prevState.currSessionIDS, res.list[i]._id]

                            }));
                        }


                    }
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    };


    _continueTrainingSession(i) {
        console.log('val_i', i);
        console.log(this.state.currSessionIDS);
        fetch(Constants.getUDCSession + '/' + this.state.currSessionIDS[i])
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    if (res.data.length === 0) {
                        alert('Could not load UDC Session')
                    } else {
                        alert(JSON.stringify(res.data));
                        const { navigate } = this.props.navigation;
                        //Todo: change name of screen
                        // navigate('UDCTrainingScreen', { data: res.data });
                    }
                }
                else {
                    alert(res.message);
                }
            })
            .done();

    }

    render() {
        const state = this.state;
        const {navigate} = this.props.navigation;

        const continueTrainingButton = (i) => (
            <Button
                title='Continue'
                buttonStyle={styles.continueTrainingButton}
                onPress={() => this._continueTrainingSession(i)}
                fontSize={17}
                fontFamily={'montserrat'}
            />
        );

        const rows = [];
        const continueButtons = [];

        state.currentSessionsData.map((session, i) => {
            rows.push(
                <TableWrapper
                    style={[
                        styles.tableRowOdd,
                        i % 2 && styles.tableRowEven,
                        i === state.currentSessionsData.length - 1 && styles.roundedBottomBorder
                    ]}
                    key={i}
                >
                    {session.map((cellData, j) => (
                        <Cell
                            key={i + j}
                            data={cellData}
                            style={styles.cell}
                            textStyle={{
                                fontSize: 18, marginLeft: 6, fontFamily: 'montserrat'
                            }}
                        />
                    ))}
                </TableWrapper>
            );

            continueButtons.push(continueTrainingButton(i));
        });

        _handleGeneralSubmit = () => {
            Alert.alert('hey');
        };

        return (
            <View style={styles.container}>
                <View style={styles.currentSessionsContainer}>
                    <View style={styles.currentSessionsHeader}>
                        <Text h4 style={{
                            fontWeight: 'bold',
                            fontSize: 36,
                            marginTop: 20,
                            fontFamily: 'montserrat'
                        }}> Current UDC Sessions </Text>
                    </View>

                    <Table style={styles.table} borderStyle={{borderColor: 'transparent'}}>
                        <TableWrapper style={{flex: 1}}>
                            <Row
                                key={0}
                                data={currentSessionsTableHeaderText}
                                style={styles.tableHeader}
                                textStyle={{
                                    fontSize: 24, fontWeight: 'bold', marginLeft: 6, fontFamily: 'montserrat'
                                }}
                            />
                            {rows}
                        </TableWrapper>
                        <TableWrapper>
                            <Cell data='' style={styles.emptyTableHeader}/>
                            <Col

                                data={continueButtons}
                                heightArr={new Array(continueButtons.length).fill(row.height, 0)}
                            />
                        </TableWrapper>
                    </Table>
                </View>
                <View style={styles.bottom}>
                    <Button
                        large
                        title="Start New Session"
                        rightIcon={{name: 'create', type: 'montserrat'}}
                        onPress={() => navigate('UDCNewSession', {onSubmit: this._handleGeneralSubmit})}
                        buttonStyle={styles.newSessionButton}
                        fontSize={22}
                        fontFamily={'montserrat'}
                    />
                </View>
            </View>
        );
    }
}

const row = {
    height: 50,
    flexDirection: 'row',
};

const header = {
    height: row.height + 10
};

const button = {
    ...center,
    ...inputStyle
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(225,226,225)',
        alignItems: 'center',
    },
    roundedBottomBorder: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    emptyTableHeader: {
        ...header,
        backgroundColor: 'transparent'
    },
    currentSessionsContainer: {
        flexDirection: 'column',
        marginTop: 50,
        marginLeft: 30
    },
    currentSessionsHeader: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    tableHeader: {
        ...header,
        backgroundColor: '#007dba',
        borderBottomColor: 'black',
        borderBottomWidth: 3,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,

    },
    table: {
        width: 700,
        marginLeft: 10,
        marginTop: 40,
        flexDirection: 'row'
    },
    cell: {
        flex: 1,
        borderColor: 'transparent',
        margin: 6,
    },
    tableRowOdd: {
        ...row,
        backgroundColor: '#00aced',
    },
    tableRowEven: {
        ...row,
        backgroundColor: '#65deff',
    },
    continueTrainingButton: {
        ...button,
        height: row.height - 10,
        width: 120,
        margin: 10,
        backgroundColor: 'black',
    },
    newSessionButton: {
        ...button,
        marginTop: 10,
        width: 250,
        height: 70,
        backgroundColor: 'black',
        position: 'absolute',
        bottom: 0


    },
    bottom: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 36,
        marginRight: 250,
        flexDirection: 'row',

    }
});
