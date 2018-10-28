import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { Text } from 'react-native-elements';
import { Table, TableWrapper, Row, Cell, Rows, Col } from 'react-native-table-component';

import Api from '../../constants/Api';
import Button from '../../components/Button';

const currentSessionsTableHeaderText = [
  'Setup By',
  'Location',
  'Dogs Trained'
]

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'UDC',
  };

  constructor(props) {
    super(props);
    this.state = { currentSessionsData: []};
    this._fetchCurrentUDCSessions = this._fetchCurrentUDCSessions.bind(this);
  }

  componentDidMount() {
    this._fetchCurrentUDCSessions();
  }

  _fetchCurrentUDCSessions() {
    // fetch(Api.getCurrentUDCSessions)
    // .then((res) => {
      this.setState({ currentSessionsData: [['Jamie', 'Outside', 'Moxy, Roxy'], ['Desmond', 'Bulding', 'Nola']] });
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
  }

  _continueTrainingSession() {
    Alert.alert('hey');
  }

  render() {
    const state = this.state;

    const continueTrainingButton = (session) => (
      <Button
        text='Continue'
        buttonStyle={styles.continueTrainingButton}
        textStyle={styles.continueTrainingButtonText}
        onPress={() => this._continueTrainingSession()}
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
            i == state.currentSessionsData.length-1 && styles.roundedBottomBorder
          ]}>
          {session.map((cellData, j) => (
            <Cell
              key={i+j}
              data={cellData}
              style={styles.cell}
            />
          ))}
        </TableWrapper>
      );

      continueButtons.push(continueTrainingButton(session));
    });

    return (
      <View style={styles.container}>
        <View style={styles.currentSessionsContainer}>
          <Text h2> Current Sessions </Text>
          <Table style={styles.table} borderStyle={{ borderColor: 'transparent' }}>
            <TableWrapper style={{ flex: 1 }}>  
                <Row
                  key={0}
                  data={currentSessionsTableHeaderText}
                  style={styles.tableHeader}
                  textStyle={{ fontWeight: 'bold', marginLeft: 6 }}
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
      </View>
    );
  }
}

const row = {
  height: 50,
  flexDirection: 'row',
}

const header = {
  height: row.height+10
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  tableHeader: { 
    ...header,
    backgroundColor: '#7791c4',
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  table: {
    width: 700,
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row'
  },
  cell: {
    flex: 1,
    borderColor: 'transparent',
    margin: 6
  },
  tableRowOdd: { 
    ...row,
    backgroundColor: '#d3ebff',
  },
  tableRowEven: { 
    ...row,
    backgroundColor: '#f4faff',
  },
  continueTrainingButton: {
    height: row.height-10, 
    width: 100,
    margin: 10,
    backgroundColor: '#e6eaf2',
    borderColor: "transparent",
    borderRadius: 5,
  },
  continueTrainingButtonText: {
    fontSize: 15
  }
});
