import React, { Component } from "react";
import { StyleSheet, View, ListView, ScrollView } from "react-native";
import { Text, Button, SearchBar } from "react-native-elements";
import { Field, formValueSelector, change, untouch } from "redux-form";
import {
  Table,
  TableWrapper,
  Row,
  Cell,
  Col
} from "react-native-table-component";
import DatePicker from "react-native-datepicker";

import {
  buttonStyle,
  oddTableRow,
  center,
  outlineButtonTextStyle
} from "../../constants/Styles";
import {
  connectReduxForm,
  request,
  updateProfileState
} from "../../components/helpers";

/**
 * Displays the Sign up form
 */
class DogsHomeScreen extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      searchValue: "",
      dogs: [],
      selectedDogId: ""
    };
  }

  componentDidMount() {
    updateProfileState(this);
    // fetch profile every second
    this.interval = setInterval(() => updateProfileState(this), 1 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _renderSearchBar = () => (
    <SearchBar
      round
      containerStyle={{
        backgroundColor: "transparent",
        marginTop: 50,
        width: "60%"
      }}
      inputStyle={{
        backgroundColor: "transparent",
        fontSize: 20
      }}
      lightTheme={true}
      searchIcon={{ size: 24 }}
      onChangeText={value => this.setState({ searchValue: value })}
      onClear={() => this.setState({ searchValue: "" })}
      placeholder="Enter K9 name..."
    />
  );

  _renderViewDogButton = dogId => (
    <Button
      transparent
      title="View"
      textStyle={outlineButtonTextStyle}
      onPress={() => this.setState({ selectedDogId: dogId })}
    />
  );

  _renderDogsTable = () => {
    const headers = ["Dogs", ""];
    let dogRows = [];

    this.state.dogs.map((dog, i) => {
      const dogId = dog._id;
      const dogName = dog.name;

      const rowData = [dogName, this._renderViewDogButton(dogId)];

      if (
        !this.state.searchValue ||
        dogName.startsWith(this.state.searchValue)
      ) {
        dogRows.push(
          <View key={dogId} style={{ flexDirection: "row" }}>
            {rowData.map((cellData, j) => {
              return (
                <Cell
                  key={j}
                  data={cellData}
                  style={[
                    {
                      borderColor: "transparent",
                      width: 120,
                      height: 50
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
      }
    });

    return (
      <View>
        <Table
          style={{ ...styles.tableContainer, marginTop: 20 }}
          borderStyle={{ borderColor: "transparent" }}
        >
          <TableWrapper style={{ flexDirection: "row" }}>
            <Row
              data={headers}
              style={{ ...styles.tableHeader, width: 300 }}
              textStyle={styles.tableHeaderText}
            />
          </TableWrapper>
          <ScrollView>{dogRows}</ScrollView>
        </Table>
      </View>
    );
  };

  _renderSessionsByDateTable = () => {
    const headers = ["Date", "Type", ""];
    let sessionRows = [];

    // this.state.dogs.map((dog, i) => {
    //   const dogId = dog._id;
    //   const rowData = [
    //     dog.name,
    //     this._renderViewDogButton(dogId),
    //     this._renderDeleteDogButton(dogId)
    //   ];

    //   dogRows.push(
    //     <View key={dogId} style={{ flexDirection: "row", marginLeft: 20 }}>
    //       {rowData.map((cellData, j) => {
    //         return (
    //           <Cell
    //             key={j}
    //             data={cellData}
    //             style={[
    //               {
    //                 borderColor: "transparent",
    //                 width: 120,
    //                 height: 50
    //               },
    //               i % 2 == 0 ? null : oddTableRow
    //             ]}
    //             textStyle={{
    //               fontSize: 18,
    //               fontFamily: "montserrat"
    //             }}
    //           />
    //         );
    //       })}
    //     </View>
    //   );
    // });

    return (
      <View style={styles.sessionsContainer}>
        <Text h4>Sessions By Date</Text>
        <Table
          style={styles.tableContainer}
          borderStyle={{ borderColor: "transparent" }}
        >
          <TableWrapper style={{ flexDirection: "row" }}>
            <Row
              data={headers}
              style={styles.tableHeader}
              textStyle={styles.tableHeaderText}
            />
          </TableWrapper>
          <ScrollView>{sessionRows}</ScrollView>
        </Table>
      </View>
    );
  };

  _renderSessionsByTypeTable = () => {
    const headers = ["Type", "# Sessions", ""];
    let sessionRows = [];

    // this.state.dogs.map((dog, i) => {
    //   const dogId = dog._id;
    //   const rowData = [
    //     dog.name,
    //     this._renderViewDogButton(dogId),
    //     this._renderDeleteDogButton(dogId)
    //   ];

    //   dogRows.push(
    //     <View key={dogId} style={{ flexDirection: "row", marginLeft: 20 }}>
    //       {rowData.map((cellData, j) => {
    //         return (
    //           <Cell
    //             key={j}
    //             data={cellData}
    //             style={[
    //               {
    //                 borderColor: "transparent",
    //                 width: 120,
    //                 height: 50
    //               },
    //               i % 2 == 0 ? null : oddTableRow
    //             ]}
    //             textStyle={{
    //               fontSize: 18,
    //               fontFamily: "montserrat"
    //             }}
    //           />
    //         );
    //       })}
    //     </View>
    //   );
    // });

    return (
      <View style={{
        marginTop: -125
      }}>
        <Text h4>Sessions By Type</Text>
        <Table
          style={styles.tableContainer}
          borderStyle={{ borderColor: "transparent" }}
        >
          <TableWrapper style={{ flexDirection: "row" }}>
            <Row
              data={headers}
              style={styles.tableHeader}
              textStyle={styles.tableHeaderText}
            />
          </TableWrapper>
          <ScrollView>{sessionRows}</ScrollView>
        </Table>
      </View>
    );
  };

  _renderStats = () => {
    const selectedDogId = this.state.selectedDogId;
    if (!selectedDogId) {
      return null;
    }
    const selectedDog = this.state.dogs.find(dog => dog._id === selectedDogId);
    return (
      <View style={{ marginLeft: 50, marginTop: -100 }}>
        <View style={{alignItems:'center'}}>
          <Text h2>{`Viewing sessions for ${selectedDog.name}`}</Text>
        </View>
        <View style={{
          marginTop: 30
        }}>
          {this._renderSessionsByDateTable()}
          {this._renderSessionsByTypeTable()}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.dogsHomeScreenContainer}>
          <View style={{ alignItems: "center" }}>
            {this._renderSearchBar()}
          </View>
          <View style={{ marginLeft: 30 }}>
            {this._renderDogsTable()}
            {this._renderStats()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(225,226,225)",
    alignItems: "center"
  },
  dogsHomeScreenContainer: {
    flexDirection: "column",
    marginTop: 50,
    width: "90%",
    backgroundColor: "white",
    height: "90%"
  },
  tableContainer: {
    marginTop: 25,
    height: 300,
    width: "100%",
    marginLeft: 50,
    flexDirection: "column"
  },
  tableHeader: {
    borderColor: "transparent",
    borderBottomColor: "black",
    borderBottomWidth: 3,
    width: 500
  },
  tableHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 20,
    paddingLeft: 10,
    fontFamily: "montserrat"
  }
});

const selector = formValueSelector("profile");
export default connectReduxForm(
  "profile",
  DogsHomeScreen,
  state => ({
    addTrainerName: selector(state, "add-trainer"),
    addDogName: selector(state, "add-dog-name"),
    addDogStartDate: selector(state, "add-dog-startDtae")
  }),
  dispatch => ({
    loadProfile: () => dispatch({ type: actions.LOAD_USER_PROFILE }),
    addTrainer: trainerInfo =>
      dispatch({ type: actions.ADD_TRAINER, trainerInfo: trainerInfo })
  })
);
