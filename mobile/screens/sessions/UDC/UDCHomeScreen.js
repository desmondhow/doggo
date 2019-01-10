import React from 'react';
import {
    StyleSheet,
    View,
    Alert,
} from 'react-native';
import {Table, TableWrapper, Row, Cell, Col} from 'react-native-table-component';
import {center, buttonStyle, buttonTextStyle, outlineButtonStyle, outlineButtonTextStyle} from '../../../constants/Styles';
import { Text, Button } from 'react-native-elements';
import {withMappedNavigationProps} from 'react-navigation-props-mapper';
import Constants from "../../../constants/Api";

const currentSessionsTableHeaderText = [
    'Created At',
    '\t# Hides',
    "\tDogs"
];


@withMappedNavigationProps()
export default class UDCHomeScreen extends React.Component {
    interval;

    constructor(props) {
        super(props);
        this.state = {
            currSessionsData: [],
            currSessionIds: [],
            alertedCantFetch: false
        };
        this._fetchCurrentUDCSessions = this._fetchCurrentUDCSessions.bind(this);
        this._fetchCurrentUDCSessions();
    }

    componentDidMount() {
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
                      alert('There are no active UDC Sessions')
                  } else {
                      this.setState({
                          currSessionsData: [],
                          currSessionIds: []
                      });

                      for (let i = 0; i < res.list.length; i++) {
                        let creationDate = new Date(Date.parse(res.list[i].createdAt));
                        let todaysDate = new Date();

                        let createdToday = true
                        let copyCreationDate = creationDate.toString()
                        if (creationDate.setHours(0,0,0,0) != todaysDate.setHours(0,0,0,0)) {
                          createdToday = false
                        }

                        let createdAt = `${
                          new Date(Date.parse(copyCreationDate)).toLocaleTimeString('en-US')}${createdToday ? '' :  ` (${creationDate.getMonth()+1}/${creationDate.getDate()+1})`
                        }`

                        this.setState(prevState => ({
                            currSessionsData: [...prevState.currSessionsData, [createdAt, res.list[i].hides.length, res.list[i].dogs]],
                            currSessionIds: [...prevState.currSessionIds, res.list[i]._id]
                        }));
                      }


                  }
              }
              else {
                  alert(res.message);
              }
          })
          .catch(err => { 
            console.log(err)
            if (!this.state.alertedCantFetch) {
              alert('Unable to fetch current UDC sessions.');
              this.setState({alertedCantFetch: true })
            }
          })
          .done();
    };


    _continueTrainingSession(i) {
        fetch(Constants.getUDCSession + '/' + this.state.currSessionIds[i])
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
              textStyle={{...outlineButtonTextStyle, fontSize: 20}}
              buttonStyle={styles.continueTrainingButton}
              onPress={() => this._continueTrainingSession(i)}
              fontSize={17}
            />
        );

        const rows = [];
        const continueButtons = [];

        state.currSessionsData.map((session, i) => {
            rows.push(
                <TableWrapper
                    style={[row, i % 2 == 0 ? null : styles.oddRow]}
                    key={i}
                >
                    {session.map((cellData, j) => (
                      <Cell
                        key={i + j}
                        data={cellData}
                        style={styles.cell}
                        textStyle={{
                            fontSize: 18, marginLeft: (j*80) + 30, fontFamily: 'montserrat'
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

                    <Table style={styles.tableContainer} borderStyle={{borderColor: 'transparent'}}>
                        <TableWrapper style={{flex: 1, ...styles.table}}>
                            <Row
                                key={0}
                                data={currentSessionsTableHeaderText}
                                style={styles.tableHeader}
                                textStyle={{
                                    fontSize: 24, fontWeight: 'bold', paddingLeft: 20, fontFamily: 'montserrat'
                                }}
                            />
                            {rows}
                        </TableWrapper>
                        <TableWrapper style={styles.table}>
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
                        raised
                        title="Start New Session"
                        rightIcon={{name: 'create', type: 'montserrat'}}
                        onPress={() => navigate('UDCNewSession', {onSubmit: this._handleGeneralSubmit})}
                        buttonStyle={styles.newSessionButton}
                        textStyle={buttonTextStyle}
                        fontSize={22}
                    />
                </View>
            </View>
        );
    }
}



const row = {
  height: 50,
  flexDirection: 'row'
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
      height: 60,
        backgroundColor: 'transparent'
    },
    tableHeader: {
      height: 60,
      width: 500, 
      borderBottomColor: 'black',
      borderBottomWidth: 3,
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
    table: {
      marginLeft: 40, 
      marginTop: 20
    },
    tableContainer: {
        marginTop: 40,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 500,
        width: '90%'
    },
    cell: {
        borderColor: 'transparent',
        margin: 6,
        // width: 100
    },
    oddRow: {
      backgroundColor: 'grey'
    },
    continueTrainingButton: {
        ...outlineButtonStyle,
        height: row.height,
        width: 120,
        margin: 10,
    },
    newSessionButton: {
        ...buttonStyle,
        marginTop: 10,
        width: 250,
        height: 70,
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
