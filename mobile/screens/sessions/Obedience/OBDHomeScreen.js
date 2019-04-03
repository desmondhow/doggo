import React from "react";
import { StyleSheet, View, ScrollView, Image, NetInfo } from "react-native";
import { Table, TableWrapper, Cell, Col } from "react-native-table-component";
import { Text, Button } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { withMappedNavigationProps } from "react-navigation-props-mapper";
import {
  container,
  buttonStyle,
  buttonTextStyle,
  outlineButtonTextStyle,
  oddTableRow
} from "../../../constants/Styles";
import { connect } from "react-redux";
import { getAllOBD } from "../../../redux/actions/obd.actions";
// const currentSessionsTableHeaderText = ["Created At", "# Searches", "\tDogs", '', ''];

@withMappedNavigationProps()
class OBDHomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //Get all OBDs whenever user opens this screen
    this.props.dispatch(getAllOBD());
    //Keep fetching for data every minute.
    this.interval = setInterval(() => this.getAllOBDs, 5000);
  }

  getAllOBDs() {
    this.props.dispatch(getAllOBD());
  }

  _continueTrainingSession(i) {
    const { navigate } = this.props.navigation;
    const sessionData = this.props.currSessionsData[i];
    navigate("OBDFunction", { sessionInfo: sessionData });
  }

  _editTrainingSession(i) {
    const { navigate } = this.props.navigation;
    const sessionData = this.props.currSessionsData[i];
    navigate("OBDNewSession", { isEditing: true, sessionInfo: sessionData });
  }

  _renderTableButtons = continueButtons => (
    <TableWrapper style={styles.table}>
      <Cell data="" style={styles.emptyTableHeader} />
      <Col
        data={continueButtons}
        heightArr={new Array(continueButtons.length).fill(row.height, 0)}
      />
    </TableWrapper>
  );

  _renderSessionButtons = i => [
    <Button
      transparent
      title="Train"
      textStyle={{ ...outlineButtonTextStyle, fontSize: 20 }}
      buttonStyle={{ ...styles.continueTrainingButton, marginRight: -35 }}
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
  ];

  render() {
    const { navigate } = this.props.navigation;

    const currSessionRows = [];
    this.props.currSessionsData.map((session, i) => {
      let creationDate = new Date(Date.parse(session.createdAt));
      let todaysDate = new Date();

      let createdToday = true;
      let copyCreationDate = creationDate.toString();
      if (
        creationDate.setHours(0, 0, 0, 0) != todaysDate.setHours(0, 0, 0, 0)
      ) {
        createdToday = false;
      }

      // show date if not created today
      let createdAt = `${new Date(
        Date.parse(copyCreationDate)
      ).toLocaleTimeString("en-US")}${
        createdToday
          ? ""
          : ` (${creationDate.getMonth() + 1}/${creationDate.getDate() + 1})`
      }`;

      const dogs = session.dogsTrained ? session.dogsTrained.length : 0;
      const rowData = [createdAt, dogs, ...this._renderSessionButtons(i)];

      currSessionRows.push(
        <View style={{ flexDirection: "row", marginLeft: 20 }}>
          {rowData.map((cellData, j) => {
            width = j < 3 ? 150 : 110;
            marginLeft = j == 4 ? -20 : 0;
            return (
              <Cell
                key={i + j}
                data={j == 1 ? `\t\t ${cellData}` : cellData}
                style={[
                  {
                    borderColor: "transparent",
                    width: width,
                    height: 50,
                    marginLeft: marginLeft
                  },
                  i % 2 == 0 ? null : oddTableRow
                ]}
                textStyle={{
                  fontSize: 18,
                  fontFamily: "montserrat"
                }}
              />
            );
          })}
        </View>
      );
    });

    const currentSessionsTableHeaderText = ["Created At", "\t# Dogs", '', ''];
    return (
      <View style={container}>
        <View style={styles.sessionsContainer}>
          <Text h4>Current Sessions</Text>
          <Table
            style={styles.tableContainer}
            borderStyle={{ borderColor: "transparent" }}
          >
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              {currentSessionsTableHeaderText.map((cellData, j) => {
                width = j < 3 ? 150 : 100;
                return (
                  <Cell
                    key={j} 
                    data={cellData}
                    style={{
                      borderColor: "transparent",
                      width: width,
                      borderBottomColor: "black",
                      borderBottomWidth: 3
                    }}
                    textStyle={{
                      fontSize: 24,
                      fontWeight: "bold",
                      paddingBottom: 20,
                      paddingLeft: 10,
                      fontFamily: "montserrat"
                    }}
                  />
                );
              })}
            </View>
            <ScrollView>{currSessionRows}</ScrollView>
          </Table>
        </View>
        <View style={styles.sessionsContainer}>
          <Text h4>Previous Sessions</Text>
          <Table
            style={styles.tableContainer}
            borderStyle={{ borderColor: "transparent" }}
          >
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              {currentSessionsTableHeaderText.map((cellData, j) => {
                width = j < 3 ? 150 : 100;
                return (
                  <Cell
                    key={j}
                    data={cellData}
                    style={{
                      borderColor: "transparent",
                      width: width,
                      borderBottomColor: "black",
                      borderBottomWidth: 3
                    }}
                    textStyle={{
                      fontSize: 24,
                      fontWeight: "bold",
                      paddingBottom: 20,
                      paddingLeft: 10,
                      fontFamily: "montserrat"
                    }}
                  />
                );
              })}
            </View>
            <ScrollView>{/* TODO: FILL IN W ROWS*/}</ScrollView>
          </Table>
        </View>
        <View style={styles.bottom}>
          <Button
            large
            raised
            title="Start New Session"
            rightIcon={{ name: "create", type: "montserrat" }}
            onPress={() =>
              navigate("OBDNewSession", { onSubmit: this._handleGeneralSubmit })
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

mapStateToProps = state => {
  return {
    currSessionsData: state.obd.currSessionsData,
    actionQueue: state.connection.actionQueue,
    isConnected: state.connection.isConnected,
    isServerOnline: state.connection.isServerOnline
  };
};
export default connect(mapStateToProps)(OBDHomeScreen);

const row = {
  height: 50,
  flexDirection: "row"
};

const styles = StyleSheet.create({
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
  sessionsContainer: {
    flexDirection: "column",
    marginTop: 50,
    width: "90%"
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
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "white",
    height: 300,
    width: "100%"
  },
  continueTrainingButton: {
    height: row.height,
    width: 75,
    margin: 10
  },
  newSessionButton: {
    ...buttonStyle,
    marginTop: 10,
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
