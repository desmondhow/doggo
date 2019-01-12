import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Table,
  TableWrapper,
  Row,
  Cell,
  Col
} from "react-native-table-component";
import {
  center,
  buttonStyle,
  buttonTextStyle,
  outlineButtonStyle,
  outlineButtonTextStyle
} from "../../../constants/Styles";
import { Text, Button } from "react-native-elements";
import { withMappedNavigationProps } from "react-navigation-props-mapper";
import Constants from "../../../constants/Api";
import { Sessions } from "../../../constants/SessionsConstants";

const currentSessionsTableHeaderText = ["Created At", "# Hides", "Dogs", '', ''];

@withMappedNavigationProps()
export default class UDCHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currSessionsData: [],
      currSessionIds: [],
      alertedCantFetch: false
    };
    this._fetchCurrentUDCSessions = this._fetchCurrentUDCSessions.bind(this);
  }

  componentDidMount() {
    //Refresh every 5 seconds
    this._fetchCurrentUDCSessions();
    this.interval = setInterval(
      () => this._fetchCurrentUDCSessions(),
      500 * 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async _fetchCurrentUDCSessions() {
    Constants.getCurrentUDCSessions
    .then(url => 
      fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          if (res.list.length === 0) {
            alert("There are no active UDC Sessions");
          } else {
            this.setState({
              currSessionsData: [],
              currSessionIds: []
            });

            for (let i = 0; i < res.list.length; i++) {
              this.setState(prevState => ({
                currSessionsData: [
                  ...prevState.currSessionsData,
                  res.list[i]
                ],
                currSessionIds: [...prevState.currSessionIds, res.list[i].id]
              }));
            }
          }
        } else {
          alert(res.message)
          console.log(res.message);
        }
      })
      .catch(err => {
        console.log(err);
        if (!this.state.alertedCantFetch) {
          alert("Unable to fetch current UDC sessions.");
          this.setState({ alertedCantFetch: true });
        }
      })
      .done()  
    )
  }

  _continueTrainingSession(i) {
    fetch(Constants.getUDCSession + "/" + this.state.currSessionIds[i])
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          if (res.data.length === 0) {
            alert("Could not load UDC Session");
          } else {
            alert(JSON.stringify(res.data));
            // TODO: change name of screen
            // navigate('UDCTrainingScreen', { data: res.data });
          }
        } else {
          alert(res.message);
        }
      })
      .done();
  }

  _editTrainingSession(i) {
    const { navigate } = this.props.navigation;
    const sessionData = this.state.currSessionsData[i];

    console.log(`sessionData: ${sessionData}`)

    navigate('UDC.NewSession', { isEditing: true, sessionInfo: sessionData })
  }

  _renderTableButtons = (continueButtons) => (
    <TableWrapper style={styles.table}>
      <Cell data="" style={styles.emptyTableHeader} />
      <Col
        data={continueButtons}
        heightArr={new Array(continueButtons.length).fill(
          row.height,
          0
        )}
      />
    </TableWrapper>
  )

  _renderSessionButtons = i => (
    [
      <Button
        transparent 
        title="Train"
        textStyle={{ ...outlineButtonTextStyle, fontSize: 20 }}
        buttonStyle={{...styles.continueTrainingButton, marginRight: -35}}
        onPress={() => this._continueTrainingSession(i)}
        fontSize={17}
      />,
      <Button
        transparent
        title="Edit"
        textStyle={{ ...outlineButtonTextStyle, fontSize: 20 }}
        buttonStyle={styles.continueTrainingButton}
        onPress={() => this._editTrainingSession(i)}
        fontSize={15}
      />
    ]
  );

  render() {
    const state = this.state;
    const { navigate } = this.props.navigation;

    const rows = [];
    state.currSessionsData.map((session, i) => {
      let creationDate = new Date(Date.parse(session.createdAt));
      let todaysDate = new Date();

      let createdToday = true;
      let copyCreationDate = creationDate.toString();
      if (
        creationDate.setHours(0, 0, 0, 0) !=
        todaysDate.setHours(0, 0, 0, 0)
      ) {
        createdToday = false;
      }

      // show date if not created today
      let createdAt = `${new Date(Date.parse(copyCreationDate)).toLocaleTimeString("en-US")}${createdToday
          ? ""
          : ` (${creationDate.getMonth() + 1}/${creationDate.getDate() +
              1})`
      }`;

      const numHides = session.hides.length
      const dogs = 'FILL IN W DATA'
      const rowData = [createdAt, numHides, dogs, ...this._renderSessionButtons(i)]

      rows.push(
        <View style={{flexDirection: 'row', marginLeft: 20}}>
          {rowData.map((cellData, j) => {
            width = j < 3 ? 150 : 100;
            marginLeft = j == 4 ? -20 : 0;
            return (
              <Cell
                key={i + j}
                data={j == 1 ? `\t${cellData}` : cellData}
                style={[{
                  borderColor: 'transparent',
                  width: width,
                  height: 50,
                  marginLeft: marginLeft
                }, i % 2 == 0 ? null : styles.oddRow]}
                textStyle={{
                  fontSize: 18,
                  fontFamily: "montserrat"
                }}
              />    
            )      
          })}
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.currentSessionsContainer}>
          <View style={styles.currentSessionsHeader}>
            <Text
              h4
              style={{
                fontWeight: "bold",
                fontSize: 36,
                marginTop: 20,
                fontFamily: "montserrat"
              }}
            >
              Current UDC Sessions
            </Text>
          </View>
          <ScrollView>
            <Table
              style={styles.tableContainer}
              borderStyle={{ borderColor: "transparent" }}
            >
              <View style={{flexDirection: 'row', marginTop: 20}}>
                {currentSessionsTableHeaderText.map((cellData, j) => {
                  width = j < 3 ? 150 : 100;
                  return (
                    <Cell
                      key={j}
                      data={cellData}
                      style={{
                        borderColor: 'transparent',
                        width: width,
                        borderBottomColor: "black",
                        borderBottomWidth: 3,
                      }}
                      textStyle={{
                        fontSize: 24,
                        fontWeight: "bold",
                        paddingBottom: 20,
                        paddingLeft: 10,
                        fontFamily: "montserrat"
                      }}
                    />       
                  )   
                })}
              </View>
              <TableWrapper>
                {rows}
              </TableWrapper>
            </Table>
          </ScrollView>

        </View>
        <View style={styles.bottom}>
          <Button
            large
            raised
            title="Start New Session"
            rightIcon={{ name: "create", type: "montserrat" }}
            onPress={() =>
              navigate("UDC.NewSession", { onSubmit: this._handleGeneralSubmit })
            }
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
  flexDirection: "row"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(225,226,225)",
    alignItems: "center"
  },
  roundedBottomBorder: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  emptyTableHeader: {
    height: 60,
    backgroundColor: "transparent"
  },
  tableHeader: {
    height: 60,
    width: 700,
    borderBottomColor: "black",
    borderBottomWidth: 3
  },
  currentSessionsContainer: {
    ...center,
    flexDirection: "column",
    marginTop: 50,
    width: '90%'
  },
  currentSessionsHeader: {
    flexDirection: "row",
    justifyContent: "center"
  },
  table: {
    marginLeft: 40,
    marginTop: 20
  },
  tableContainer: {
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: "white",
    height: 500,
    width: 800,
    marginLeft: -20
  },
  oddRow: {
    backgroundColor: "#e3e3e3"
  },
  continueTrainingButton: {
    height: row.height,
    width: 75,
    margin: 10
  },
  newSessionButton: {
    ...buttonStyle,
    marginTop: 10,
    width: 250,
    position: "absolute",
    bottom: 0
  },
  bottom: {
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 36,
    marginRight: 250,
    flexDirection: "row"
  }
});
